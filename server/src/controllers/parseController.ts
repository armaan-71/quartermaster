import { Request, Response } from 'express';
import { parseTechnicianText } from '../services/groqService';

export const parseEntities = async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const extractedEntities = await parseTechnicianText(text);
    res.json(extractedEntities);
  } catch (error) {
    console.error('Parsing error:', error);
    res.status(500).json({ error: 'Failed to extract entities' });
  }
};
