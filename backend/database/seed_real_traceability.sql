-- ==============================================================================
-- 🏭 FYND END-TO-END BUYER TRACEABILITY PORTAL – NEONDB REAL DATA SCRIPT
-- ==============================================================================
-- This SQL script inserts a complete, realistic manufacturing digital thread
-- into your NeonDB database. It demonstrates what End-to-End Traceability is:
--
-- 1. Product Identity: Physical unit tracking by unique Serial Number & Batch
-- 2. Component Genealogy (BOM): Silicon wafer lots, passive components & suppliers
-- 3. Workstations & Operators: Automated SMT lines & certified technicians
-- 4. Route Journey: Step-by-step fabrication & assembly timeline logs
-- 5. Defect Discovery & Rework: Anomaly diagnosis, remediation & re-inspection
-- 6. Quality Parametric Testing: Live voltage, current & thermal measurements
-- 7. Outgoing Dispatch: Carton aggregation, carrier tracking & COC certification
-- ==============================================================================

-- Clean previous data (optional)
TRUNCATE TABLE shipments, inspections, reworks, defects, route_logs, operators, stations, components, products RESTART IDENTITY CASCADE;

-- ------------------------------------------------------------------------------
-- 1. STATIONS (Manufacturing Workstations across Factory Floor)
-- ------------------------------------------------------------------------------
INSERT INTO stations (station_code, station_name, line_name) VALUES
('STN-SMT-01', 'High-Speed SMT Pick & Place', 'Line Alpha'),
('STN-OVEN-02', 'Nitrogen Atmosphere Reflow Oven', 'Line Alpha'),
('STN-AOI-03', '3D Automated Optical Inspection (AOI)', 'Line Alpha'),
('STN-ASSY-04', 'Robotic Chassis & Enclosure Assembly', 'Line Alpha'),
('STN-ICT-05', 'In-Circuit & Flying Probe Testing', 'Line Alpha'),
('STN-BURN-06', 'High-Temp Environmental Burn-In Chamber', 'Line Beta'),
('STN-QA-07', 'Final Quality Assurance & Parametric Bench', 'Line Beta'),
('STN-PACK-08', 'Automated Laser Barcoding & Packaging', 'Line Beta');

-- ------------------------------------------------------------------------------
-- 2. OPERATORS (Certified Technicians & Quality Engineers)
-- ------------------------------------------------------------------------------
INSERT INTO operators (employee_code, name, role) VALUES
('OP-1042', 'Marcus Vance', 'SMT Surface Mount Specialist'),
('OP-2109', 'Elena Rostova', 'Reflow Thermal Profiler'),
('OP-3384', 'Devon Chen', 'Optical Quality Inspector (IPC-A-610)'),
('OP-4491', 'Priya Sharma', 'Robotic Assembly Technician'),
('OP-5520', 'Liam O''Connor', 'IPC-7711/7721 Certified Rework Engineer'),
('QC-8812', 'Sarah Jenkins', 'Lead Quality Assurance Inspector'),
('QC-9901', 'Dr. Robert Zimmerman', 'Chief Quality Officer (CQO)');

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS (Root Manufacturing Ledger Records)
-- ------------------------------------------------------------------------------
-- Product 1: Complete pass, cleared, dispatched with full genealogy
INSERT INTO products (serial_number, product_code, product_name, batch_number, manufacturing_date, status) VALUES
('SN-2026-001245', 'PRD-EDGE-V4', 'IoT Industrial Edge Gateway v4', 'BATCH-2026-Q1-A', '2026-02-15', 'Dispatched');

-- Product 2: Remediated rework unit (had a solder defect, repaired & passed)
INSERT INTO products (serial_number, product_code, product_name, batch_number, manufacturing_date, status) VALUES
('SN-2026-003891', 'PRD-CTRL-X9', 'Programmable Logic Controller X9', 'BATCH-2026-Q1-B', '2026-02-16', 'Quality Passed');

-- Product 3: Active unit currently in manufacturing production route
INSERT INTO products (serial_number, product_code, product_name, batch_number, manufacturing_date, status) VALUES
('SN-2026-007812', 'PRD-MTR-G3', 'Smart Sub-Station Energy Meter G3', 'BATCH-2026-Q1-C', '2026-02-17', 'In Production');

