import React, { useState } from 'react';

export default function NoteForm({ onSubmit }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a note about this lead (e.g. call summary, follow-up info)..."
        rows={3}
        required
      />
      <button type="submit" className="btn btn-primary btn-sm">
        Add Note
      </button>
    </form>
  );
}
