export default function Loader({size=4}:{size?:number}){
  // simple reusable spinner
  return (
    <div style={{width: size*4, height: size*4}} className="flex items-center justify-center">
      <div className="spinner" aria-hidden="true" />
    </div>
  )
}
