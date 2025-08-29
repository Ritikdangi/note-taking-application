# Server Setup Guide

## Environment Variables

Create a `.env` file in the server directory with the following content:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=

# JWT
JWT_SECRET=s

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=G

# Email (Gmail)
EMAIL_USER=m
EMAIL_PASS=

# Client URL
CLIENT_URL=http://localhost:5173
```

## Steps to Setup

1. Copy the above content into a new file named `.env` in the server directory
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

The server will be running on http://localhost:8000

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
