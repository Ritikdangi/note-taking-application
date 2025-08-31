# Note Taking App - Authentication Only

A full-stack note-taking application with OTP-based authentication and Google OAuth integration. This version includes only the authentication functionality.

## Features

- **OTP-Based Authentication**: Secure email + OTP verification
- **Google OAuth**: One-click sign-in with Google
- **Dashboard**: Simple Hello World dashboard (notes functionality coming in next phase)
- **Mobile & Web Responsive**: Works perfectly on all devices
- **Modern UI**: Professional design with Tailwind CSS

## Tech Stack

### Frontend (Client)
- React 19 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router DOM (Routing)

### Backend (Server)
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email service)
- Google OAuth

## Project Structure

```
note-taking-app/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── assets/        # Images and static files
│   ├── SETUP.md           # Client setup guide
│   └── package.json
├── server/                 # Backend Node.js app
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── SETUP.md           # Server setup guide
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account for email service

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with your configuration
# See server/SETUP.md for the exact content
```

**Environment Variables (.env):**
```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/notes-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Client URL
CLIENT_URL=
```

**Start the server:**
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file with your configuration
# See client/SETUP.md for the exact content
```

**Environment Variables (.env):**
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

**Start the client:**
```bash
npm run dev
```

## Authentication Flow

### Sign Up Process
1. User fills registration form (Name, Date of Birth, Email)
2. Clicks "Get OTP" → Backend sends OTP to email
3. If user already exists → Shows message to sign in instead
4. User enters OTP on verification page
5. Account created → Redirected to Dashboard

### Sign In Process
1. User enters email
2. Clicks "Resend OTP" → Receives OTP (with 59-second countdown)
3. Enters OTP → Authenticated → Dashboard

### Google OAuth
1. User clicks "Continue with Google" (available on both signup and signin)
2. Google OAuth popup appears
3. User authenticates → Direct access to Dashboard

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Send OTP for registration
- `POST /api/auth/verify-otp` - Verify OTP and authenticate
- `POST /api/auth/google` - Google OAuth authentication

### Notes (Protected Routes)
- `POST /api/notes/create` - Create a new note
- `GET /api/notes/get` - Get all notes (with pagination/filters)
- `GET /api/notes/get/:id` - Get single note by ID
- `PUT /api/notes/update/:id` - Update a note
- `DELETE /api/notes/remove/:id` - Delete a note

## Pages & Routes

- `/signup` - Registration page
- `/signin` - Login page
- `/verify-otp` - OTP verification page
- `/dashboard` - Simple Hello World dashboard (protected)

## Dashboard Features (Current)

- **Simple Layout**: Hello World message with welcome text
- **Header**: Logo and sign out button
- **Sign Out**: Logout functionality

## Key Features Implemented

### ✅ Layout & Design
- Non-scrollable pages
- Full image background (no blue border)
- Responsive design for mobile and web
- Professional UI matching your mockups

### ✅ Authentication
- Email + OTP authentication
- Google OAuth integration
- JWT token management
- Protected routes

### ✅ Backend Integration
- Connected to your existing API endpoints
- Error handling and loading states
- Proper data flow between frontend and backend

### ✅ User Experience
- Loading states during API calls
- Error messages for failed operations
- Smooth navigation between pages
- Persistent authentication

## Development Commands

### Backend
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Frontend
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```



## Troubleshooting

### Common Issues
1. **CORS Error**: Ensure CLIENT_URL is set correctly in backend .env
2. **MongoDB Connection**: Check MONGO_URI format and network access
3. **Email Not Sending**: Verify Gmail credentials and App Password
4. **Google OAuth**: Ensure client ID is correct and origins are authorized

### Google OAuth 403 Error Fix
If you get "The given origin is not allowed for the given client ID" error:

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

### Development Tips
- Use browser dev tools to check network requests
- Check server logs for backend errors
- Verify environment variables are loaded correctly
- Test OTP functionality with real email addresses

