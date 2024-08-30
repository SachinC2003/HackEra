import '../../styles/button.css'
type ButonProps ={
  title:string,
  onClick?:()=>void,
  backgroundColor:string,
  color:string,
  borderColor?:string
}
const Button = ({title,backgroundColor,color,borderColor,onClick}:ButonProps) => {
  return (
    <div 
      className="button-container" 
      style={{ backgroundColor, color , border:`1px solid ${borderColor}` }}
      onClick={onClick}
    >
        {title}
    </div>
  )
}

export default Button