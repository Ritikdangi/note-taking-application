import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { 
  createNote, 
  getNotes, 
  getNoteById, 
  updateNote, 
  deleteNote
} from '../controllers/note.controller';

const router = Router();

// Note CRUD operations - all require authentication
router.post('/create', authenticateUser, createNote);
router.get('/get', authenticateUser, getNotes);
router.get('/get/:id', authenticateUser, getNoteById);
router.put('/update/:id', authenticateUser, updateNote);
router.delete('/remove/:id', authenticateUser, deleteNote);



export default router;