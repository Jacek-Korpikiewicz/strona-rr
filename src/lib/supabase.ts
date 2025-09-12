import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Announcement {
  id: number
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  author: string
  category: string
  created_at?: string
  updated_at?: string
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

export interface VotingOption {
  id: string
  text: string
  votes: number
}

export interface Vote {
  id: string
  votingId: number
  optionId: string
  voterId: string
  ipAddress: string
  timestamp: string
}
