import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LeadForm from '../components/LeadForm';
import NoteForm from '../components/NoteForm';

const STATUS_BADGE = {
  'New'          : 'badge-blue',
  'Contacted'    : 'badge-purple',
  'Qualified'    : 'badge-orange',
  'Proposal Sent': 'badge-yellow',
  'Won'          : 'badge-green',
  'Lost'         : 'badge-red',
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead,    setLead]    = useState(null);
  const [notes,   setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchLead();
    fetchNotes();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch {
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await api.put(`/leads/${id}`, formData);
      setLead(res.data);
      setEditing(false);
    } catch {
      alert('Error updating lead');
    }
  };

  const handleAddNote = async (content) => {
    try {
      await api.post(`/notes/${id}`, { content });
      fetchNotes();
    } catch {
      alert('Error adding note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/note/${noteId}`);
      fetchNotes();
    } catch {
      alert('Error deleting note');
    }
  };

  if (loading) return <div className="loading">Loading lead details...</div>;
  if (!lead)   return null;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/leads')}>
          ← Back to Leads
        </button>
        <button className="btn btn-primary" onClick={() => setEditing(true)}>
          Edit Lead
        </button>
      </div>

      <div className="lead-detail-grid">

        <div className="card">
          <div className="card-header">
            <h2>{lead.lead_name}</h2>
            <span className={`badge ${STATUS_BADGE[lead.status] || 'badge-gray'}`}>
              {lead.status}
            </span>
          </div>
          <div className="detail-grid">
            <DetailRow label="Company"       value={lead.company_name} />
            <DetailRow label="Email"         value={lead.email} />
            <DetailRow label="Phone"         value={lead.phone} />
            <DetailRow label="Lead Source"   value={lead.lead_source} />
            <DetailRow label="Assigned To"   value={lead.assigned_salesperson} />
            <DetailRow
              label="Deal Value"
              value={`Rs. ${Number(lead.deal_value || 0).toLocaleString()}`}
            />
            <DetailRow
              label="Created"
              value={new Date(lead.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            />
            <DetailRow
              label="Last Updated"
              value={new Date(lead.updated_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            />
          </div>
        </div>

        {/* ── Notes Card ───────────────────────────────────────────────── */}
        <div className="card">
          <h3 className="card-title">Notes ({notes.length})</h3>
          <NoteForm onSubmit={handleAddNote} />
          <div className="notes-list">
            {notes.length === 0 ? (
              <p className="empty-msg">No notes yet. Add the first one above.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="note-item">
                  <p className="note-content">{note.content}</p>
                  <div className="note-meta">
                    <span>By <strong>{note.created_by}</strong></span>
                    <span>
                      {new Date(note.created_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric',
                        year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {editing && (
        <LeadForm lead={lead} onSubmit={handleUpdate} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || '—'}</span>
    </div>
  );
}
