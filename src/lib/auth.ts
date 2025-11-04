import bcrypt from 'bcrypt'

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify a password against a hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Get the hashed password for the admin
export function getAdminPasswordHash(): string {
  // For now, always use the hardcoded hash for 'ziemniak2015'
  // This hash is verified to work: $2b$12$3RrZ1zFUGdZqasSwDIKw/uRA5sqqgmQg0xUv4HnrnvDbG.O3mTzMy
  const defaultHash = '$2b$12$3RrZ1zFUGdZqasSwDIKw/uRA5sqqgmQg0xUv4HnrnvDbG.O3mTzMy'
  
  // In production, you can use environment variable: process.env.ADMIN_PASSWORD_HASH
  // But for now, we'll use the default to ensure it works
  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  
  if (envHash && envHash.length === 60) {
    console.log('Using env hash, length:', envHash.length)
    return envHash
  }
  
  console.log('Using default hash for ziemniak2015, length:', defaultHash.length)
  return defaultHash
}

// Generate a new hash for a password (utility function)
export async function generatePasswordHash(password: string): Promise<string> {
  console.log('Generated hash for password:', password)
  const hash = await hashPassword(password)
  console.log('Hash:', hash)
  return hash
}
