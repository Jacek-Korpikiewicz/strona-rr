export interface VotingOption {
  id: string
  text: string
  votes: number
}

export interface Voting {
  id: number
  title: string
  description: string
  options: VotingOption[]
  endDate: string
  createdAt: string
  status: 'active' | 'upcoming' | 'closed'
  totalVotes: number
}

export interface Vote {
  id: string
  votingId: number
  optionId: string
  voterId: string
  timestamp: string
}

// Load votings from JSON file
export async function loadVotings(): Promise<Voting[]> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'src/data/votings.json')
    const data = await fs.readFile(filePath, 'utf8')
    const votings = JSON.parse(data)
    
    // Update status based on end date
    const now = new Date()
    return votings.map((voting: Voting) => {
      const endDate = new Date(voting.endDate)
      if (endDate <= now) {
        return { ...voting, status: 'closed' as const }
      } else if (new Date(voting.createdAt) > now) {
        return { ...voting, status: 'upcoming' as const }
      } else {
        return { ...voting, status: 'active' as const }
      }
    })
  } catch (error) {
    console.error('Error loading votings:', error)
    // Return empty array if file doesn't exist or is invalid
    return []
  }
}

// Save votings to JSON file
export async function saveVotings(votings: Voting[]): Promise<void> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'src/data/votings.json')
    await fs.writeFile(filePath, JSON.stringify(votings, null, 2))
  } catch (error) {
    console.error('Error saving votings:', error)
    throw error
  }
}

// Load votes from JSON file
export async function loadVotes(): Promise<Vote[]> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'src/data/votes.json')
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading votes:', error)
    return []
  }
}

// Save votes to JSON file
export async function saveVotes(votes: Vote[]): Promise<void> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'src/data/votes.json')
    await fs.writeFile(filePath, JSON.stringify(votes, null, 2))
  } catch (error) {
    console.error('Error saving votes:', error)
    throw error
  }
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
