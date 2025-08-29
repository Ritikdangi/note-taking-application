import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/email";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const sendOtp = async (name: string, dob: Date, email: string) => {
    let user = await User.findOne({ email });
  
    if (!user) {
      user = new User({ email, name, dob });
    } else {
      // if already exists, update name/dob in case they are missing
      user.name = name || user.name;
      user.dob = dob || user.dob;
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
  
    //  Send OTP via email
    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It will expire in  10 minutes.`);
  
    return { message: "OTP sent to email" };
  };
  
  export const verifyOtpService = async (email: string, otp: string) => {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
      throw new Error("Invalid or expired OTP");
    }
  
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
  
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  
    return { token, user };
  };

  export const googleAuthService = async (token: string) => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  
    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");
  
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      });
      await user.save();
    }
  
    const appToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  
    return { token: appToken, user };
  };