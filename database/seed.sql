

USE crm_db;

INSERT IGNORE INTO leads (id, lead_name, company_name, email, phone, lead_source, assigned_salesperson, status, deal_value) VALUES
(1,  'John Smith',        'Tech Corp',       'john@techcorp.com',       '555-0101', 'Website',    'Alice Johnson',  'New',           5000.00),
(2,  'Sarah Davis',       'InnovateCo',      'sarah@innovate.co',       '555-0102', 'LinkedIn',   'Bob Williams',   'Contacted',    12000.00),
(3,  'Mike Johnson',      'StartupXYZ',      'mike@startupxyz.com',     '555-0103', 'Referral',   'Alice Johnson',  'Qualified',    25000.00),
(4,  'Emma Wilson',       'GlobalTech',      'emma@globaltech.com',     '555-0104', 'Cold Email', 'Carol Martinez', 'Proposal Sent',50000.00),
(5,  'Robert Brown',      'MegaCorp',        'robert@megacorp.com',     '555-0105', 'Event',      'Bob Williams',   'Won',          75000.00),
(6,  'Lisa Taylor',       'SmallBiz',        'lisa@smallbiz.com',       '555-0106', 'Website',    'Alice Johnson',  'Lost',          8000.00),
(7,  'David Anderson',    'WebSolutions',    'david@websol.com',        '555-0107', 'LinkedIn',   'Carol Martinez', 'New',          15000.00),
(8,  'Jennifer Martinez', 'DataDriven Inc',  'jennifer@datadriven.com', '555-0108', 'Referral',   'Bob Williams',   'Qualified',    30000.00);

INSERT IGNORE INTO notes (id, lead_id, content, created_by) VALUES
(1, 1, 'Initial contact made via website form. Interested in the enterprise plan.', 'Alice Johnson'),
(2, 2, 'Had a discovery call on Monday. They are evaluating multiple vendors.', 'Bob Williams'),
(3, 3, 'Qualified after a 30-minute demo call. Ready to move forward.', 'Alice Johnson'),
(4, 4, 'Proposal sent. Waiting for budget approval by end of month.', 'Carol Martinez'),
(5, 5, 'Deal closed! Contract signed for a 12-month annual plan.', 'Bob Williams'),
(6, 3, 'Follow-up email sent with case studies and pricing breakdown.', 'Alice Johnson');
