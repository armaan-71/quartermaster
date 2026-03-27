# Quartermaster: AI-Powered Work Order Resolution

## Overview

Quartermaster is an intelligent Work Order Resolution System that transforms unstructured technician input (e.g., "Heading to Ghent to swap the blue boiler, need a 15mm valve and 2 hours at 2 PM") into actionable, validated database updates.

It operates on an **Input -> Validate -> Resolve** pipeline.

## System Architecture

### 1. Frontend: The "Craft" Interface

- **Tech Stack**: React, Vite, TypeScript, Tailwind CSS.
- **Aesthetic**: Premium "Notion-meets-Linear" styling (dark mode, glassmorphism, micro-animations).
- **Core Features**:
  - Natural language input area (text/simulated voice).
  - **Proposed Change Card**: Predictively highlights extracted details before database commit.
  - **Resolution Engine UI**: 1-tap UX to resolve constraints (e.g., suggesting a different part if out of stock).

### 2. Backend: Validation & Extraction Node

- **Tech Stack**: Node.js, Express, TypeScript.
- **LLM Extraction**: Uses Groq (Llama 3.3) to parse unstructured text into a typed JSON schema (Location, Equipment, Action, Parts, Time).
- **Validation Engine**: Cross-references extraction against the database to check:
  - **Conflict-Aware Scheduling**: Is the tech double-booked?
  - **Technical Feasibility**: Are the required parts in inventory?
  - **Constraints**: Are there active warranties or service histories on the equipment?

### 3. Database: The Source of Truth

- **Provider**: Hosted Supabase (PostgreSQL).
- **Schema Focus**: `work_orders`, `inventory` (parts mapping), `equipment` (warranty/notes), and `technicians`.

## Developer Notes

- All logic must be strictly typed in TypeScript to avoid scripting limitations.
- Keep styling modern and premium (Tailwind CSS for all component styling).
