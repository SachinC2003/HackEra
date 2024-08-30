import { format, parseISO } from "date-fns";
import CheckList from "./CheckList";
import "../../styles/taskcard.css";
import Button from "../general/Button";
import { Task } from "../cards/TaskCard";

type TaskCardProps = {
    task:Task
} 

const TaskCard = ({task}: TaskCardProps) => {
    const getInitials = (email:string) => {
        const parts = email.split('@')[0].split('.');
        if (parts.length > 1) {
        return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
        }
        return parts[0][0].toUpperCase() + parts[0][1].toUpperCase();
    };
  
    const priorityStatus = task.priority === "high" ? "HIGH PRIORITY" : task.priority === "moderate" ? "MODERATE PRIORITY" : "LOW PRIORITY";
    const priorityImage = task.priority === "high" ? "/highpriority.png" : task.priority === "moderate" ? "/moderatepriority.png" : "/lowpriority.png";
    
    let formattedDueDate;
    if(task.dueDate)
    {
        formattedDueDate = format(parseISO(task.dueDate), "dd MMM");
    }
    
    return (
        <div className="task-card">
            <div className="task-card-header">
                <span className="flex align-center gap-8">
                <span className="task-priority">
                    <img className="mr-2" src={priorityImage} alt="Priority" />
                    {priorityStatus}
                </span>
                {task.assignedTo && 
                    <span title={task.assignedTo} className="profile-view">{getInitials(task.assignedTo)}</span>
                }
                </span>
            </div>
        <h3 className="task-title">{task.title}</h3>
        {task.checklist.length !== 0 && (
        <div>
            <div>
                <span className="checklist-header">
                    Checklist ({task.checklist.filter((subtask) => subtask.done).length}/{task.checklist.length})
                </span> 
            </div>
            <CheckList checklist={task.checklist} onToggle={()=>{}} />
        </div>
        )}
        <div className="task-footer">
            {task.dueDate && (
            <>
                <h4 className="duedatelabel">
                    Due Date
                </h4>
                <Button
                    title={formattedDueDate!}
                    backgroundColor='#CF3636'
                    color='white'
                    borderColor='#CF3636'
                />
            </>
           
            )}
        </div>
        </div>
    );
};

export default TaskCard;
