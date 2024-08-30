import { useState, useEffect } from "react";
import { format, isBefore, parseISO, isToday } from "date-fns";
import CheckList from "./CheckList";
import { Subtask } from "./SubTask";
import "../../styles/taskcard.css";
import Button from "../general/Button";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useLoader } from "../Providers/LoaderProvider";
import CardOptions from "../Inputs/CardOptions";
import TaskDeleteModal from "../Modals/TaskDeleteModal";
import TaskEditModal from "../Modals/TaskEditModal";

export type Task = {
  _id?: string;
  userid: string;
  title: string;
  priority: string;
  checklist: Subtask[];
  dueDate?: string;
  type: string;
  boardId?: string;  
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
};

type TaskCardProps = Task & {
  collapseAll: boolean;
};

const TaskCard = ({ _id, title, priority, checklist, dueDate, type, collapseAll ,userid ,assignedTo , }: TaskCardProps) => {
  const [isChecklistVisible, setIsChecklistVisible] = useState(true);
  const { setIsLoading } = useLoader();
  const [isTaskDeleteModalOpen, setIsTaskDeleteModalOpen] = useState(false);
  const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
  const [task, setTask] = useState<Task>({
    _id,
    userid,
    title,
    priority,
    checklist,
    dueDate,
    type,
    assignedTo,
  });

  useEffect(() => {
    setIsChecklistVisible(!collapseAll);
  }, [collapseAll]);
  
  const getInitials = (email:string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return parts[0][0].toUpperCase() + parts[0][1].toUpperCase();
  };

  const handleDeleteTask = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/task/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.success) {
        window.location.reload();
        toast.success("Task deleted successfully");
      } else {
        toast.error(response?.data.message || "Failed to delete task");
      }
    } catch (error:any) {
      console.error("Error deleting task:", error);
      toast.error(  error.response.data.message || "Something went wrong while deleting task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardAction = (action: string) => {
    if (action === "delete") {
      setIsTaskDeleteModalOpen(true);
    }
    else if (action === 'edit') {
      setIsTaskEditModalOpen(true)
    }
    else if(action === 'share')
    {
      const path = `${window.location.protocol}//${window.location.host}/tasks/${_id}`
        navigator.clipboard.writeText(path).then(() => {
        toast("Link copied",{
          style:{
            backgroundColor:'#F6FFF9',
            border:'1px solid #48C1B5',
            textAlign:'center',
            width:'200px',
            left:'120px'
          },
          position:"top-right",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton:false,
          theme: "light",
          transition: Bounce,
        })
      }).catch(err => {
        console.error("Could not copy text: ", err);
        toast.error("Could not copy text")
      }); 
    }
  };

  const handleToggle = async (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].done = !updatedChecklist[index].done;

    try {
      setIsLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/task/${_id}`, {
        checklist: updatedChecklist,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.success) {
        window.location.reload()
        toast.success("Subtask updated successfully");
      } else {
        toast.error(response?.data.message || "Failed to update subtask");
      }
    } catch (error:any) {
      console.error("Error updating subtask:", error);
      toast.error(error.response.data.message ||"Something went wrong while updating subtask");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskType = async (newType: string) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found");
        return;
      }

      const payload = {
        type: newType,
      };

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/task/${_id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.success) {
        window.location.reload();
        toast.success("Task updated successfully");
      } else {
        toast.error(response?.data.message || "Failed to update task");
      }
    } catch (error:any) {
      console.error("Error updating task:", error);
      toast.error( error.response.data.message || "Something went wrong while updating task");
    } finally {
      setIsLoading(false);
    }
  };

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };

  const cardOptions = [
    { label: "Edit", value: "edit" },
    { label: "Share", value: "share" },
    { label: "Delete", value: "delete" },
  ];

  const priorityStatus = priority === "high" ? "HIGH PRIORITY" : priority === "moderate" ? "MODERATE PRIORITY" : "LOW PRIORITY";
  const priorityImage = priority === "high" ? "/highpriority.png" : priority === "moderate" ? "/moderatepriority.png" : "/lowpriority.png";

  const taskTypes = ["backlog", "todo", "inprogress", "done"];
  const otherTaskTypes = taskTypes.filter(taskType => taskType !== type);

  let formattedDueDate;
  let dueDateObj;
  let isDueDateBeforeToday;
  let backgroundColor;
  let color;
  let borderColor;

  if (dueDate) {
    formattedDueDate = format(parseISO(dueDate), "dd MMM");
    dueDateObj = parseISO(dueDate);
    isDueDateBeforeToday = isBefore(dueDateObj, new Date()) && !isToday(dueDateObj);
    backgroundColor = type === "done" ? "#63C05B" : isDueDateBeforeToday ? "#CF3636" : "#DBDBDB";
    color = type === "done" ? "white" : isDueDateBeforeToday ? "white" : "#5A5A5A";
    borderColor = backgroundColor;
  }

  return (
    <div className="task-card">
      { isTaskEditModalOpen && 
        <TaskEditModal 
          isOpen={isTaskEditModalOpen}
          onClose={()=>setIsTaskEditModalOpen(false)}
          task={task}
          setTask={setTask}
        />
      }
      {isTaskDeleteModalOpen &&     
        <TaskDeleteModal isOpen={isTaskDeleteModalOpen} onClose={() => setIsTaskDeleteModalOpen(false)} deleteTask={handleDeleteTask} />
      }      
      <div className="task-card-header">
        <span className="flex align-center gap-8">
          <span className="task-priority">
            <img className="mr-2" src={priorityImage} alt="Priority" />
            {priorityStatus}
          </span>
          {assignedTo && 
              <span title={assignedTo} className="profile-view">{getInitials(assignedTo)}</span>
          }
        </span>
        <span className="task-settings">
          <CardOptions options={cardOptions} onChange={(action) => handleCardAction(action)} />
        </span>
        
      </div>
      <h3 className="task-title" title={title}>{truncateTitle(title, 21)}</h3>
      {checklist.length !== 0 && (
        <>
          <div className="task-card-header">
            <span className="checklist-header">
              Checklist ({checklist.filter((subtask) => subtask.done).length}/{checklist.length})
            </span>
            <span className="down-arrow-filled" onClick={() => setIsChecklistVisible(!isChecklistVisible)}>
              <img src="/arrow-down.png" alt="Toggle Checklist" style={{ transform: isChecklistVisible ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
            </span>
          </div>
          {isChecklistVisible && <CheckList checklist={checklist} onToggle={handleToggle} />}
        </>
      )}
      <div className="task-footer">
        {dueDate && (
          <Button
            title={formattedDueDate!}
            backgroundColor={backgroundColor!}
            color={color!}
            borderColor={borderColor}
          />
        )}
        {!dueDate && <div></div>}
        <div></div>
        {otherTaskTypes.map((taskType, index) => (
          <Button
            key={index}
            title={taskType==="inprogress"?'PROGRESS': taskType.toUpperCase()}
            backgroundColor="#EEECEC"
            color="#767575"
            borderColor="#EEECEC"
            onClick={() => updateTaskType(taskType)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
