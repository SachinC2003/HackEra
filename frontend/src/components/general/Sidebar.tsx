import MenuItem from "../Inputs/MenuItem"
import '../../styles/sidebar.css'
import LogoutModal from "../Modals/LogoutModal"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
const Sidebar = () => {
  const [logoutModalOpen,setLogoutModalOpen] = useState(false)
  const {boardId} = useParams<{
    boardId:string
  }>()
  const [cboardId, setCboardId] = useState(boardId);

  useEffect(()=>{
      setCboardId(boardId);
  },[boardId])

  return (
    <div className="">
      <LogoutModal isOpen={logoutModalOpen} onClose={()=>setLogoutModalOpen(false)}/>
      <div className="flex justify-center sidebar-container">
        <div className="logo-container">
          <img src="/codesandboxlogo.png"/>
        </div>
        <div>
          <h4>Pro Manage</h4>
        </div>
      </div>
      <div className="flex flex-col justify-between menu">
        <div className="flex flex-col sidebar-nav">
          <MenuItem title='Board' path={`/dashboard/${cboardId || ''}`} icon='/boardicon.png' />
          <MenuItem title='Chat' path={`/chat/${cboardId}`} icon='/chat1.jpg' />
          <MenuItem title='Video Meet' path='/videocall' icon='/video1.png' />
          <MenuItem title='Analytics' path='/analytics' icon='/databaseicon.png' />
          <MenuItem title='Settings' path='/settings' icon='/settingsicon.png' />
        </div>
        <div className="ml-16">
          <MenuItem title='Log out' onClick={()=>setLogoutModalOpen(true)} icon='/logout.png' red/>
        </div>
      </div>
      
    </div>
  )
}

export default Sidebar