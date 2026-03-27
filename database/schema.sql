-- Quartermaster Database Schema
-- Optimized for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Technicians Table
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    warranty_active BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    warehouse_location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Work Orders Table
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    action_required TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'in-progress', 'completed', 'cancelled'
    raw_input TEXT, -- Stores the original unstructured text/voice input
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Mapping table for work order parts
CREATE TABLE IF NOT EXISTS work_order_parts (
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    part_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (work_order_id, part_id)
);

-- Seed Data

-- Technicians
INSERT INTO technicians (name, email) VALUES
('John Doe', 'john.doe@quartermaster.com'),
('Jane Smith', 'jane.smith@quartermaster.com'),
('Bob Miller', 'bob.miller@quartermaster.com');

-- Equipment
INSERT INTO equipment (name, model, warranty_active, notes) VALUES
('Blue Boiler', 'B-100-XL', true, 'Located in the Ghent warehouse basement.'),
('AC Unit', 'Cool-X 5000', false, 'Requires annual filter replacement.'),
('Pumping Station', 'PumpMaster 3000', true, 'North industrial zone.');

-- Inventory (Parts)
INSERT INTO inventory (part_name, quantity, warehouse_location) VALUES
('15mm copper valve', 50, 'Aisle 4, Rack B'),
('Pipe sealant (200ml)', 25, 'Aisle 2, Bin 10'),
('Pressure gauge (0-10 bar)', 10, 'Aisle 1, Shelf 2');

-- Sample Work Orders
-- Note: We'll need to use subqueries or specific UUIDs if we were running this script multiple times,
-- but for a one-off seed, let's use common names or just insert a few.

DO $$
DECLARE
    tech_id UUID;
    equip_id UUID;
    part1_id UUID;
    wo_id UUID;
BEGIN
    SELECT id INTO tech_id FROM technicians WHERE name = 'John Doe' LIMIT 1;
    SELECT id INTO equip_id FROM equipment WHERE name = 'Blue Boiler' LIMIT 1;
    SELECT id INTO part1_id FROM inventory WHERE part_name = '15mm copper valve' LIMIT 1;

    INSERT INTO work_orders (technician_id, equipment_id, location, action_required, scheduled_time, status, raw_input)
    VALUES (tech_id, equip_id, 'Ghent', 'Swap the blue boiler valve', now() + interval '1 day', 'pending', 'Heading to Ghent to swap the blue boiler, need a 15mm valve and 2 hours at 2 PM')
    RETURNING id INTO wo_id;

    INSERT INTO work_order_parts (work_order_id, part_id, quantity)
    VALUES (wo_id, part1_id, 1);
END $$;