-- ------------------------------------------------------------------------------
-- 4. COMPONENTS (BOM Component Genealogy & Supplier Traceability)
-- ------------------------------------------------------------------------------
-- Components for Product 1 (SN-2026-001245)
INSERT INTO components (product_id, component_name, component_code, lot_number, supplier, quantity) VALUES
(1, 'ARM Cortex-M7 Core Microcontroller 480MHz', 'MCU-STM32H7', 'LOT-ST-2025W48-881', 'STMicroelectronics', 1),
(1, 'Industrial Isolated RS-485 Transceiver', 'IC-ADM2587E', 'LOT-ADI-2025W50-412', 'Analog Devices Inc.', 2),
(1, 'Gigabit Ethernet PHY Low-Power Controller', 'PHY-DP83867', 'LOT-TI-2025W49-109', 'Texas Instruments', 1),
(1, 'Multi-layer Ceramic SMD Capacitor Array 10uF 50V', 'CAP-MLCC-10U', 'LOT-MUR-2026W02-663', 'Murata Electronics', 8),
(1, 'Automotive-Grade High-Q Ferrite Power Inductor', 'IND-PWR-4R7', 'LOT-TDK-2025W51-921', 'TDK Electronics', 4),
(1, 'Flame Retardant FR-4 6-Layer PCB Substrate', 'PCB-FR4-6L', 'LOT-FOX-2026W01-004', 'Foxconn Technologies', 1);

-- Components for Product 2 (SN-2026-003891)
INSERT INTO components (product_id, component_name, component_code, lot_number, supplier, quantity) VALUES
(2, 'Dual-Core Industrial RISC-V SoC 800MHz', 'MCU-ESP32-P4', 'LOT-ESP-2025W44-331', 'Espressif Systems', 1),
(2, 'Precision High-Voltage Optocoupler Isolation', 'OPT-HCPL-0630', 'LOT-BRO-2025W47-512', 'Broadcom Inc.', 4),
(2, 'Ultra-Low Dropout Step-Down Voltage Regulator', 'REG-TPS54308', 'LOT-TI-2025W52-774', 'Texas Instruments', 2);

-- Components for Product 3 (SN-2026-007812)
INSERT INTO components (product_id, component_name, component_code, lot_number, supplier, quantity) VALUES
(3, 'Polyphase Metrology Energy Processor', 'MET-ADE7880', 'LOT-ADI-2026W03-118', 'Analog Devices Inc.', 1),
(3, 'Current Transformer Signal Conditioning Op-Amp', 'AMP-OPA2333', 'LOT-TI-2026W01-904', 'Texas Instruments', 3);

-- ------------------------------------------------------------------------------
-- 5. ROUTE LOGS (Production Station Journey & Telemetry Timeline)
-- ------------------------------------------------------------------------------
-- Route for Product 1 (SN-2026-001245)
INSERT INTO route_logs (product_id, station_id, operator_id, operation_name, start_time, end_time, result) VALUES
(1, 1, 1, 'Surface Mount Pick & Place Assembly', '2026-02-15 08:15:00+00', '2026-02-15 08:35:00+00', 'completed'),
(1, 2, 2, 'Nitrogen Atmosphere Thermal Reflow Solder', '2026-02-15 08:40:00+00', '2026-02-15 08:58:00+00', 'completed'),
(1, 3, 3, 'Automated 3D Optical Solder Joint Scan', '2026-02-15 09:05:00+00', '2026-02-15 09:18:00+00', 'completed'),
(1, 4, 4, 'Aluminium Extrusion Enclosure Assembly', '2026-02-15 09:30:00+00', '2026-02-15 10:00:00+00', 'completed'),
(1, 5, 4, 'Flying Probe In-Circuit Electrical Test', '2026-02-15 10:15:00+00', '2026-02-15 10:45:00+00', 'completed'),
(1, 6, 1, 'Burn-In Stress Chamber (72 Hours at 65°C)', '2026-02-15 11:00:00+00', '2026-02-15 13:00:00+00', 'completed'),
(1, 7, 6, 'Final Electrical & Thermal QC Benchmark', '2026-02-15 13:15:00+00', '2026-02-15 13:40:00+00', 'completed'),
(1, 8, 4, 'Laser Serial Etching & Anti-Static Carton Box Packaging', '2026-02-15 14:00:00+00', '2026-02-15 14:20:00+00', 'completed');

