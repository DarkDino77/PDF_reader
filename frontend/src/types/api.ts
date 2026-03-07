export interface DocumentResponse {
  id: number;
  title: string;
  folder_id: number | null;
  is_processed: boolean;
  created_at: string;
}

export interface TextBlock {
  id: number;
  content: string;
  block_type:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'caption'
    | 'figure'
    | 'table'
    | 'equation';
  sort_order: number;
  font_size: number;
  image: string | null;
}

export interface DocumentDetailResponse extends DocumentResponse {
  blocks: TextBlock[];
}
