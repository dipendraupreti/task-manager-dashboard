import type { Task } from '../features/tasks/types';
import { useAppDispatch } from '../app/hooks';
import { useState } from 'react';
import Loader from './Loader';
import { deleteTask } from '../features/tasks/tasksSlice';

const priorityLabel = (p:number) => {
  if(p === 3) return "High";
  if(p === 2) return "Medium";
  return "Low";
};

export default function TaskTable({tasks,onEdit,loading}:{tasks:Task[];onEdit:(t:Task)=>void;loading?:boolean}){
  const dispatch = useAppDispatch();
  const [deletingId, setDeletingId] = useState<number|null>(null);
  if(loading) return (
    <div className="card text-center muted">
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="spinner"/>
        <div>Loading tasks…</div>
      </div>
    </div>
  );

  if(!tasks.length) return <div className="card text-center muted">No tasks yet — your list is empty.</div>;

  return (
    <div className="card overflow-hidden mt-3">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tasks.map(t=>{
              const cls = t.overdue ? 'bg-rose-900/20' : 'hover:bg-slate-800/40';
              return (
                <tr key={t.id} className={cls}>
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-sm">{t.title}</div>
                    <div className="muted text-xs mt-1">{t.description || '—'}</div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${t.priority===3? 'bg-rose-700/20 text-rose-200' : t.priority===2 ? 'bg-amber-700/20 text-amber-200' : 'bg-slate-700/20 text-slate-200'}`}>
                      {priorityLabel(t.priority)}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-top">{t.end_date ? new Date(t.end_date).toLocaleString() : '—'}</td>

                  <td className="px-4 py-3 align-top">
                    {t.overdue ? <span className="text-xs rounded-full px-2 py-1 bg-rose-700/30 text-rose-100">Overdue</span> : <span className="text-xs rounded-full px-2 py-1 bg-emerald-700/20 text-emerald-100">On track</span>}
                  </td>

                  <td className="px-4 py-3 text-right align-top">
                    <button className="text-slate-300 hover:text-indigo-200 mr-3" onClick={()=>onEdit(t)}>Edit</button>
                    <button className="text-rose-300 hover:text-rose-200" onClick={async ()=>{ setDeletingId(t.id); try { await dispatch(deleteTask(t.id)).unwrap(); } finally { setDeletingId(null); } }} disabled={deletingId===t.id}>
                      {deletingId===t.id ? <div className="flex items-center gap-2"><Loader size={3}/>Deleting</div> : 'Delete'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
