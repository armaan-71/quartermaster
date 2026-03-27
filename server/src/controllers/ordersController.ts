import { Request, Response } from 'express';
import { supabase } from '../services/supabaseService';
import { ExtractedEntities } from '../types';

export const createOrder = async (req: Request, res: Response) => {
  const { entities, rawInput } = req.body as {
    entities: ExtractedEntities;
    rawInput?: string;
  };

  if (!entities) {
    return res.status(400).json({ error: 'Entities payload is required.' });
  }

  try {
    // 1. Look up equipment by fuzzy name match
    let equipmentId: string | null = null;
    if (entities.equipment) {
      const { data: equipmentData } = await supabase
        .from('equipment')
        .select('id')
        .ilike('name', `%${entities.equipment.split(' ').slice(0, 2).join(' ')}%`)
        .limit(1)
        .single();

      if (equipmentData) {
        equipmentId = equipmentData.id;
      }
    }

    // 2. Insert work order
    let scheduledTime = entities.time ? new Date(entities.time) : new Date();
    
    // Fallback to now if ISO 8601 parsing fails
    if (isNaN(scheduledTime.getTime())) {
      scheduledTime = new Date();
    }

    const { data: workOrder, error: woError } = await supabase
      .from('work_orders')
      .insert({
        equipment_id: equipmentId,
        location: entities.location,
        action_required: entities.action,
        scheduled_time: scheduledTime.toISOString(),
        status: 'pending',
        raw_input: rawInput || null,
      })
      .select('id')
      .single();

    if (woError || !workOrder) {
      console.error('Work order insert error:', woError);
      return res.status(500).json({ error: 'Failed to create work order.', detail: woError?.message });
    }

    // 3. Link parts via work_order_parts
    for (const part of entities.parts) {
      const { data: inventoryItem } = await supabase
        .from('inventory')
        .select('id')
        .ilike('part_name', `%${part.name}%`)
        .limit(1)
        .single();

      if (inventoryItem) {
        await supabase.from('work_order_parts').insert({
          work_order_id: workOrder.id,
          part_id: inventoryItem.id,
          quantity: part.quantity,
        });
      }
    }

    res.status(201).json({ id: workOrder.id, message: 'Work order created successfully.' });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error during order creation.' });
  }
};
