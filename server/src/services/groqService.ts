import Groq from 'groq-sdk';
import { ExtractedEntities } from '../types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const parseTechnicianText = async (text: string): Promise<ExtractedEntities> => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert logistics coordinator. Extract technical entities from maintenance updates into JSON.
        Required fields:
        - location (string)
        - equipment (string)
        - action (string)
        - parts (array of {name: string, quantity: number})
        - time (ISO 8601 string)

        Current year is 2026. If the technician says "2 PM", assume today's date unless specified.
        If a field is missing, use an empty string or empty array.
        Return ONLY valid JSON.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from Groq');
  }

  return JSON.parse(content) as ExtractedEntities;
};
