import { useEffect, useState } from 'react';
export default function Toast({msg}:{msg?:string|null}){
  const [show,set]=useState(Boolean(msg));
  useEffect(()=>{ 
    // show/hide toast for a short duration when message changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(msg){ set(true); const t=setTimeout(()=>set(false),2500); return ()=>clearTimeout(t)} 
  },[msg]);
  if(!msg||!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in rounded-2xl bg-gradient-to-tr from-indigo-700/80 to-indigo-500/60 text-white px-4 py-2 shadow-lg">
      <div className="text-sm">{msg}</div>
    </div>
  )
}
