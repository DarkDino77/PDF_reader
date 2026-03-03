export interface DocumentResponse {
    id: number;
    title: string;
    folder_id: number|null;
    is_processed: boolean;
    created_at: string; 
}

export interface TextBlock {
    id: number;
    content: string;
    block_type: string; 
    sort_order: number;
    font_size: number;
}

export interface DocumentDetailResponse extends DocumentResponse {
    blocks: TextBlock[];
}