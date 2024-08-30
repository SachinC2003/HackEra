import axios from 'axios';
import { useState } from 'react';
import '../../styles/addpeoplemodal.css';
import Button from '../general/Button';
import Modal from './Modal';
import Input from '../Inputs/Input';
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';

type AddPeopleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess:(email:string)=>void
};

const AddPeopleModal = ({ isOpen, onClose , onSuccess}: AddPeopleModalProps) => {
  const [email, setEmail] = useState('');
  const {setIsLoading} = useLoader()

  const addEmail = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/board/add-member`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response?.data.success) {
        const emailAdded = email;
        setEmail('');
        onSuccess(emailAdded);
      } else {
        toast.error(response?.data.message || "Failed to add email");
      }
    } catch (error:any) {
      console.error("Error adding email:", error);
      toast.error(error.response.data.message ||"Something went wrong while adding email");
    } finally {
      setIsLoading(false);
    }
  };

  const Header = (
    <h2>Add people to the board</h2>
  );

  const content = (
    <div className="addpeople-modal">
      <div>
        <Input
          id='addEmail'
          placeholder='Enter the email'
          value={email}
          onChange={(value) => setEmail(value)}
          type='string'
        />
      </div>
      <div className='flex justify-between align-center gap-12'>
        <Button title="Cancel" color="red" borderColor="red" backgroundColor="white" onClick={onClose} />
        <Button title='Add email' color="white" backgroundColor="#17A2B8" onClick={addEmail} />
      </div>
    </div>
  );

  return (
    <div className='addpeople-modal-container'>
      <Modal header={Header} content={content} isOpen={isOpen} />
    </div>
  );
};

export default AddPeopleModal;
