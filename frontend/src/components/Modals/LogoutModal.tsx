import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { useNavigate } from "react-router-dom"
import AssuranceModal from "./AssuranceModal"
type LogoutModalProps ={
  isOpen:boolean
  onClose:()=>void
}
const LogoutModal = ({isOpen,onClose}:LogoutModalProps) => {
  const context = useContext(UserContext);
  const navigate = useNavigate()
  if (!context) {
      throw new Error('Register must be used within a UserProvider');
  }

  const { setUser } = context;

  const Logout = () =>{
    localStorage.setItem('authToken','');
    setUser(prev => ({ ...prev, name:'', email:'' }));
    navigate('/login')
  }
  
  return (
    <AssuranceModal 
      title="Are you sure you want to Logout?"
      isOpen={isOpen}
      onClose={onClose}
      primaryLabel="Yes, Logout"
      primaryAction={Logout}
    />
  )
}

export default LogoutModal