import { api } from '../../api/axios';
export const registerAPI = (d: {name:string;email:string;password:string}) => api.post('/api/register', d);
export const loginAPI    = (d: {email:string;password:string}) => api.post('/api/login', d);
export const logoutAPI   = () => api.post('/api/logout');
