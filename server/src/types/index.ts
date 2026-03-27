export interface ExtractedEntities {
  location: string;
  equipment: string;
  action: string;
  parts: Array<{ name: string; quantity: number }>;
  time: string; // ISO 8601
}

export interface ValidationConflict {
  type: 'inventory' | 'schedule';
  detail: string;
  suggestedAction?: string;
  fix?: {
    partName?: string;
    quantity?: number;
    time?: string;
  };
}

export interface ValidationResult {
  valid: boolean;
  conflicts: ValidationConflict[];
}
