import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api/axios';

const STAT_CONFIG = [
  { key: 'totalLeads',      label: 'Total Leads',        color: 'blue',    fmt: 'number' },
  { key: 'newLeads',        label: 'New Leads',          color: 'purple',  fmt: 'number' },
  { key: 'qualifiedLeads',  label: 'Qualified',          color: 'orange',  fmt: 'number' },
  { key: 'wonLeads',        label: 'Won',                color: 'green',   fmt: 'number' },
  { key: 'lostLeads',       label: 'Lost',               color: 'red',     fmt: 'number' },
  { key: 'totalDealValue',  label: 'Total Deal Value',   color: 'teal',    fmt: 'currency' },
  { key: 'wonDealValue',    label: 'Won Deal Value',     color: 'emerald', fmt: 'currency' },
];

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const downloadPDF = async () => {
    // Fetch all leads for the report
    const leadsRes = await api.get('/leads');
    const leads = leadsRes.data;

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();


    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text('CRM Dashboard Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${today}`, 14, 28);


    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('Summary', 14, 40);

    autoTable(doc, {
      startY: 44,
      head: [['Metric', 'Value']],
      body: STAT_CONFIG.map(({ key, label, fmt }) => [
        label,
        fmt === 'currency'
          ? `Rs. ${Number(stats?.[key] || 0).toLocaleString()}`
          : String(stats?.[key] ?? 0),
      ]),
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      styles: { fontSize: 11 },
    });


    const afterSummary = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('All Leads', 14, afterSummary);

    autoTable(doc, {
      startY: afterSummary + 4,
      head: [['Name', 'Company', 'Status', 'Salesperson', 'Deal Value (Rs.)']],
      body: leads.map(l => [
        l.lead_name,
        l.company_name || '—',
        l.status,
        l.assigned_salesperson || '—',
        Number(l.deal_value || 0).toLocaleString(),
      ]),
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      styles: { fontSize: 9 },
    });

    doc.save(`CRM_Report_${today.replace(/\//g, '-')}.pdf`);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error)   return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button onClick={downloadPDF} className="btn btn-primary">
          ⬇ Download PDF Report
        </button>
      </div>

      <div className="stats-grid">
        {STAT_CONFIG.map(({ key, label, color, fmt }) => (
          <StatCard
            key={key}
            title={label}
            value={fmt === 'currency'
              ? `Rs. ${Number(stats?.[key] || 0).toLocaleString()}`
              : stats?.[key] ?? 0}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <p className="stat-label">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
