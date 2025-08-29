# Server Setup Guide

## Environment Variables

Create a `.env` file in the server directory with the following content:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://ritik:Ritik%406377@cluster0.xwwzy.mongodb.net/notes-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=supersecretjwtkey123

# Google OAuth
GOOGLE_CLIENT_ID=1049811159085-fs4mdksrtsi3ctdvb3cgn8q7qtchn8gh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Email (Gmail)
EMAIL_USER=ritikdangi445566@gmail.com
EMAIL_PASS=nwqyolqpdkxxxzpu

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
