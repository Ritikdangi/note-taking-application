import React from 'react';
import type { Note } from '../services/api';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit?: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-4 mb-3 flex items-center justify-between hover:shadow-md transition-shadow"
      style={{ backgroundColor: note.color || '#ffffff' }}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
          {note.title}
        </h3>
        <p className="text-gray-600 text-sm overflow-hidden" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical' 
        }}>
          {note.content}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          {new Date(note.updatedAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {onEdit && (
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Delete note"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
