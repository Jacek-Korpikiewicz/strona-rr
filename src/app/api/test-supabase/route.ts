import { NextResponse } from 'next/server'
import { getSupabase, validateSupabaseConfig } from '@/lib/supabase'

export async function GET() {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    
    // Test connection by fetching events
    const { data: fetchData, error: fetchError } = await supabase
      .from('user_calendar_events')
      .select('*')
      .limit(1)
    
    if (fetchError) {
      return NextResponse.json({
        success: false,
        test: 'fetch',
        error: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint
      }, { status: 500 })
    }
    
    // Test insert (then delete it)
    const testEvent = {
      id: `test-${Date.now()}`,
      title: 'Test Event',
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      description: null,
      location: null
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_calendar_events')
      .insert(testEvent)
      .select()
      .single()
    
    if (insertError) {
      return NextResponse.json({
        success: false,
        test: 'insert',
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        message: 'RLS policy might be blocking inserts. Check your Supabase RLS policies.'
      }, { status: 500 })
    }
    
    // Clean up test event
    if (insertData) {
      await supabase
        .from('user_calendar_events')
        .delete()
        .eq('id', testEvent.id)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection and insert working!',
      eventsCount: fetchData?.length || 0,
      insertTest: 'passed'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

