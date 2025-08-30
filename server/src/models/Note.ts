import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  color?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    color: { 
      type: String, 
      default: '#ffffff',
      enum: ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed']
    },
    tags: [{ 
      type: String, 
      trim: true 
    }]
  },
  { timestamps: true }
);

// Index for faster queries
noteSchema.index({ userId: 1, createdAt: -1 });

export const Note = mongoose.model<INote>('Note', noteSchema);
