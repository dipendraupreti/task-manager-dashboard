import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI } from './tasksAPI';

import type { Task, TaskFetchResponse } from './types';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (p:Record<string, unknown>)=>{
  const {data} = await fetchTasksAPI(p);
  return data as TaskFetchResponse;
});
export const createTask = createAsyncThunk('tasks/create', async (d:Partial<Task>)=>{
  const {data} = await createTaskAPI(d); return data as Task;
});
export const updateTask = createAsyncThunk('tasks/update', async ({id,payload}:{id:number;payload:Partial<Task>})=>{
  const {data} = await updateTaskAPI(id,payload); return data as Task;
});
export const deleteTask = createAsyncThunk('tasks/delete', async (id:number)=>{ await deleteTaskAPI(id); return id; });

type State = { items:Task[]; total:number; page:number; limit:number; status:'idle'|'loading'|'ok'|'err' };
const initialState:State = { items:[], total:0, page:1, limit:10, status:'idle' };

export default createSlice({
  name:'tasks', initialState, reducers:{},
  extraReducers: b=>{
    b.addCase(fetchTasks.pending, s=>{s.status='loading'})
     .addCase(fetchTasks.fulfilled,(s,a)=>{
       s.status='ok'; s.items=a.payload.tasks; s.total=a.payload.total;
       s.page=a.payload.page; s.limit=a.payload.limit;
     })
     .addCase(createTask.fulfilled,(s,a)=>{s.items.unshift(a.payload)})
     .addCase(updateTask.fulfilled,(s,a)=>{
       const i=s.items.findIndex(t=>t.id===a.payload.id); if(i>=0) s.items[i]=a.payload
     })
     .addCase(deleteTask.fulfilled,(s,a)=>{s.items=s.items.filter(t=>t.id!==a.payload)});
  }
}).reducer;
