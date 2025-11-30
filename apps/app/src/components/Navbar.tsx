import { Link } from 'react-router-dom';
import { useState } from 'react';
import Loader from './Loader';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export default function Navbar(){
  const token = useAppSelector(s=>s.auth.token);
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);

  return (
    <header className="w-full">
      <div className="w-full bg-transparent">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="glass card flex items-center justify-between py-3 px-6">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-300 flex items-center justify-center text-white font-bold text-sm">TM</div>
            <div>
              <div className="font-extrabold text-white text-2xl leading-5">Task Manager</div>
              <div className="muted text-sm">Organize your day — simply.</div>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            {token ? (
              <>
                <button className="btn bg-transparent border border-slate-700/40 text-white px-4 py-2 rounded-lg hover:bg-slate-700/30 text-sm" onClick={async ()=>{ setBusy(true); try{ await dispatch(logout()).unwrap(); } finally{ setBusy(false)} }} disabled={busy}>
                  {busy ? <div className="flex items-center gap-2"><Loader size={3}/>Signing out</div> : 'Logout'}
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-500 flex items-center justify-center text-sm font-semibold">U</div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-200 hover:underline text-base">Login</Link>
                <Link to="/register" className="btn px-4 py-2 text-sm">Create account</Link>
              </>
            )}
          </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
