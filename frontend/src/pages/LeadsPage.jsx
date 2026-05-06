import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LeadForm from '../components/LeadForm';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES  = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const STATUS_BADGE = {
  'New'          : 'badge-blue',
  'Contacted'    : 'badge-purple',
  'Qualified'    : 'badge-orange',
  'Proposal Sent': 'badge-yellow',
  'Won'          : 'badge-green',
  'Lost'         : 'badge-red',
};

const EMPTY_FILTERS = { status: '', lead_source: '', assigned_salesperson: '', search: '' };

export default function LeadsPage() {
  const [leads,        setLeads]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editingLead,  setEditingLead]  = useState(null);
  const [filters,      setFilters]      = useState(EMPTY_FILTERS);
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status)               params.status               = filters.status;
      if (filters.lead_source)          params.lead_source          = filters.lead_source;
      if (filters.assigned_salesperson) params.assigned_salesperson = filters.assigned_salesperson;
      if (filters.search)               params.search               = filters.search;

      const res = await api.get('/leads', { params });
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleCreate = async (formData) => {
    try {
      await api.post('/leads', formData);
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating lead');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/leads/${editingLead.id}`, formData);
      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating lead');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch {
      alert('Error deleting lead');
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Leads</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Lead
        </button>
      </div>

      <div className="filters-bar">
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="🔍  Search name, company, email..."
          className="filter-search"
        />
        <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="lead_source" value={filters.lead_source} onChange={handleFilterChange} className="filter-select">
          <option value="">All Sources</option>
          {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          name="assigned_salesperson"
          value={filters.assigned_salesperson}
          onChange={handleFilterChange}
          placeholder="Filter by salesperson..."
          className="filter-search"
          style={{ maxWidth: 210 }}
        />
        <button onClick={() => setFilters(EMPTY_FILTERS)} className="btn btn-secondary btn-sm">
          Clear
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading leads...</div>
      ) : (
        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Source</th>
                <th>Salesperson</th>
                <th>Status</th>
                <th>Deal Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">
                    No leads found. Try adjusting your filters or add a new lead.
                  </td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="lead-row">
                    <td>
                      <button className="link-btn" onClick={() => navigate(`/leads/${lead.id}`)}>
                        {lead.lead_name}
                      </button>
                    </td>
                    <td>{lead.company_name || '—'}</td>
                    <td>{lead.email || '—'}</td>
                    <td>{lead.lead_source}</td>
                    <td>{lead.assigned_salesperson || '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[lead.status] || 'badge-gray'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>Rs. {Number(lead.deal_value || 0).toLocaleString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditingLead(lead)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(lead.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm    && <LeadForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingLead && <LeadForm lead={editingLead} onSubmit={handleUpdate} onClose={() => setEditingLead(null)} />}
    </div>
  );
}
