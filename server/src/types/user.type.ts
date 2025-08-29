import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    email: string;
    name?: string;
    dob?: Date;
  
    // OTP flow
    otp?: string | null;
    otpExpiry?: Date | null;
  
    // Google flow
    googleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }