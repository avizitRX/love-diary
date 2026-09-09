export interface Memory {
  id: string;
  couple_id: string;
  title: string;
  content: string | null;
  event_date: string;
  updated_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemoryListResult {
  memories: Memory[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
