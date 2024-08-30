import React, { useState } from 'react';
import '../../styles/editboardmodal.css';
import Button from '../general/Button';
import Modal from './Modal';
import Input from '../Inputs/Input';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLoader } from '../Providers/LoaderProvider';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: { _id: string; name: string };
  onUpdate: (newName: string) => void;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({ isOpen, onClose, board, onUpdate }) => {
  const [newBoardName, setNewBoardName] = useState(board.name);
  const { setIsLoading } = useLoader();

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No token found');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/board/update-board/${board._id}`,
        { name: newBoardName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response?.data.success) {
        onUpdate(newBoardName);
        onClose();
      } else {
        toast.error(response?.data.message || 'Failed to update board');
      }
    } catch (error: any) {
      console.error('Error updating board:', error);
      toast.error(error.response?.data.message || 'Something went wrong while updating the board');
    } finally {
      setIsLoading(false);
    }
  };

  const Header = (
    <h2>Edit Board</h2>
  );

  const content = (
    <div className="editboard-modal">
      <div>
        <Input
          id='editBoard'
          placeholder='Enter board name'
          value={newBoardName}
          onChange={(value) => setNewBoardName(value)}
          type='text'
        />
      </div>
      <div className='flex justify-between align-center gap-12'>
        <Button title="Cancel" color="red" borderColor="red" backgroundColor="white" onClick={onClose} />
        <Button title='Update board' color="white" backgroundColor="#17A2B8" onClick={handleUpdate} />
      </div>
    </div>
  );

  return (
    <div className='editboard-modal-container'>
      <Modal header={Header} content={content} isOpen={isOpen} />
    </div>
  );
};

export default EditBoardModal;