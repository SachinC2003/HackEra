import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useLoader } from '../Providers/LoaderProvider';
import '../../styles/publicview.css'
import { Task } from '../cards/TaskCard';
import ViewOnlyTaskCard from '../cards/ViewOnlyTaskCard';

const TaskPublicView = () => {
  const [task, setTask] = useState<Task>();
  const {setIsLoading}= useLoader()
  
  const {taskId} = useParams()
  console.log(taskId)
  
    useEffect(() => {
        const fetchTask = async () => {
            try {
            setIsLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/task/${taskId}`);
        
            if (response.data.success) {
                setTask(response.data.data); 
            } else {
                console.error('Failed to fetch task:', response.data.message);
            }
            } catch (error:any) {
            console.error('Error fetching task:', error);
            toast.error(error.response.data.message || "Error fetching task")
            }finally{
                setIsLoading(false)
            }
        };
        fetchTask(); 
    }, []);

return (
    <div className='public-view'>
        <div className='topbar'>
            <img src='/publiclogo.png'/>
        </div>
        {task && 
        <div className='taskcardholder'>
            <ViewOnlyTaskCard 
                task={task}
            />
        </div>
        }
    </div>
);
};

export default TaskPublicView;
