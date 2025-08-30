import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
  email : string;
}

interface AuthReq extends Request {
  user?: JwtPayload;
}

export const authenticateUser = async ( req: AuthReq,res: Response,next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
  
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: "Unknown error" });
    }
  }
};
