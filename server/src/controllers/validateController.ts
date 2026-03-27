import { Request, Response } from 'express';
import { supabase } from '../services/supabaseService';
import { ExtractedEntities, ValidationConflict, ValidationResult } from '../types';

export const validateEntities = async (req: Request, res: Response) => {
  const entities: ExtractedEntities = req.body;
  const conflicts: ValidationConflict[] = [];

  try {
    // 1. Check Inventory
    for (const part of entities.parts) {
      const { data, error } = await supabase
        .from('inventory')
        .select('quantity, part_name')
        .ilike('part_name', `%${part.name}%`)
        .single();

      if (error || !data) {
        conflicts.push({
          type: 'inventory',
          detail: `Part "${part.name}" not found in inventory.`,
          suggestedAction: 'Verify part name or add to inventory.',
        });
      } else if (data.quantity < part.quantity) {
        conflicts.push({
          type: 'inventory',
          detail: `Insufficient stock for "${part.name}". Requested: ${part.quantity}, Available: ${data.quantity}.`,
          suggestedAction: 'Order more parts or reschedule.',
        });
      }
    }

    // 2. Check Scheduling (Double Bookings)
    // Note: In a real app, we'd need the technician_id. For now, we'll check the location/time.
    const scheduledTime = new Date(entities.time);
    const { data: existingJobs, error: scheduleError } = await supabase
      .from('work_orders')
      .select('id, location, scheduled_time')
      .eq('scheduled_time', scheduledTime.toISOString());

    if (scheduleError) {
      console.error('Schedule check error:', scheduleError);
    } else if (existingJobs && existingJobs.length > 0) {
      conflicts.push({
        type: 'schedule',
        detail: `Scheduling conflict at ${entities.location} for ${entities.time}. ${existingJobs.length} job(s) already scheduled.`,
        suggestedAction: 'Check technician availability or pick a different slot.',
      });
    }

    const result: ValidationResult = {
      valid: conflicts.length === 0,
      conflicts,
    };

    res.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal server error during validation.' });
  }
};
