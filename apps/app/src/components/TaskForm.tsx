import { useState } from 'react';
import Loader from './Loader';
import { useAppDispatch } from '../app/hooks';
import { createTask } from '../features/tasks/tasksSlice';

export default function TaskForm(){
  const dispatch = useAppDispatch();
  const [f,set] = useState({
    title: '',
    description: '',
    priority: 2,     // ✅ default medium = 2
    end_date: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try{
      await dispatch(createTask({
      ...f,
      priority: Number(f.priority) as 1 | 2 | 3,
      end_date: f.end_date ? new Date(f.end_date).toISOString() : undefined
      })).unwrap();
      set({ title:'', description:'', priority:2, end_date:'' });
    }finally{ setSubmitting(false) }
  };

  return (
    <form onSubmit={submit} className="card mb-4 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
      <div className="sm:col-span-2">
        <label className="text-sm muted">Title</label>
        <input
          className="input mt-1"
          placeholder="Title"
          required
          value={f.title}
          onChange={e=>set({...f,title:e.target.value})}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm muted">Description</label>
        <input
          className="input mt-1"
          placeholder="Short note (optional)"
          value={f.description}
          onChange={e=>set({...f,description:e.target.value})}
        />
      </div>

      <div>
        <label className="text-sm muted">Priority</label>
        <select
          className="input mt-1"
          value={f.priority}
          onChange={e=>set({...f, priority: Number(e.target.value) })}
        >
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
        </select>
      </div>

      <div>
        <label className="text-sm muted">Due</label>
        <input
          className="input mt-1"
          type="datetime-local"
          value={f.end_date}
          onChange={e=>set({...f,end_date:e.target.value})}
        />
      </div>

        <div className="sm:col-span-4 flex justify-end">
        <button className="btn" disabled={submitting}>{submitting ? <div className="flex items-center gap-2"><Loader size={3}/>Adding</div> : 'Add task'}</button>
      </div>
    </form>
  )
}
