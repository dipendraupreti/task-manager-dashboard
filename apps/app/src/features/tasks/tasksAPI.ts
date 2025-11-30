import { api } from '../../api/axios';

import type { TaskFetchResponse, Task } from './types';

export const fetchTasksAPI = (p:Record<string, unknown>) => api.get<TaskFetchResponse>('/api/tasks',{params:p});
export const createTaskAPI = (d:Partial<Task>) => api.post('/api/tasks', d);
export const updateTaskAPI = (id:number, d:Partial<Task>) => api.put(`/api/tasks/${id}`, d);
export const deleteTaskAPI = (id:number) => api.delete(`/api/tasks/${id}`);
