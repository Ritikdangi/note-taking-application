# Note Taking App - Client

A modern React TypeScript application with OTP-based authentication.

## Features

- **Sign Up Flow**: Complete registration with OTP verification
- **Sign In Flow**: OTP-based authentication
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Authentication Flow

### Sign Up Process
1. User fills out registration form (Name, Date of Birth, Email)
2. Clicks "Get OTP" button
3. Redirected to OTP verification page
4. Enters 6-digit OTP code
5. Account is created upon successful verification

### Sign In Process
1. User enters email address
2. Clicks "Resend OTP" to receive verification code
3. Enters OTP code
4. Option to "Keep me logged in"
5. Successfully authenticated

## Pages

- `/signup` - Registration page
- `/signin` - Login page  
- `/verify-otp` - OTP verification page

## Components

- `AuthLayout` - Layout wrapper with background image
- `Input` - Reusable form input component
- `Button` - Reusable button component

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── assets/             # Static assets (images, etc.)
├── App.tsx            # Main app component with routing
└── main.tsx           # Application entry point
```

## API Integration

The application is ready for backend integration. Currently, all API calls are logged to the console. Replace the console.log statements with actual API calls to your backend service.

### Key API Endpoints to Implement:
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and create account
- `POST /api/auth/login` - Sign in with OTP
- `POST /api/auth/resend-otp` - Resend OTP

## Styling

The application uses Tailwind CSS for styling with a clean, modern design that matches the provided UI mockups. The design includes:

- Rounded corners and shadows for cards
- Blue color scheme for primary actions
- Responsive layout that works on all screen sizes
- Professional typography and spacing
