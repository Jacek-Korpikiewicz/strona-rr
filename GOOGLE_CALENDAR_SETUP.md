# Google Calendar Integration Setup

## Current Status
✅ **Calendar ID configured**: `MTEyMTQ2MzllM2U5ZTZhODJmZTUyNDY3ZDQ0MTMzNzlmZjE3NGU3YjU4ODQ2NjYwMWRiZTg1NmRhN2IyMDIxZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t@group.calendar.google.com`

✅ **API structure ready**: The calendar component now fetches data from `/api/calendar`

✅ **Fallback data**: Currently shows static events, but ready for real Google Calendar data

## To Enable Real Google Calendar Integration:

### 1. Get Google Calendar API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```
   GOOGLE_CALENDAR_API_KEY=your_actual_api_key_here
   ```

### 3. Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000` - the calendar should now show real events from your Google Calendar

## Features

### Current Implementation:
- **Static fallback**: Shows sample events when no API key is configured
- **Real-time data**: Fetches actual events when API key is provided
- **Responsive design**: Beautiful card layout for events
- **Polish localization**: Dates and times in Polish format
- **Direct links**: Each event links to Google Calendar
- **All-day events**: Properly handles all-day events vs timed events

### Event Display:
- Event title and date
- Time (for timed events)
- Location (if available)
- Description (if available)
- Direct link to Google Calendar

### Calendar URL:
Your calendar is accessible at:
https://calendar.google.com/calendar/u/1?cid=MTEyMTQ2MzllM2U5ZTZhODJmZTUyNDY3ZDQ0MTMzNzlmZjE3NGU3YjU4ODQ2NjYwMWRiZTg1NmRhN2IyMDIxZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

## API Endpoints

- `GET /api/calendar` - Returns calendar events in JSON format
- Returns static data if no API key is configured
- Returns real Google Calendar data if API key is provided

## Security Notes

- API key is stored in environment variables (not committed to git)
- Calendar ID is public (group calendar)
- No authentication required for reading public calendar events
- API key should be restricted to your domain in production

## Troubleshooting

1. **Events not loading**: Check if API key is correctly set in `.env.local`
2. **CORS errors**: Make sure you're running the development server locally
3. **Empty calendar**: Verify the calendar ID is correct and has public events
4. **API quota exceeded**: Check your Google Cloud Console for API usage limits

## Next Steps

1. Set up the API key as described above
2. Test with real calendar data
3. Customize event display as needed
4. Add more calendar features (filtering, categories, etc.)
