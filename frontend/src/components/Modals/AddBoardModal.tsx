import { useState } from 'react';
import '../../styles/addboardmodal.css';
import Button from '../general/Button';
import Modal from './Modal';
import Input from '../Inputs/Input';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLoader } from '../Providers/LoaderProvider';

type AddBoardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (boardName: string) => void;
};

const AddBoardModal = ({ isOpen, onClose, onSuccess }: AddBoardModalProps) => {
  const [boardName, setBoardName] = useState('');
  const { setIsLoading } = useLoader();

  const addBoard = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No token found');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/board/create-board`,
        { name: boardName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response?.data.success) {
        const addedBoardName = boardName;
        setBoardName('');
        onSuccess(addedBoardName);
      } else {
        toast.error(response?.data.message || 'Failed to add board');
      }
    } catch (error: any) {
      console.error('Error adding board:', error);
      toast.error(error.response.data.message || 'Something went wrong while adding the board');
    } finally {
      setIsLoading(false);
    }
  };

  const Header = (
    <h2>Add a new board</h2>
  );

  const content = (
    <div className="addboard-modal">
      <div>
        <Input
          id='addBoard'
          placeholder='Enter board name'
          value={boardName}
          onChange={(value) => setBoardName(value)}
          type='text'
        />
      </div>
      <div className='flex justify-between align-center gap-12'>
        <Button title="Cancel" color="red" borderColor="red" backgroundColor="white" onClick={onClose} />
        <Button title='Add board' color="white" backgroundColor="#17A2B8" onClick={addBoard} />
      </div>
    </div>
  );

  return (
    <div className='addboard-modal-container'>
      <Modal header={Header} content={content} isOpen={isOpen} />
    </div>
  );
};

export default AddBoardModal;
