// Shared types mirroring server/src/types/index.ts

export interface Part {
  name: string;
  quantity: number;
}

export interface ExtractedEntities {
  location: string;
  equipment: string;
  action: string;
  parts: Part[];
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

export interface ProposedChange extends ExtractedEntities {
  validation: ValidationResult;
}
