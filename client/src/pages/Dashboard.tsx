import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { apiService } from '../services/api';
import type { Note, CreateNoteData } from '../services/api';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';
import Toast from '../components/Toast';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/signin');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchNotes();
  }, [navigate]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNotes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotes(1, 50, searchTerm);
      setNotes(response.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // If token is invalid, redirect to signin
      if (error instanceof Error && error.message.includes('token')) {
        handleSignOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (data: CreateNoteData) => {
    try {
      setSaving(true);
      if (editingNote) {
        await apiService.updateNote(editingNote._id, data);
        setToast({
          message: 'Note updated successfully!',
          type: 'success',
          isVisible: true
        });
      } else {
        await apiService.createNote(data);
        setToast({
          message: 'Note created successfully!',
          type: 'success',
          isVisible: true
        });
      }
      setModalOpen(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      setToast({
        message: 'Failed to save note. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await apiService.deleteNote(id);
      setToast({
        message: 'Note deleted successfully!',
        type: 'success',
        isVisible: true
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      setToast({
        message: 'Failed to delete note. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="HD Logo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-bold text-gray-900">Dashboard</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Welcome, {user.name} !
          </h2>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>

        {/* Create Note Button */}
        <div className="mb-6">
          <Button
            onClick={openCreateModal}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm"
          >
            Create Note
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500 mb-4">Create your first note to get started!</p>
              <Button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Your First Note
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onEdit={handleEditNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Note Modal */}
      <CreateNoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleCreateNote}
        note={editingNote}
        loading={saving}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Dashboard;
