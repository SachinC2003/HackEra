import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Input from "../Inputs/Input";
import { Task } from "../cards/TaskCard";
import Modal from "./Modal";
import '../../styles/taskmodal.css';
import PrioritySelect from "../Inputs/PrioritySelect";
import CheckListInput from "../Inputs/CheckListInput";
import Button from '../general/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import AssignToInput, { OptionType } from '../Inputs/AssignToInput';
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';
import { UserContext } from '../Providers/UserProvider';
import CustomLabel from '../general/CustomLabel';

type TaskModalProps = {
    isOpen: boolean;
    task: Task;
    setTask: React.Dispatch<React.SetStateAction<Task>>;
    primaryAction: () => void;
    onClose: () => void;
};

const TaskModal = ({ task, setTask, primaryAction, isOpen, onClose  }: TaskModalProps) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [emails, setEmails] = useState<{ label: string, value: string }[]>([]);
    const {setIsLoading} = useLoader()
    const context = useContext(UserContext);
  
    if (!context) {
        throw new Error('Topbar must be used within a UserProvider');
    }

    const { user } = context;
    useEffect(() => {
        const fetchBoardMembers = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/board/board-members`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setEmails(response.data.data.map((email: string) => ({ label: email, value: email })));
                } else {
                    console.error('Failed to fetch board members');
                    toast.error('Failed to fetch board members');
                }
            } catch (error) {
                console.error('Error fetching board members:', error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchBoardMembers();
    }, []);

    const handleSelect = (selectedOption:OptionType) => {
        setTask(prev => ({
            ...prev,
            assignedTo:selectedOption.value
        }));
    };

    const handleToggle = (index: number) => {
        setTask(prev => ({
            ...prev,
            checklist: prev.checklist.map((item, i) =>
                i === index ? { ...item, done: !item.done } : item
            )
        }));
    };

    const handleDelete = (index: number) => {
        setTask(prev => ({
            ...prev,
            checklist: prev.checklist.filter((_, i) => i !== index)
        }));
    };

    const handleUpdate = (index: number, newMessage: string) => {
        setTask(prev => ({
            ...prev,
            checklist: prev.checklist.map((item, i) =>
                i === index ? { ...item, message: newMessage } : item
            )
        }));
    };

    const handleAddNew = () => {
        setTask(prev => ({
            ...prev,
            checklist: [...prev.checklist, { message: '', done: false }]
        }));
    };

    const handleDateChange = (date: Date | null) => {
        const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
        setTask(prev => ({
            ...prev,
            dueDate: formattedDate
        }));
        setIsDatePickerOpen(false);
    };

    const getFormattedDate = () => {
        if (task.dueDate) {
            const date = parseISO(task.dueDate);
            return format(date, 'MM/dd/yyyy');
        }
        return 'Due Date';
    };

    const content = (
        <div className="flex flex-col gap-16">
            <div className='flex flex-col gap-4'>
                <CustomLabel title='Title' required/>
                <Input
                    id="taskTitle"
                    placeholder="Enter Task Title"
                    value={task.title}
                    onChange={(value) => setTask(prev => ({ ...prev, title: value }))}
                    type="text"
                />
            </div>
            <div>
                <PrioritySelect
                    value={task.priority}
                    onSelect={(value: string) => setTask(prev => ({ ...prev, priority: value }))}
                />
            </div>
            <div className="flex gap-4 align-center">
                <label htmlFor="assignTo" style={{whiteSpace:'nowrap'}}>Assign to</label>
                <AssignToInput 
                    options={emails} 
                    onSelect={handleSelect} 
                    value={task.assignedTo ?{label:task.assignedTo,value:task.assignedTo} : null}
                    isDisabled={task.userid!=='' && user.id!==task.userid }
                />
            </div>
            <div className='flex flex-col gap-12'>
                <CustomLabel title={`Checklist (${task.checklist.filter((subtask) => subtask.done).length}/${task.checklist.length})`} required />
                <CheckListInput
                    checklist={task.checklist}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
                <div onClick={handleAddNew} className="add-new-button">+ Add New </div>
            </div>
        </div>
    );

    const footer = (
        <div className='task-modal-footer'>
            <Button 
                title={getFormattedDate()}
                backgroundColor='white'
                borderColor='#E2E2E2'
                color='#707070'
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            />
            {isDatePickerOpen && (
                <div className='datepicker-overlay' onClick={()=>setIsDatePickerOpen(false)}>
                    <div className='datepicker-modal'>
                        <DatePicker
                            selected={task.dueDate ? parseISO(task.dueDate) : null}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            inline
                            className="custom-date-picker"
                        />
                    </div>
                </div>
            )}
            <div className='flex gap-4'>
                <Button 
                    title='Cancel'
                    backgroundColor='white'
                    borderColor='#CF3636'
                    color='#CF3636'
                    onClick={() => onClose()}
                />
                <Button 
                    title='Save'
                    backgroundColor='#17A2B8'
                    borderColor='#17A2B8'
                    color='white'
                    onClick={primaryAction}
                />
            </div>
        </div>
    );

    return( 
        <div className='task-edit-modal-container'>
            <Modal isOpen={isOpen} content={content} footer={footer} />
        </div>
    );
};

export default TaskModal;
