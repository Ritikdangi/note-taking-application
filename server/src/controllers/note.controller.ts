import { Request, Response } from 'express';
import { Note, INote } from '../models/Note';

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    console.log('=== CREATE NOTE DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('========================');
    
    const { title, content, color, tags } = req.body;
    const userId = (req as any).user.userId; // From auth middleware

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({
      title,
      content,
      userId,
      color: color || '#ffffff',
      tags: tags || []
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

// Get all notes for a user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 10, search, color } = req.query;

    const query: any = { userId };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Add color filter
    if (color) {
      query.color = color;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalNotes: total,
        hasNext: skip + notes.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// Get a single note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const note = await Note.findOne({ _id: id, userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch note' });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { title, content, color, tags } = req.body;

    const note = await Note.findOne({ _id: id, userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (tags !== undefined) note.tags = tags;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const note = await Note.findOneAndDelete({ _id: id, userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};




