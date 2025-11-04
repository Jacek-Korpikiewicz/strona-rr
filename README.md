# Calendar Website

A simple calendar webpage that displays events from two sources:
1. **Google Calendar** - Linked Google Calendar events
2. **User Entries** - Password-protected user-submitted events

## Features

- Display events from Google Calendar (via public iCal feed)
- Add custom events with password protection
- Merge and display both sources together
- Clean, modern UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the admin password (optional, for production):
```bash
# Generate a password hash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 12).then(console.log)"
```

3. Set environment variable (optional):
```bash
ADMIN_PASSWORD_HASH=$2b$12$...your-hash-here
```

If not set, the default password is `ziemniaki`.

4. Update the Google Calendar ID in `src/app/api/calendar/route.ts` if needed.

5. Run the development server:
```bash
npm run dev
```

## Usage

### Viewing Calendar

Visit `http://localhost:3000` to see the calendar with events from both Google Calendar and user entries.

### Adding Events

1. Go to `/admin` or `/admin/login`
2. Enter the password
3. Fill in the event form:
   - Title (required)
   - Start date/time (required)
   - End date/time (optional)
   - Location (optional)
   - Description (optional)
4. Click "Dodaj wydarzenie"

### Managing Events

In the admin panel, you can:
- View all your custom events
- Delete events you've created

## Data Storage

User calendar events are stored in `data/user-calendar.json` (created automatically).

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- bcrypt (for password hashing)

