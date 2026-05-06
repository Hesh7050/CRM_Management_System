import React, { useState, useEffect } from 'react';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES  = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

export default function LeadForm({ lead, onSubmit, onClose }) {
  const [form, setForm] = useState({
    lead_name            : '',
    company_name         : '',
    email                : '',
    phone                : '',
    lead_source          : 'Website',
    assigned_salesperson : '',
    status               : 'New',
    deal_value           : '',
  });

  useEffect(() => {
    if (lead) {
      setForm({
        lead_name            : lead.lead_name             || '',
        company_name         : lead.company_name          || '',
        email                : lead.email                 || '',
        phone                : lead.phone                 || '',
        lead_source          : lead.lead_source           || 'Website',
        assigned_salesperson : lead.assigned_salesperson  || '',
        status               : lead.status                || 'New',
        deal_value           : lead.deal_value            != null ? lead.deal_value : '',
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Lead Name *</label>
              <input name="lead_name" value={form.lead_name} onChange={handleChange} required placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="555-0100" />
            </div>
            <div className="form-group">
              <label>Lead Source</label>
              <select name="lead_source" value={form.lead_source} onChange={handleChange}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Salesperson</label>
              <input name="assigned_salesperson" value={form.assigned_salesperson} onChange={handleChange} placeholder="Name of rep" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Deal Value (Rs.)</label>
              <input name="deal_value" type="number" min="0" step="0.01" value={form.deal_value} onChange={handleChange} placeholder="0.00" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {lead ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
