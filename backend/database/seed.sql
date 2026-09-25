-- ==============================================================================
-- Fynd Traceability – PostgreSQL Seed Data
-- ==============================================================================

-- Clean existing data
TRUNCATE TABLE users, shipments, inspections, reworks, defects, route_logs, operators, stations, components, products RESTART IDENTITY CASCADE;

-- 0. Insert Default Users
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Subhan Basha', 'subhanbasha.025@gmail.com', '$2b$10$GDALlhdsDAFidKQEYdtfUudDrzJ9LmJqsb0/8crmlVE92i7pgq4DO', 'buyer'),
(2, 'Demo Buyer', 'buyer@tracecore.com', '$2b$10$3DTnajnbT7dKLkZMrLaktuZdb7AB9PDn82W1dcI4HO7egClj8CBTK', 'buyer'),
(3, 'Quality Engineer', 'engineer@tracecore.com', '$2b$10$3DTnajnbT7dKLkZMrLaktuZdb7AB9PDn82W1dcI4HO7egClj8CBTK', 'quality_engineer')
ON CONFLICT (email) DO NOTHING;

ALTER SEQUENCE users_id_seq RESTART WITH 4;

-- 1. Insert Stations
INSERT INTO stations (id, station_code, station_name, line_name) VALUES
(1, 'ST-SMT-01', 'Surface Mount Pick & Place 01', 'Line Alpha'),
(2, 'ST-WAV-02', 'Nitrogen Wave Solder 02', 'Line Alpha'),
(3, 'ST-TST-03', 'Boundary Scan & In-Circuit Test 03', 'Line Alpha'),
(4, 'ST-AOI-04', '3D Automated Optical Inspection 04', 'Line Alpha'),
(5, 'ST-PCK-05', 'Environmental Packaging & Sealing 05', 'Line Alpha'),
(6, 'ST-RWK-02', 'Micro-soldering Tech Station', 'Rework Bay 02');

ALTER SEQUENCE stations_id_seq RESTART WITH 7;

-- 2. Insert Certified Operators
INSERT INTO operators (id, employee_code, name, role) VALUES
(1, 'OP-441', 'Marcus Vance', 'SMT Placement Specialist'),
(2, 'OP-289', 'Elena Rostova', 'Selective Wave Solder Lead'),
(3, 'TST-804', 'David Chen', 'Hardware Test Engineer'),
(4, 'QC-109', 'Sarah Jenkins', 'Lead Quality Inspector'),
(5, 'OP-612', 'Carlos Mendez', 'Packaging & Logistics Technician'),
(6, 'RWK-07', 'Vikram Patel', 'Senior Rework Specialist');

ALTER SEQUENCE operators_id_seq RESTART WITH 7;

-- ==============================================================================
-- PRODUCT 1: SN-2026-001245 (Clean, 100% Passed, Dispatched)
-- ==============================================================================
INSERT INTO products (id, serial_number, product_code, product_name, batch_number, manufacturing_date, status) VALUES
(1, 'SN-2026-001245', 'EGW-5000-X', 'Industrial IoT Edge Gateway Pro', 'BATCH-2026-04B', '2026-02-14', 'Dispatched');

-- Components for Product 1
INSERT INTO components (product_id, component_name, component_code, lot_number, supplier, quantity) VALUES
(1, 'Multi-layer Master PCB', 'PCB-001-HQ', 'LOT-PCB-102', 'ABC Electronics Ltd.', 1),
(1, 'ARM Cortex-M7 Core MCU', 'MCU-7700-B', 'LOT-MCU-891', 'SiliconCore Technologies', 1),
(1, 'Dual-Channel Power Regulator', 'PWR-REG-12', 'LOT-PWR-331', 'VoltageTech Micro Inc.', 2),
(1, 'Precision Telemetry Sensor Array', 'SNS-702-X', 'LOT-SNS-901', 'PrecisionSensors GmbH', 1),
(1, 'Die-Cast Aluminum IP67 Enclosure', 'ENC-AL-04', 'LOT-ENC-501', 'AeroAlloy Fabrication', 1),
(1, 'High-Temp Thermal Interface Pad', 'THM-PAD-02', 'LOT-THM-612', 'ThermaShield Materials', 1);

-- Route Logs for Product 1
INSERT INTO route_logs (product_id, station_id, operator_id, operation_name, start_time, end_time, result) VALUES
(1, 1, 1, 'Component SMT Assembly', '2026-02-14 07:45:00+00', '2026-02-14 08:30:00+00', 'completed'),
(1, 2, 2, 'Automated & Selective Soldering', '2026-02-14 08:45:00+00', '2026-02-14 09:30:00+00', 'completed'),
(1, 3, 3, 'In-Circuit & Boundary Scan Testing', '2026-02-15 10:15:00+00', '2026-02-15 11:20:00+00', 'completed'),
(1, 4, 4, 'Automated Optical & Quality Inspection (AOI)', '2026-02-15 13:50:00+00', '2026-02-15 14:45:00+00', 'completed'),
(1, 5, 5, 'Enclosure Integration & Environmental Packaging', '2026-02-16 08:15:00+00', '2026-02-16 09:10:00+00', 'completed');

