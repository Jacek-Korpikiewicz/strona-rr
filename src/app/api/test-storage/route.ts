import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test if storage bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to list buckets',
        details: bucketsError.message
      }, { status: 500 })
    }

    const announcementsBucket = buckets?.find(bucket => bucket.name === 'announcements')
    
    if (!announcementsBucket) {
      return NextResponse.json({ 
        success: false, 
        error: 'Announcements bucket not found',
        message: 'Please create a storage bucket named "announcements" in Supabase Dashboard',
        availableBuckets: buckets?.map(b => b.name) || []
      }, { status: 404 })
    }

    // Test if we can list files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('announcements')
      .list('lesson-plans', { limit: 1 })

    if (filesError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to access bucket contents',
        details: filesError.message,
        bucketExists: true
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Storage bucket is properly configured',
      bucket: announcementsBucket,
      filesCount: files?.length || 0
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Storage test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
