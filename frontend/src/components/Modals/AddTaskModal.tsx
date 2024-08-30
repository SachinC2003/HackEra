import axios from 'axios';
import { useContext, useState } from 'react';
import { Task } from "../cards/TaskCard";
import TaskModal from "./TaskModal";
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';
import { UserContext } from '../Providers/UserProvider';
import { useParams } from 'react-router-dom';

type AddTaskModalProps = {
    isOpen: boolean,
    onClose: () => void,
    boardId :string
};

const AddTaskModal = ({ isOpen, onClose ,boardId }: AddTaskModalProps) => {
    
    const context = useContext(UserContext);
  
    if (!context) {
        throw new Error('Topbar must be used within a UserProvider');
    }

    const { user } = context;
    const [task, setTask] = useState<Task>({
        userid: user.id,
        title: '',
        priority: 'low',
        checklist: [{ message: '', done: false }],
        type: 'todo',
        boardId // Add boardId to the task object
    });
    const { setIsLoading } = useLoader();
    
    const addTask = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/task/tasks`, task, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                toast.success("Task created successfully");
                onClose();
                window.location.reload();
            } else {
                toast.error(response?.data.message || "Failed to create task");
            }
        } catch (error:any) {
            console.error("Error creating task:", error);
            toast.error(error.response.data.message || "Something went wrong while creating task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {
                <TaskModal
                    isOpen={isOpen}
                    task={task}
                    setTask={setTask}
                    primaryAction={addTask}
                    onClose={() => {
                        setTask({
                            userid: '',
                            title: '',
                            priority: 'low',
                            checklist: [{ message: '', done: false }],
                            type: 'todo',
                            boardId // Reset the boardId
                        });
                        onClose();
                    }}
                />
            }
        </>
    );
};

export default AddTaskModal;