-- Inspections for Product 1
INSERT INTO inspections (product_id, inspector_name, inspection_type, voltage, current, temperature, result, inspected_at) VALUES
(1, 'Sarah Jenkins (QC-109)', 'Automated Parametric In-Circuit Test', 12.04, 342.00, 41.80, 'PASSED', '2026-02-15 14:45:00+00'),
(1, 'Dr. Robert Zimmerman (CQO)', 'Final Outgoing Certificate of Conformity', 12.00, 340.00, 40.50, 'PASSED', '2026-02-16 10:00:00+00');

-- Shipment for Product 1
INSERT INTO shipments (product_id, shipment_id, carton_number, destination, shipment_date, status) VALUES
(1, 'SHIP-EU-2026-8841', 'CTN-9022-A', 'Rotterdam Distribution Center, Netherlands', '2026-02-17', 'In Transit');

-- ==============================================================================
-- PRODUCT 2: SN-2026-001246 (Defect D-104 detected, Reworked, Retested, Dispatched)
-- ==============================================================================
INSERT INTO products (id, serial_number, product_code, product_name, batch_number, manufacturing_date, status) VALUES
(2, 'SN-2026-001246', 'SEC-3000-IND', 'Smart Edge Controller X1', 'BATCH-2026-04B', '2026-02-14', 'Dispatched');

-- Components for Product 2
INSERT INTO components (product_id, component_name, component_code, lot_number, supplier, quantity) VALUES
(2, 'Multi-layer Master PCB', 'PCB-001-HQ', 'LOT-PCB-102', 'ABC Electronics Ltd.', 1),
(2, 'ARM Cortex-M7 Core MCU', 'MCU-7700-B', 'LOT-MCU-891', 'SiliconCore Technologies', 1),
(2, 'Dual-Channel Power Regulator', 'PWR-REG-12', 'LOT-PWR-331', 'VoltageTech Micro Inc.', 2),
(2, 'Precision Telemetry Sensor Array', 'SNS-702-X', 'LOT-SNS-901', 'PrecisionSensors GmbH', 1),
(2, 'Die-Cast Aluminum IP67 Enclosure', 'ENC-AL-04', 'LOT-ENC-501', 'AeroAlloy Fabrication', 1);

-- Route Logs for Product 2
INSERT INTO route_logs (product_id, station_id, operator_id, operation_name, start_time, end_time, result) VALUES
(2, 1, 1, 'Component SMT Assembly', '2026-02-14 08:00:00+00', '2026-02-14 08:50:00+00', 'completed'),
(2, 2, 2, 'Automated & Selective Soldering', '2026-02-14 09:10:00+00', '2026-02-14 10:15:00+00', 'warning'),
(2, 3, 3, 'In-Circuit Testing & Defect Trigger', '2026-02-15 09:00:00+00', '2026-02-15 09:30:00+00', 'failed'),
(2, 6, 6, 'Precision Rework & Re-solder', '2026-02-15 14:10:00+00', '2026-02-15 15:40:00+00', 'completed'),
(2, 4, 4, 'Post-Rework Re-Test & AOI Inspection', '2026-02-16 10:30:00+00', '2026-02-16 11:20:00+00', 'completed'),
(2, 5, 5, 'Packaging & Sealing', '2026-02-16 14:00:00+00', '2026-02-16 14:40:00+00', 'completed');

-- Defect for Product 2
INSERT INTO defects (id, product_id, station_id, defect_code, description, severity, detected_at, status) VALUES
(1, 2, 3, 'D-104', 'Solder Joint Bridge / Micro-Short on MCU Pins 42 & 43', 'Medium', '2026-02-15 09:30:00+00', 'Resolved');

ALTER SEQUENCE defects_id_seq RESTART WITH 2;

-- Rework for Product 2
INSERT INTO reworks (defect_id, operator_id, action_taken, started_at, completed_at, result) VALUES
(1, 6, 'Microscopic solder vacuum desoldering, flux cleanup, pad de-oxidation, selective re-soldering under 40x magnification', '2026-02-15 14:10:00+00', '2026-02-15 15:40:00+00', 'PASSED');

-- Inspections for Product 2
INSERT INTO inspections (product_id, inspector_name, inspection_type, voltage, current, temperature, result, inspected_at) VALUES
(2, 'Sarah Jenkins (QC-109)', 'Initial Test (Flagged Bridging)', 11.20, 520.00, 48.90, 'FAILED', '2026-02-15 09:30:00+00'),
(2, 'Sarah Jenkins (QC-109)', 'Post-Rework Validation (IPC-7711/7721)', 11.98, 348.00, 44.20, 'PASSED', '2026-02-16 11:20:00+00'),
(2, 'Dr. Robert Zimmerman (CQO)', 'Final Outgoing Inspection Certificate', 12.00, 345.00, 42.00, 'PASSED', '2026-02-16 16:00:00+00');

-- Shipment for Product 2
INSERT INTO shipments (product_id, shipment_id, carton_number, destination, shipment_date, status) VALUES
(2, 'SHIP-EU-2026-8854', 'CTN-9040-B', 'Stuttgart Logistics Center, Germany', '2026-02-18', 'In Transit');

ALTER SEQUENCE products_id_seq RESTART WITH 3;
