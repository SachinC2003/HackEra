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
    <div className={`flex ${location.pathname.startsWith(path!) ? 'selected':''} menuitem-container`} onClick={path ? ()=>navigate(path) : onClick}>
        <div className="icon-container">
          {title === 'Chat' && <img src={icon} width={28} height={28}/>}
          {title !== 'Chat' && <img src={icon} width={24} height={24}/> }
          
        </div>
        <div>
          <p className={`title ${red?'red':''}`}>{title}</p>
        </div>
    </div>
  )
}

export default MenuItem