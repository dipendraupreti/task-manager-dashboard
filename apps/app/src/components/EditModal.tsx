import { useEffect, useState } from 'react';
import type { Task } from '../features/tasks/types';
import { useAppDispatch } from '../app/hooks';
import { updateTask } from '../features/tasks/tasksSlice';

export default function EditModal({open,task,onClose}:{open:boolean;task:Task|null;onClose:()=>void}){
  const [f,set] = useState({
    title: '',
    description: '',
    priority: 2,
    end_date: ''
  });

  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // populate editing fields when task changes
    if(task) set({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      end_date: task.end_date ? new Date(task.end_date).toISOString().slice(0,16) : ''
    });
  },[task]);

  if(!open || !task) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try{
      await dispatch(updateTask({
      id: task.id,
      payload: {
        ...f,
        priority: Number(f.priority) as 1 | 2 | 3,
        end_date: f.end_date ? new Date(f.end_date).toISOString() : null
      }
      })).unwrap();
      onClose();
    } finally { setSaving(false) }
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/60 z-50 p-6">
      <form onSubmit={save} className="card w-full max-w-lg transform transition-transform scale-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Edit task</h3>
            <div className="muted text-xs mt-1">Update task details and save — changes apply instantly.</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-300 hover:text-white">✕</button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3">
          <label className="text-sm muted">Title</label>
          <input className="input" disabled={saving} value={f.title} onChange={e=>set({...f,title:e.target.value})}/>

          <label className="text-sm muted">Description</label>
          <input className="input" disabled={saving} value={f.description} onChange={e=>set({...f,description:e.target.value})}/>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm muted">Priority</label>
              <select
                className="input mt-1 w-full"
                value={f.priority}
                disabled={saving}
                onChange={e=>set({...f, priority: Number(e.target.value) })}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-sm muted">Due</label>
              <input
                className="input mt-1 w-full"
                disabled={saving}
                type="datetime-local"
                value={f.end_date}
                onChange={e=>set({...f,end_date:e.target.value})}
              />
            </div>
          </div>

            <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="btn bg-transparent border border-slate-700/30 text-slate-200 px-3 py-1 rounded-lg" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn" disabled={saving}>{saving ? <div className="flex items-center gap-2"><div className="spinner"/></div> : 'Save changes'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
