import { useLocation, useNavigate } from "react-router-dom"
import '../../styles/menuitem.css'
type MenuItemProps ={
    icon:string,
    title:string,
    path?:string,
    onClick?:()=>void,
    red?:boolean
}
const MenuItem = ({icon,title,path,onClick,red}:MenuItemProps) => {
    const navigate = useNavigate()
    const location = useLocation()
    return (
    <div className={`flex ${location.pathname===path ? 'selected':''} menuitem-container`} onClick={path ? ()=>navigate(path) : onClick}>
        <div className="icon-container">
          <img src={icon}/>
        </div>
        <div>
          <p className={`title ${red?'red':''}`}>{title}</p>
        </div>
    </div>
  )
}

export default MenuItem