

CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

CREATE TABLE IF NOT EXISTS users (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    password      VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id                    INT PRIMARY KEY AUTO_INCREMENT,
    lead_name             VARCHAR(100)  NOT NULL,
    company_name          VARCHAR(100),
    email                 VARCHAR(100),
    phone                 VARCHAR(20),
    lead_source           ENUM('Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event') DEFAULT 'Website',
    assigned_salesperson  VARCHAR(100),
    status                ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost') DEFAULT 'New',
    deal_value            DECIMAL(10, 2) DEFAULT 0.00,
    created_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    lead_id       INT           NOT NULL,
    content       TEXT          NOT NULL,
    created_by    VARCHAR(100)  NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
