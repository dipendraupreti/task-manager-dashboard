import { useState } from 'react';
import Loader from '../components/Loader';
import { useAppDispatch } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [f,set]=useState({email:'',password:''});
  const [err,setErr]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const dispatch=useAppDispatch(); const nav=useNavigate();
  const submit=async(e:React.FormEvent)=>{ e.preventDefault();
    try{ setLoading(true); await dispatch(login(f)).unwrap(); nav('/'); }
    catch(err: unknown){ const msg = (err as Error)?.message ?? 'Login failed'; setErr(msg) }
    finally{ setLoading(false) }
  }
  return (
    <div className="min-h-[75vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card glass flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="muted">Log in to manage your tasks quickly and easily.</p>
            </div>
                    <div className="text-sm text-slate-400 text-center mt-2">Need an account? <a href="/register" className="text-indigo-300 underline">Register</a></div>
          </div>

          {err && <div className="rounded-md bg-red-700/30 border border-red-600/40 text-red-100 px-3 py-2">{err}</div>}

          <form onSubmit={submit} className="grid gap-3">
            <label className="text-sm text-slate-300">Email</label>
            <input className="input" disabled={loading} type="email" placeholder="you@company.com" value={f.email} onChange={e=>set({...f,email:e.target.value})}/>

            <label className="text-sm text-slate-300">Password</label>
            <input className="input" disabled={loading} type="password" placeholder="••••••••" value={f.password} onChange={e=>set({...f,password:e.target.value})}/>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-700"/> Remember</label>
            </div>

            <div className="pt-2">
              <button className="btn w-full" aria-label="Login" disabled={loading}>{loading? <div className="flex items-center justify-center gap-2"><Loader size={3}/><span>Signing in...</span></div> : 'Sign in'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
