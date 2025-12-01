import { useState } from 'react';
import Loader from '../components/Loader';
import { useAppDispatch } from '../app/hooks';
import { register } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [f,set]=useState({name:'',email:'',password:''});
  const [err,setErr]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const dispatch=useAppDispatch(); const nav=useNavigate();
  const submit=async(e:React.FormEvent)=>{ e.preventDefault();
    try{ setLoading(true); await dispatch(register(f)).unwrap(); nav('/'); }
    catch(err: unknown){ const msg = (err as Error)?.message ?? 'Register failed'; setErr(msg) }
    finally{ setLoading(false) }
  }
  return (
    <div className="min-h-[75vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card glass flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="muted">Create an account to track tasks and boost your productivity.</p>
            </div>
            <div className="text-sm text-slate-400">Already a member? <a href="/login" className="text-indigo-300 underline">Sign in</a></div>
          </div>

          {err && <div className="rounded-md bg-red-700/30 border border-red-600/40 text-red-100 px-3 py-2">{err}</div>}

          <form onSubmit={submit} className="grid gap-3">
            <label className="text-sm text-slate-300">Name</label>
            <input className="input" disabled={loading} placeholder="Your name" value={f.name} onChange={e=>set({...f,name:e.target.value})}/>

            <label className="text-sm text-slate-300">Email</label>
            <input className="input" disabled={loading} type="email" placeholder="you@company.com" value={f.email} onChange={e=>set({...f,email:e.target.value})}/>

            <label className="text-sm text-slate-300">Password</label>
            <input className="input" disabled={loading} type="password" placeholder="Choose a strong password" value={f.password} onChange={e=>set({...f,password:e.target.value})}/>

            <div className="pt-2">
              <button className="btn w-full" disabled={loading}>{loading ? <div className="flex items-center justify-center gap-2"><Loader size={3}/>Creating…</div> : 'Create account'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
