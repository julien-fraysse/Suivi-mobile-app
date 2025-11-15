import { apiFetch } from './client';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string | null;
  projectName?: string | null;
  assigneeName?: string | null;
  updatedAt?: string;
};

export type MyTasksFilters = {
  status?: TaskStatus | 'all';
};

export type MyTasksPage = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};

export async function getMyTasks(
  accessToken: string,
  params: { page?: number; pageSize?: number; filters?: MyTasksFilters } = {},
): Promise<MyTasksPage> {
  const { page = 1, pageSize = 20, filters } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  if (filters?.status && filters.status !== 'all') {
    searchParams.set('status', filters.status);
  }

  const path = `/me/tasks?${searchParams.toString()}`;
  return apiFetch<MyTasksPage>(path, {}, accessToken);
}

export async function getTaskById(
  accessToken: string,
  taskId: string,
): Promise<Task> {
  const path = `/tasks/${encodeURIComponent(taskId)}`;
  return apiFetch<Task>(path, {}, accessToken);
}

