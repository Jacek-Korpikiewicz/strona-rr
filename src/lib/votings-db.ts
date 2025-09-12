import { supabase, Voting, VotingOption, Vote } from './supabase'

// Load votings from Supabase
export async function loadVotings(): Promise<Voting[]> {
  try {
    const { data: votings, error: votingsError } = await supabase
      .from('votings')
      .select(`
        *,
        voting_options (*)
      `)
      .order('created_at', { ascending: false })

    if (votingsError) {
      console.error('Error loading votings:', votingsError)
      return []
    }

    // Transform the data to match our interface
    const transformedVotings = votings?.map(voting => {
      const now = new Date()
      const endDate = new Date(voting.end_date)
      const createdAt = new Date(voting.created_at)
      
      let status: 'active' | 'upcoming' | 'closed'
      if (endDate <= now) {
        status = 'closed'
      } else if (createdAt > now) {
        status = 'upcoming'
      } else {
        status = 'active'
      }

      // Calculate total votes
      const totalVotes = voting.voting_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0

      return {
        id: voting.id,
        title: voting.title,
        description: voting.description,
        endDate: voting.end_date,
        createdAt: voting.created_at,
        status,
        totalVotes,
        options: voting.voting_options?.map((option: any) => ({
          id: option.id,
          text: option.text,
          votes: option.votes || 0
        })) || []
      }
    }) || []

    return transformedVotings
  } catch (error) {
    console.error('Error loading votings:', error)
    return []
  }
}

// Get voting by ID
export async function getVotingById(id: number): Promise<Voting | null> {
  try {
    const { data: voting, error: votingError } = await supabase
      .from('votings')
      .select(`
        *,
        voting_options (*)
      `)
      .eq('id', id)
      .single()

    if (votingError) {
      console.error('Error loading voting:', votingError)
      return null
    }

    const now = new Date()
    const endDate = new Date(voting.end_date)
    const createdAt = new Date(voting.created_at)
    
    let status: 'active' | 'upcoming' | 'closed'
    if (endDate <= now) {
      status = 'closed'
    } else if (createdAt > now) {
      status = 'upcoming'
    } else {
      status = 'active'
    }

    const totalVotes = voting.voting_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0

    return {
      id: voting.id,
      title: voting.title,
      description: voting.description,
      endDate: voting.end_date,
      createdAt: voting.created_at,
      status,
      totalVotes,
      options: voting.voting_options?.map((option: any) => ({
        id: option.id,
        text: option.text,
        votes: option.votes || 0
      })) || []
    }
  } catch (error) {
    console.error('Error loading voting:', error)
    return null
  }
}

// Add new voting
export async function addVoting(voting: Omit<Voting, 'id' | 'createdAt' | 'status' | 'totalVotes'>): Promise<Voting | null> {
  try {
    // Start a transaction
    const { data: votingData, error: votingError } = await supabase
      .from('votings')
      .insert([{
        title: voting.title,
        description: voting.description,
        end_date: voting.endDate
      }])
      .select()
      .single()

    if (votingError) {
      console.error('Error adding voting:', votingError)
      return null
    }

    // Add voting options
    if (voting.options.length > 0) {
      const optionsToInsert = voting.options.map(option => ({
        id: option.id,
        voting_id: votingData.id,
        text: option.text,
        votes: 0
      }))

      const { error: optionsError } = await supabase
        .from('voting_options')
        .insert(optionsToInsert)

      if (optionsError) {
        console.error('Error adding voting options:', optionsError)
        return null
      }
    }

    // Return the complete voting object
    return getVotingById(votingData.id)
  } catch (error) {
    console.error('Error adding voting:', error)
    return null
  }
}

// Update voting
export async function updateVoting(id: number, updates: Partial<Omit<Voting, 'id' | 'createdAt' | 'status' | 'totalVotes'>>): Promise<Voting | null> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (updates.title) updateData.title = updates.title
    if (updates.description) updateData.description = updates.description
    if (updates.endDate) updateData.end_date = updates.endDate

    const { error } = await supabase
      .from('votings')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating voting:', error)
      return null
    }

    return getVotingById(id)
  } catch (error) {
    console.error('Error updating voting:', error)
    return null
  }
}

// Delete voting
export async function deleteVoting(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('votings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting voting:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting voting:', error)
    return false
  }
}

// Load votes for a voting
export async function loadVotes(votingId: number): Promise<Vote[]> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('voting_id', votingId)

    if (error) {
      console.error('Error loading votes:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error loading votes:', error)
    return []
  }
}

// Add vote
export async function addVote(vote: Omit<Vote, 'timestamp'>): Promise<Vote | null> {
  try {
    console.log('Adding vote:', vote)
    
    // Check if this IP has already voted on this voting
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('voting_id', vote.votingId)
      .eq('ip_address', vote.ipAddress)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking existing vote:', checkError)
      return null
    }

    if (existingVote) {
      console.log('Vote already exists for this IP on this voting')
      return null // Return null to indicate duplicate vote
    }
    
    const { data, error } = await supabase
      .from('votes')
      .insert([{
        id: vote.id,
        voting_id: vote.votingId,
        option_id: vote.optionId,
        voter_id: vote.voterId,
        ip_address: vote.ipAddress,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding vote:', error)
      return null
    }

    console.log('Vote added successfully:', data)

    // Update the voting option vote count
    const { data: optionData, error: optionError } = await supabase
      .from('voting_options')
      .select('votes')
      .eq('id', vote.optionId)
      .single()

    if (optionError) {
      console.error('Error fetching option:', optionError)
    } else {
      const newVoteCount = (optionData.votes || 0) + 1
      const { error: updateError } = await supabase
        .from('voting_options')
        .update({ votes: newVoteCount })
        .eq('id', vote.optionId)

      if (updateError) {
        console.error('Error updating vote count:', updateError)
      } else {
        console.log('Vote count updated successfully to:', newVoteCount)
      }
    }

    return data
  } catch (error) {
    console.error('Error adding vote:', error)
    return null
  }
}

// Check if user already voted (by IP address)
export async function hasUserVoted(votingId: number, ipAddress: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('voting_id', votingId)
      .eq('ip_address', ipAddress)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking vote:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error checking vote:', error)
    return false
  }
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}
