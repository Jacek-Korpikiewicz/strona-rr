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
  // In production, use environment variable: process.env.ADMIN_PASSWORD_HASH
  // For development, fallback to the hardcoded hash for 'ziemniaki'
  return process.env.ADMIN_PASSWORD_HASH || '$2b$12$AKFBKJY7QpoGVJk8UbZp7.iIHVo7P6d3ITKwuxFRDVxa7nSeKuAqu'
}

// Generate a new hash for a password (utility function)
export async function generatePasswordHash(password: string): Promise<string> {
  console.log('Generated hash for password:', password)
  const hash = await hashPassword(password)
  console.log('Hash:', hash)
  return hash
}
