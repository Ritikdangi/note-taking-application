import mongoose , {Document ,Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user.type';

const userSchema = new Schema<IUser>(
    {
      email: { type: String, required: true, unique: true },
      name: { type: String },
      dob: { type: Date },
      otp: { type: String, default: null },
      otpExpiry: { type: Date, default: null },
      googleId: { type: String, default: null }
    },
    { timestamps: true }
  );
  

export const User = mongoose.model<IUser>("User", userSchema);