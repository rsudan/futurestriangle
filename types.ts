
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface Source {
  uri: string;
  title: string;
}

export enum TriangleDimension {
  Past = 'Weight of the Past',
  Present = 'Push of the Present',
  Future = 'Pull of the Future',
}

export interface GeneratedContent {
  content: string;
  confidence: number;
  sources: Source[];
}

export interface AnalysisResult {
  analysis: string;
  sources: Source[];
}

export interface PromptTemplates {
  suggestion: string;
  analysis: string;
}
