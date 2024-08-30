import Button from "../general/Button"
import Modal from "./Modal"
import '../../styles/assurancemodal.css'

type AssuranceModalProps ={
  title:string,
  primaryLabel:string,
  primaryAction:()=>void,
  isOpen:boolean
  onClose:()=>void
}
const AssuranceModal = ({primaryAction,primaryLabel,title,isOpen,onClose}:AssuranceModalProps) => {
  

  const Header =(
    <h2>{title}</h2>
  )
  const content=(
    <div className="assurance-modal">
      <Button title={primaryLabel} color="white" backgroundColor="#17A2B8" onClick={primaryAction}/>
      <Button title="Cancel" color="red" borderColor="red" backgroundColor="white" onClick={onClose}/>
    </div>
  )

  return (
    <div className="assurance-modal-container">
      <Modal header={Header} content={content} isOpen={isOpen}/>
    </div>
  )
}

export default AssuranceModal