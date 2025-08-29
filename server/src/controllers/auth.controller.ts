import { Request, Response } from "express";
import { googleAuthService, sendOtp , verifyOtpService } from "../services/auth.service";
export const signupWithOtp = async(req : Request, res : Response)=>{
   
     try{
       const { email , name , dob} = req.body;
       
      const result = await sendOtp(name ,dob,email);
      res.json(result);
     
     }
     catch (err: any) {
        res.status(400).json({ message: err.message });
      }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await verifyOtpService(email, otp);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const googleAuth = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const result = await googleAuthService(token);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };