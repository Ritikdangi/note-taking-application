import { Router } from "express";
import { verifyOtp , googleAuth, signupWithOtp, resendOtp } from "../controllers/auth.controller";
const router = Router();

router.post('/signup' ,signupWithOtp );
router.post('/verify-otp',verifyOtp );
router.post('/resend-otp',resendOtp)
router.post("/google",googleAuth );
export default router;