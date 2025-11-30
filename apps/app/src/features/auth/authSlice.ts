import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginAPI, logoutAPI, registerAPI } from './authAPI';

export const register = createAsyncThunk('auth/register', async (d:{name:string;email:string;password:string})=>{
  const res = await registerAPI(d);
  // return token if backend supplies one so we can persist login
  if (res?.data?.token) {
    localStorage.setItem('token', res.data.token);
    return res.data.token;
  }
  return null;
});
export const login = createAsyncThunk('auth/login', async (d:{email:string;password:string})=>{
  const res = await loginAPI(d);
  if (res.data?.token) localStorage.setItem('token', res.data.token);
  return res.data?.token ?? null;
});
export const logout = createAsyncThunk('auth/logout', async ()=>{
  await logoutAPI(); localStorage.removeItem('token');
});

type State = { token: string|null; status:'idle'|'loading'|'ok'|'err'; error?:string|null };
const initialState:State = { token: localStorage.getItem('token'), status:'idle', error:null };

export default createSlice({
  name:'auth', initialState, reducers:{},
  extraReducers: b => {
      b.addCase(login.pending, s=>{s.status='loading'; s.error=null})
        .addCase(login.fulfilled,(s,a)=>{s.status='ok'; s.token=a.payload})
        .addCase(login.rejected,(s,a)=>{s.status='err'; s.error=a.error.message||'Login failed'})
        .addCase(register.pending, s=>{s.status='loading'; s.error=null})
        .addCase(register.fulfilled, (s,a)=>{ s.status='ok'; s.token=a.payload })
        .addCase(register.rejected, (s,a)=>{ s.status='err'; s.error=a.error.message||'Registration failed' })
     .addCase(logout.fulfilled, s=>{s.token=null});
  }
}).reducer;