-- Route for Product 2 (SN-2026-003891)
INSERT INTO route_logs (product_id, station_id, operator_id, operation_name, start_time, end_time, result) VALUES
(2, 1, 1, 'SMT Component Placement', '2026-02-16 09:00:00+00', '2026-02-16 09:20:00+00', 'completed'),
(2, 2, 2, 'Reflow Thermal Soldering', '2026-02-16 09:25:00+00', '2026-02-16 09:42:00+00', 'completed'),
(2, 3, 3, '3D AOI Optical Inspection (Defect Detected)', '2026-02-16 09:48:00+00', '2026-02-16 09:55:00+00', 'non_conforming'),
(2, 5, 5, 'Post-Rework Electrical Recertification', '2026-02-16 11:15:00+00', '2026-02-16 11:30:00+00', 'completed'),
(2, 7, 6, 'Final Quality Inspection Clearance', '2026-02-16 11:45:00+00', '2026-02-16 12:10:00+00', 'completed');

-- ------------------------------------------------------------------------------
-- 6. DEFECTS & REWORKS (Defect Transparency & Remediation Traceability)
-- ------------------------------------------------------------------------------
-- Solder bridge anomaly discovered on Product 2 during AOI inspection
INSERT INTO defects (id, product_id, station_id, defect_code, description, severity, detected_at, status) VALUES
(1, 2, 3, 'DEF-SLD-041', 'Micro Solder Bridge across MCU Pin 42 & 43 detected during AOI optical scan', 'Major', '2026-02-16 09:52:00+00', 'Resolved');

-- Rework performed by certified rework specialist
INSERT INTO reworks (defect_id, operator_id, action_taken, started_at, completed_at, result) VALUES
(1, 5, 'De-soldered excess solder bridge using nitrogen desoldering iron under 40x microscope. Verified pin pitch isolation to IPC-7711/7721 standards.', '2026-02-16 10:15:00+00', '2026-02-16 10:45:00+00', 'PASSED');

-- ------------------------------------------------------------------------------
-- 7. INSPECTIONS (Parametric Calibrated Electrical & Thermal Readings)
-- ------------------------------------------------------------------------------
INSERT INTO inspections (product_id, inspector_name, inspection_type, voltage, current, temperature, result, inspected_at) VALUES
(1, 'Sarah Jenkins (QC-8812)', 'Comprehensive Outgoing Bench Test', 12.04, 342.50, 41.80, 'Passed', '2026-02-15 13:35:00+00'),
(2, 'Sarah Jenkins (QC-8812)', 'Post-Rework Electrical Clearance Test', 5.01, 188.20, 36.40, 'Passed', '2026-02-16 12:05:00+00');

-- ------------------------------------------------------------------------------
-- 8. SHIPMENTS (Finished Goods Dispatch & Carton Aggregation)
-- ------------------------------------------------------------------------------
INSERT INTO shipments (product_id, shipment_id, carton_number, destination, shipment_date, status) VALUES
(1, 'SHP-2026-8841', 'CTN-US-AUS-00912', 'Industrial Logistics Center, Dallas TX, USA', '2026-02-16', 'Dispatched');

-- Reset sequences to current max IDs
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('components_id_seq', (SELECT MAX(id) FROM components));
SELECT setval('stations_id_seq', (SELECT MAX(id) FROM stations));
SELECT setval('operators_id_seq', (SELECT MAX(id) FROM operators));
SELECT setval('route_logs_id_seq', (SELECT MAX(id) FROM route_logs));
SELECT setval('defects_id_seq', (SELECT MAX(id) FROM defects));
SELECT setval('reworks_id_seq', (SELECT MAX(id) FROM reworks));
SELECT setval('inspections_id_seq', (SELECT MAX(id) FROM inspections));
SELECT setval('shipments_id_seq', (SELECT MAX(id) FROM shipments));
