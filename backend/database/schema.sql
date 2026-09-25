-- ==============================================================================
-- Fynd Traceability – PostgreSQL Relational Schema
-- ==============================================================================

-- Drop tables in reverse foreign-key order for idempotent re-runs
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS reworks CASCADE;
DROP TABLE IF EXISTS defects CASCADE;
DROP TABLE IF EXISTS route_logs CASCADE;
DROP TABLE IF EXISTS operators CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS components CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 0. Users Table (Enterprise Authentication & RBAC)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 1. Products Table (Root record for manufacturing unit)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    serial_number VARCHAR(64) UNIQUE NOT NULL,
    product_code VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(64) NOT NULL,
    manufacturing_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'In Production',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crucial index for sub-millisecond serial number lookups
CREATE INDEX idx_products_serial_number ON products(serial_number);

-- 2. Components Table (BOM / Component Genealogy)
CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    component_name VARCHAR(255) NOT NULL,
    component_code VARCHAR(64) NOT NULL,
    lot_number VARCHAR(64) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_components_product_id ON components(product_id);

-- 3. Stations Table (Production line workstations)
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    station_code VARCHAR(64) UNIQUE NOT NULL,
    station_name VARCHAR(255) NOT NULL,
    line_name VARCHAR(128) NOT NULL
);

-- 4. Operators Table (Certified factory technicians)
CREATE TABLE operators (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(128) NOT NULL
);

-- 5. Route Logs Table (Station-by-station manufacturing journey)
CREATE TABLE route_logs (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    station_id INTEGER NOT NULL REFERENCES stations(id),
    operator_id INTEGER NOT NULL REFERENCES operators(id),
    operation_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    result VARCHAR(32) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_route_logs_product_id ON route_logs(product_id);

-- 6. Defects Table (Non-conformance and assembly anomalies)
CREATE TABLE defects (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id),
    defect_code VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Open'
);

CREATE INDEX idx_defects_product_id ON defects(product_id);

-- 7. Reworks Table (Remediation and corrective repair records)
CREATE TABLE reworks (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
    operator_id INTEGER NOT NULL REFERENCES operators(id),
    action_taken TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    result VARCHAR(32) NOT NULL DEFAULT 'PASSED'
);

CREATE INDEX idx_reworks_defect_id ON reworks(defect_id);

-- 8. Inspections Table (Quality assurance & electrical parametrics)
CREATE TABLE inspections (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    inspector_name VARCHAR(255) NOT NULL,
    inspection_type VARCHAR(128) NOT NULL,
    voltage NUMERIC(6, 2),
    current NUMERIC(6, 2),
    temperature NUMERIC(6, 2),
    result VARCHAR(32) NOT NULL,
    inspected_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_inspections_product_id ON inspections(product_id);

-- 9. Shipments Table (Packaging, carton aggregation & carrier dispatch)
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    shipment_id VARCHAR(64) UNIQUE NOT NULL,
    carton_number VARCHAR(64) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    shipment_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'In Transit'
);

CREATE INDEX idx_shipments_product_id ON shipments(product_id);
