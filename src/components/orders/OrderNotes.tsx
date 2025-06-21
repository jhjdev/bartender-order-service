import React, { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { OrderNote } from '../../types/order';

interface OrderNotesProps {
  notes: OrderNote[];
  onAddNote: (note: Omit<OrderNote, 'timestamp'>) => void;
  currentUser: string;
}

const OrderNotes: React.FC<OrderNotesProps> = ({
  notes,
  onAddNote,
  currentUser,
}) => {
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState<
    'allergy' | 'special_request' | 'general'
  >('general');
  const { isConnected } = useSocket();

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      text: newNote,
      author: currentUser,
      category,
    };

    onAddNote(note);
    setNewNote('');
  };

  const getCategoryColor = (category: OrderNote['category']) => {
    switch (category) {
      case 'allergy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'special_request':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: OrderNote['category']) => {
    switch (category) {
      case 'allergy':
        return '⚠️';
      case 'special_request':
        return '⭐';
      case 'general':
        return '📝';
      default:
        return '📝';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Order Notes</h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Add new note */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as 'allergy' | 'special_request' | 'general'
              )
            }
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Note category"
          >
            <option value="general">General</option>
            <option value="allergy">Allergy</option>
            <option value="special_request">Special Request</option>
          </select>
        </div>

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
        />

        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed"
        >
          Add Note
        </button>
      </div>

      {/* Display notes */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notes yet</p>
            <p className="text-sm">
              Add a note to track special requests or allergies
            </p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div
              key={note._id || index}
              className={`border rounded-lg p-4 ${getCategoryColor(
                note.category
              )}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    {getCategoryIcon(note.category)}
                  </span>
                  <span className="text-sm font-medium">{note.author}</span>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.text}</p>
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(
                    note.category
                  )}`}
                >
                  {note.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderNotes;
