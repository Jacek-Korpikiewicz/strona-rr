import { supabase } from './supabase'

export async function uploadImage(file: File, folder: string = 'lesson-plans'): Promise<string | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('announcements')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('announcements')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const filePath = pathParts.slice(-2).join('/') // Get folder/filename

    const { error } = await supabase.storage
      .from('announcements')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export async function deleteOldLessonPlans(): Promise<void> {
  try {
    // Get all lesson plans except the latest one
    const { data, error } = await supabase
      .from('announcements')
      .select('id, image_url')
      .eq('category', 'Plan')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching lesson plans:', error)
      return
    }

    if (data && data.length > 1) {
      // Keep the first one (latest), delete the rest
      const plansToDelete = data.slice(1)
      
      for (const plan of plansToDelete) {
        // Delete the image file
        if (plan.image_url) {
          await deleteImage(plan.image_url)
        }
        
        // Delete the database record
        await supabase
          .from('announcements')
          .delete()
          .eq('id', plan.id)
      }
    }
  } catch (error) {
    console.error('Error deleting old lesson plans:', error)
  }
}
