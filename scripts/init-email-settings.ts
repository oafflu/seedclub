import { supabase } from '@/lib/supabase/client'

async function initializeEmailSettings() {
  try {
    // Check if we already have email settings
    const { data: existingSettings, error: fetchError } = await supabase
      .from('email_settings')
      .select('*')
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw fetchError
    }

    if (existingSettings) {
      console.log('✅ Email settings already exist:', existingSettings)
      return
    }

    // Insert default SMTP configuration
    const { data, error } = await supabase
      .from('email_settings')
      .insert([
        {
          provider: 'smtp',
          active: true,
          from_email: 'noreply@seedclub.com',
          smtp_config: {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
              user: '',
              pass: ''
            }
          }
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('✅ Default email settings initialized:', data)
  } catch (error) {
    console.error('❌ Failed to initialize email settings:', error)
    process.exit(1)
  }
}

initializeEmailSettings() 