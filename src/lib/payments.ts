import { getSupabase, validateSupabaseConfig } from './supabase'

export interface PaymentEntry {
  class: string
  max: number
  wplacone: number
}

// Database interface (matches Supabase table structure)
interface DatabasePayment {
  id: number
  class: string
  type: 'przedszkole' | 'szkola'
  max: number
  wplacone: number
  created_at: string
  updated_at: string
}

// Convert database payment to application format
function dbToAppPayment(dbPayment: DatabasePayment): PaymentEntry {
  return {
    class: dbPayment.class,
    max: Number(dbPayment.max),
    wplacone: Number(dbPayment.wplacone)
  }
}

// Convert application payment to database format
function appToDbPayment(
  payment: PaymentEntry,
  type: 'przedszkole' | 'szkola'
): Omit<DatabasePayment, 'id' | 'created_at' | 'updated_at'> {
  return {
    class: payment.class,
    type: type,
    max: payment.max,
    wplacone: payment.wplacone
  }
}

// Get payments by type
export async function getPaymentsByType(type: 'przedszkole' | 'szkola'): Promise<PaymentEntry[]> {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('type', type)
      .order('class', { ascending: true })

    if (error) {
      console.error(`Error fetching ${type} payments from Supabase:`, error)
      return []
    }

    return (data || []).map(dbToAppPayment)
  } catch (error) {
    console.error(`Error fetching ${type} payments:`, error)
    return []
  }
}

// Get all payments (both types)
export async function getAllPayments(): Promise<{
  przedszkole: PaymentEntry[]
  szkola: PaymentEntry[]
}> {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('type', { ascending: true })
      .order('class', { ascending: true })

    if (error) {
      console.error('Error fetching all payments from Supabase:', error)
      return { przedszkole: [], szkola: [] }
    }

    const payments = (data || []).map(dbToAppPayment)
    
    // Separate by type
    const przedszkole: PaymentEntry[] = []
    const szkola: PaymentEntry[] = []
    
    // We need to get the type from the original data since dbToAppPayment doesn't include it
    if (data) {
      data.forEach((dbPayment) => {
        const payment = dbToAppPayment(dbPayment)
        if (dbPayment.type === 'przedszkole') {
          przedszkole.push(payment)
        } else if (dbPayment.type === 'szkola') {
          szkola.push(payment)
        }
      })
    }

    return {
      przedszkole,
      szkola
    }
  } catch (error) {
    console.error('Error fetching all payments:', error)
    return { przedszkole: [], szkola: [] }
  }
}

// Upsert payments (insert or update)
export async function upsertPayments(
  payments: PaymentEntry[],
  type: 'przedszkole' | 'szkola'
): Promise<boolean> {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()

    // Convert to database format
    const dbPayments = payments.map(payment => ({
      ...appToDbPayment(payment, type),
      // Include id if we want to update existing, or let it auto-generate for new
    }))

    // Use upsert to insert or update based on (class, type) unique constraint
    const { error } = await supabase
      .from('payments')
      .upsert(dbPayments, {
        onConflict: 'class,type',
        ignoreDuplicates: false
      })

    if (error) {
      console.error(`Error upserting ${type} payments to Supabase:`, error)
      throw new Error(`Failed to save payments: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error(`Error upserting ${type} payments:`, error)
    throw error
  }
}

// Delete a payment
export async function deletePayment(
  class: string,
  type: 'przedszkole' | 'szkola'
): Promise<boolean> {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('class', class)
      .eq('type', type)

    if (error) {
      console.error('Error deleting payment from Supabase:', error)
      throw new Error(`Failed to delete payment: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting payment:', error)
    throw error
  }
}

