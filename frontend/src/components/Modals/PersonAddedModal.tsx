import Modal from "./Modal"
import Button from "../general/Button"
import '../../styles/personaddedmodal.css'
type PersonAddedModalProps ={
    email:string,
    onClose:()=>void,
    isOpen:boolean
}
const PersonAddedModal = ({email,isOpen,onClose}:PersonAddedModalProps) => {
    const Header = (
        <div className="person-added-modal-header">
            <h2>{email} added to the board.</h2>
        </div>
    )
    const content = (
        <div className="personadded-modal">
            <Button title='Okay ,got it' color="white" backgroundColor="#17A2B8" onClick={onClose}/>
        </div>
    )
    return (
        <div className="personoadded-modal-container">
            <Modal header={Header} content={content} isOpen={isOpen} />
        </div>  
    )
}

export default PersonAddedModal