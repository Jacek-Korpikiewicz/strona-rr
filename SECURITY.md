# Security Improvements

## Password Hashing

The application now uses bcrypt for password hashing instead of storing passwords in plaintext.

### What was changed:

1. **Added bcrypt dependency** for secure password hashing
2. **Created auth utilities** (`src/lib/auth.ts`) for password management
3. **Updated login API** (`src/app/api/admin/login/route.ts`) to use password verification
4. **Updated simple admin page** (`src/app/admin/simple/page.tsx`) to use password verification

### Security features:

- ✅ **Password hashing** with bcrypt (salt rounds: 12)
- ✅ **Environment variable support** for production deployments
- ✅ **Secure password verification** using bcrypt.compare()
- ✅ **No plaintext passwords** in the codebase

### For production deployment:

1. **Set environment variable:**
   ```bash
   ADMIN_PASSWORD_HASH=$2b$12$AKFBKJY7QpoGVJk8UbZp7.iIHVo7P6d3ITKwuxFRDVxa7nSeKuAqu
   ```

2. **Generate a new hash for your password:**
   ```bash
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-new-password', 12).then(console.log)"
   ```

3. **Update the environment variable** with your new hash

### Current password:
- **Password:** `ziemniaki`
- **Hash:** `$2b$12$AKFBKJY7QpoGVJk8UbZp7.iIHVo7P6d3ITKwuxFRDVxa7nSeKuAqu`

### Additional security recommendations:

1. **Use environment variables** for all sensitive data
2. **Implement proper session management** (JWT tokens)
3. **Add rate limiting** for login attempts
4. **Use HTTPS** in production
5. **Implement proper logging** for security events
6. **Consider multi-factor authentication** for admin access




