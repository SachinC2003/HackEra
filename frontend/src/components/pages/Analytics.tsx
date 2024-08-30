import { useEffect, useState } from 'react';
import axios from 'axios';
import AnalyticalCard from "../cards/AnalyticalCard";
import '../../styles/analytics.css';
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';

const Analytics = () => {
    const [firstCardProperties, setFirstCardProperties] = useState<{ label:string , title:string , value:number}[]>([]);
    const [secondCardProperties, setSecondCardProperties] = useState<{ label:string , title:string , value:number}[]>([]);
    const { setIsLoading } = useLoader();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const token = localStorage.getItem('authToken');
                if (!token) {
                    toast.error("No token found");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/analytics`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'id': localStorage.getItem('userId')
                    },
                });

                if (response?.data.success) {
                    const data = response.data.data;
                    
                    setFirstCardProperties([
                        { label: 'Backlog Tasks', title: 'backlogtasks', value: data.backlogTasks },
                        { label: 'To-Do Tasks', title: 'todotasks', value: data.todoTasks },
                        { label: 'In Progress Tasks', title: 'inprogresstasks', value: data.inProgressTasks },
                        { label: 'Completed Tasks', title: 'completedtasks', value: data.completedTasks }
                    ]);

                    setSecondCardProperties([
                        { label: 'Low Priority Tasks', title: 'lowprioritytasks', value: data.lowPriorityTasks },
                        { label: 'Moderate Priority Tasks', title: 'moderateprioritytasks', value: data.moderatePriorityTasks },
                        { label: 'High Priority Tasks', title: 'highprioritytasks', value: data.highPriorityTasks },
                        { label: 'Due Date Tasks', title: 'taskswithduedate', value: data.tasksWithDueDate }
                    ]);
                } else {
                    toast.error(response?.data.message || 'Failed to fetch analytical data');
                }
            } catch (error) {
                console.error('Error fetching analytical data:', error);
                toast.error('Something went wrong while fetching analytical data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

    return (
        <>
            <h2>Analytics</h2>
            <div className="analytics-container">
                <AnalyticalCard properties={firstCardProperties} />
                <AnalyticalCard properties={secondCardProperties} />
            </div>
        </>
    );
};

export default Analytics;
