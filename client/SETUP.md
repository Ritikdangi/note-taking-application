# Client Setup Guide

## Environment Variables

Create a `.env` file in the client directory with the following content:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Sample User Data (for development)
VITE_SAMPLE_USER_NAME=John Doe
VITE_SAMPLE_USER_EMAIL=john.doe@example.com
VITE_SAMPLE_USER_DOB=1990-01-01
```

## Steps to Setup

1. Copy the above content into a new file named `.env` in the client directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

The client will be running on http://localhost:5173

## Google OAuth Configuration

To fix the 403 error, you need to configure the authorized origins in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID and click on it
5. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173`
   - `http://localhost:3000` (if using different port)
6. Under "Authorized redirect URIs", add:
   - `http://localhost:5173`
   - `http://localhost:5173/`
7. Click "Save"

This will resolve the "The given origin is not allowed for the given client ID" error.

## Notes

- All environment variables in Vite must be prefixed with `VITE_`
- The API base URL points to your backend server
- Google Client ID is used for OAuth authentication
- Sample user data is used for development/testing purposes only
