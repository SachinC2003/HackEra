import { ReactNode } from "react"
import Sidebar from "./Sidebar"
import '../../styles/layout.css'
const Layout = ({children}:{children:ReactNode}) => {
  return (
    <div className="layout-container flex">
        <Sidebar />
        <div className="right-container">
            {children}
        </div>
    </div>
    
  )
}

export default Layout