import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from "../general/Topbar";
import '../../styles/dashboard.css';
import SelectInput from "../Inputs/SelectInput";
import TaskList from "../cards/TaskList";
import { Task } from "../cards/TaskCard";
import { useLoader } from "../Providers/LoaderProvider";
import { GoPeople } from "react-icons/go";
import { FaEdit, FaTrash } from 'react-icons/fa';
import AddPeopleModal from "../Modals/AddPeopleModal";
import PersonAddedModal from "../Modals/PersonAddedModal";
import { toast } from 'react-toastify';
import EditBoardModal from '../Modals/EditBoardModal';
import AddBoardModal from '../Modals/AddBoardModal';

const Dashboard: React.FC = () => {
  const [filterOption, setFilterOption] = useState('week');
  const [todo, setTodo] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [backlog, setBacklog] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);
  const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
  const [isPersonAddedModalOpen, setIsPersonAddedModalOpen] = useState(false);
  const [emailAdded, setEmailAdded] = useState('');
  const [boards, setBoards] = useState<{ _id: string; name: string }[]>([]);
  const [currentBoardName, setCurrentBoardName] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<{ _id: string; name: string } | null>(null);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);

  const navigate = useNavigate();
  const { setIsLoading } = useLoader();
  let { boardId } = useParams<{ boardId: string }>();
  
  console.log("boardIfd",boardId)
  const [cboardId, setCboardId] = useState(boardId || '');
  
  useEffect(()=>{
      setCboardId((prev)=>boardId||'');
  },[boardId])

  const options = [
    { label: 'Today', value: 'today' },
    { label: 'This week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  useEffect(() => {
    fetchBoards();
    fetchTasks();
  }, [cboardId, filterOption]);
  console.log('Dashboard component rendered');

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/board/boards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBoards(response.data.data);
        if (cboardId) {
          const currentBoard = response.data.data.find((board: any) => board._id === cboardId);
          setCurrentBoardName(currentBoard ? currentBoard.name : '');
        } else {
          setCurrentBoardName('All Tasks');
        }
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast.error('Failed to fetch boards');
    }
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          filter: filterOption,
          boardId: cboardId || '',
        },
      });

      if (response.data.success) {
        const tasks = response.data.data;
        setTodo(tasks.todo);
        setInProgress(tasks.inprogress);
        setBacklog(tasks.backlog);
        setDone(tasks.done);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const createBoard = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/board/create-board`,
        { name: newBoardName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Board created successfully');
        setIsCreatingBoard(false);
        setNewBoardName('');
        fetchBoards();
      }
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error('Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBoard = (board: { _id: string; name: string }) => {
    setEditingBoard(board);
    setIsEditBoardModalOpen(true);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/board/delete-board/${boardId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success('Board deleted successfully');
          fetchBoards();
          if (cboardId === editingBoard?._id) {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error deleting board:', error);
        toast.error('Failed to delete board');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateBoard = async (boardId: string, newName: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/board/edit-board/${boardId}`,
        { name: newName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Board updated successfully');
        setIsEditBoardModalOpen(false);
        fetchBoards();
      }
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Failed to update board');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isPersonAddedModalOpen && 
        <PersonAddedModal 
          isOpen={isPersonAddedModalOpen}
          onClose={() => setIsPersonAddedModalOpen(false)}
          email={emailAdded}
        />
      }
      {isAddPeopleModalOpen &&
        <AddPeopleModal 
          isOpen={isAddPeopleModalOpen} 
          onClose={() => setIsAddPeopleModalOpen(false)}
          onSuccess={(email: string) => {
            setIsAddPeopleModalOpen(false);
            setEmailAdded(email);
            setIsPersonAddedModalOpen(true);
          }}
        />
      }
      {isEditBoardModalOpen && editingBoard && (
        <EditBoardModal
          isOpen={isEditBoardModalOpen}
          onClose={() => setIsEditBoardModalOpen(false)}
          board={editingBoard}
          onUpdate={(newName:string) => updateBoard(editingBoard._id, newName)}
        />
      )}
      <Topbar />
      <div className="flex justify-between align-center">
        <div className="flex align-center gap-16">
          <div className="relative">
          <select
            value={cboardId || ''}
            onChange={(e) => {
              if (e.target.value === 'create-new') {
                console.log('hi')
                setIsAddBoardModalOpen(true);
              } else {
                navigate(`/dashboard/${e.target.value}`);
              }
            }}
            className="board-dropdown"
          >
            {/* Render all boards including the selected one */}
            {boards.map((board) => (
              <option key={board._id} value={board._id}>
                {board.name}
              </option>
            ))}
            <option value="">Your Tasks</option>
            <option value="create-new">+ Add Board</option>
          </select>
            {
              <AddBoardModal 
                isOpen={isAddBoardModalOpen} 
                onClose={() => setIsAddBoardModalOpen(false)}
                onSuccess={(boardName: string) => {
                  toast.success(`${boardName} created successfully`);
                  fetchBoards();
                  setIsAddBoardModalOpen(false)
                }} 
              />
            }
          </div>
          <div className='add-people-button flex align-center gap-4' onClick={() => setIsAddPeopleModalOpen(true)}>
            <GoPeople />
            <p>Add People</p>
          </div>
        </div>
        <div className="flex align-center gap-16">
          
          
        </div>
        <div className="flex align-center gap-16">
          {cboardId && (
            <div className="board-actions">
              <button onClick={() => handleEditBoard(boards.find(b => b._id === cboardId)!) } className='edit-button'>
                <FaEdit /> Edit Board
              </button>
              <button onClick={() => handleDeleteBoard(cboardId)} className='delete-button'>
                <FaTrash /> Delete Board
              </button>
            </div>
          )}
          
          <div className="filter">
            <SelectInput options={options} onChange={(value: string) => setFilterOption(value)} />
          </div>
        </div>
      </div>
      <div className="flex dashboard-container">
        <TaskList tasklist={backlog} title="Backlog" type="backlog" />
        <TaskList tasklist={todo} title="To Do" type="todo" />
        <TaskList tasklist={inProgress} title="In Progress" type="inprogress" />
        <TaskList tasklist={done} title="Done" type="done" />
      </div>
    </>
  );
};

export default Dashboard;