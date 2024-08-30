import { useState } from "react";
import TaskListHeader from "./TaskListHeader";
import "../../styles/tasklist.css";
import TaskCard, { Task } from "./TaskCard";

type TaskListProps = {
  title: string;
  tasklist: Task[];
  type: string;
};

const TaskList = ({ title, tasklist, type }: TaskListProps) => {
  const [collapseAll, setCollapseAll] = useState(false);

  const handleCollapseAll = () => {
    setCollapseAll(!collapseAll);
  };

  return (
    <div className="tasklist-container">
      <TaskListHeader title={title} type={type} onCollapseAll={handleCollapseAll} />
      {tasklist.length===0 && <div style={{height:'80%' , color:'grey' , opacity:'50%'}} className="flex justify-center align-center">
          No tasks added
      </div>}
      {tasklist.length!==0 && tasklist.map((task, index) => (
        <TaskCard key={index} {...task} collapseAll={collapseAll} />
      ))}
    </div>
  );
};

export default TaskList;
