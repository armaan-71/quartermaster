# 🤖 Agent Prompts: Quartermaster

You can use these prompts to delegate the build to your parallel agents. Just copy-paste them!

## Agent 1: Database Initialization
**Goal:** Generate the Supabase schema and seed data.
**Prompt:**
> @workspace Read the `README.md` to understand the Quartermaster project. I need you to create a robust PostgreSQL schema for our remote Supabase instance. Create a `database/schema.sql` file. It must include tables for:
> 1. `technicians` (id, name, email)
> 2. `equipment` (id, name, model, warranty_active, notes)
> 3. `inventory` (id, part_name, quantity, warehouse_location)
> 4. `work_orders` (id, technician_id, location, equipment_id, action_required, scheduled_time, status, raw_input)
> 5. A mapping table for work_order parts (`work_order_parts`).
> 
> Also, provide me with `INSERT` statements with dummy data (e.g., a "blue boiler", some "15mm copper valves", and some sample techs) so we have a realistic test setup right out of the gate. Please provide the SQL so I can run it in my Supabase query editor.

## Agent 2: Backend Developer
**Goal:** Build the Groq extraction service and validation logic.
**Prompt:**
> @workspace Read the `README.md`. Please initialize a new backend project in a `server/` directory using Node.js, Express, and strict TypeScript. 
> 1. Set up an endpoint `/api/parse` that uses the Groq SDK (Llama 3.3) to extract Location, Equipment, Action, Parts, and Time from unstructured mock technician text into a structured JSON schema. 
> 2. Scaffold an endpoint `/api/validate` that takes the extracted JSON and compares it against our Supabase PostgreSQL database to check for double bookings and inventory shortages. If there is a conflict, the payload must return the conflict details. 
> Ensure the code is scalable and production-quality.

## Agent 3: Frontend Developer
**Goal:** Build the Craft-like interface.
**Prompt:**
> @workspace Read the `README.md`. I need you to initialize a Vite + React + TypeScript app in the `client/` directory and install Tailwind CSS. Your focus is building a premium, "Notion-meets-Linear" interface. 
> 1. Create a beautiful, modern Layout with dark mode, high-contrast typography, and glassmorphism UI elements. 
> 2. Build a natural language input area for technicians to put their updates. 
> 3. Build the critical "Proposed Change" card component that predictively visually parses the input.
> 4. Build a "Resolution Engine" UI surface that reacts if backend validation returns a conflict (e.g. part out of stock) by offering a button to suggest/swap an alternative. Pay extremely close attention to polish, micro-animations, and visual hierarchy.
