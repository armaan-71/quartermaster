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
        // Try to find a similar part name to suggest as a fix
        const { data: suggestion } = await supabase
          .from('inventory')
          .select('part_name')
          .ilike('part_name', `%${part.name.split(' ')[0]}%`)
          .limit(1)
          .single();

        conflicts.push({
          type: 'inventory',
          detail: `Part "${part.name}" not found in inventory.`,
          suggestedAction: suggestion ? `Use "${suggestion.part_name}" instead?` : 'Verify part name or add to inventory.',
          fix: suggestion ? { partName: suggestion.part_name } : undefined,
        });
      } else if (data.quantity < part.quantity) {
        conflicts.push({
          type: 'inventory',
          detail: `Insufficient stock for "${part.name}". Requested: ${part.quantity}, Available: ${data.quantity}.`,
          suggestedAction: `Use available quantity (${data.quantity})?`,
          fix: { quantity: data.quantity, partName: data.part_name },
        });
      }
    }

    // 2. Check Scheduling (Double Bookings)
    let scheduledTime = entities.time ? new Date(entities.time) : new Date();
    
    // Fallback to now if ISO 8601 parsing fails
    if (isNaN(scheduledTime.getTime())) {
      scheduledTime = new Date();
    }
    
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
