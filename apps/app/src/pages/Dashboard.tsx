import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTasks } from '../features/tasks/tasksSlice';
import Loader from '../components/Loader';
import TaskForm from '../components/TaskForm';
import TaskTable from '../components/TaskTable';
import EditModal from '../components/EditModal';
import type { Task } from '../features/tasks/types';

export default function Dashboard(){
  const {items,total,status} = useAppSelector(s=>s.tasks);
  const dispatch=useAppDispatch();
  const [q,setQ]=useState({page:1,limit:10,sortBy:'end_date',order:'asc'});
  const [editing,setEditing]=useState<Task|null>(null);

  useEffect(()=>{ dispatch(fetchTasks(q)) },[q,dispatch]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Your tasks</h1>
          <p className="muted mt-1">Manage your current workload — sorted & filtered for focus.</p>
        </div>

        {/* no search box — intentionally left out (not needed) */}
      </div>

      {status === 'loading' && (
        <div className="mb-4 flex items-center gap-2 muted"><Loader size={3}/> Fetching tasks…</div>
      )}

      <div className="space-y-4 mb-4">
        <div>
          <TaskForm/>
          <TaskTable tasks={items} onEdit={setEditing} loading={status === 'loading'} />

          <div className="flex items-center justify-between mt-4 text-sm muted">
            <span>Showing {items.length} — total {total}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <label className="muted">Sort</label>
                <select className="input w-48" value={q.sortBy} onChange={e=>setQ({...q,sortBy:e.target.value})}>
                  <option value="end_date">Due date</option>
                  <option value="priority">Priority</option>
                  <option value="created_at">Created</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <label className="muted">Order</label>
                <select className="input w-28" value={q.order} onChange={e=>setQ({...q,order:e.target.value})}>
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <label className="muted">Per page</label>
                <select className="input w-20" value={q.limit} onChange={e=>setQ({...q,limit:+e.target.value,page:1})}>
                  <option>5</option><option>10</option><option>25</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button className="btn bg-slate-700/80" disabled={q.page<=1} onClick={()=>setQ({...q,page:q.page-1})}>Prev</button>
            <div className="px-3 py-1 rounded-lg border border-slate-700/40 muted">Page {q.page}</div>
            <button className="btn bg-slate-700/80" disabled={q.page>=Math.ceil(total/q.limit)} onClick={()=>setQ({...q,page:q.page+1})}>Next</button>
          </div>
        </div>
      </div>

      <EditModal open={!!editing} task={editing} onClose={()=>setEditing(null)} />
    </div>
  )
}
