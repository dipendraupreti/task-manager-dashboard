export type Task = {
  id: number;
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  end_date?: string | null;
  overdue?: boolean;
  created_at?: string;
  updated_at?: string | null;
};

export type TaskFetchResponse = {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
};
