import { useEffect, useState } from "react";
import AddTaskModal from "../Modals/AddTaskModal";
import { useParams } from "react-router-dom";

type TaskListHeaderProps = {
  title: string;
  type: string;
  onCollapseAll: () => void;
};

const TaskListHeader = ({ title, type, onCollapseAll }: TaskListHeaderProps) => {
  const{ boardId} = useParams<{
    boardId:string
  }>()
  const [cboardId, setCboardId] = useState(boardId);

  useEffect(()=>{
    console.log("Board id updated to", boardId)
      setCboardId((prev)=>boardId || '');
  },[boardId])

  const [isAddTaskModalOpen,setIsAddTaskModalOpen]=useState(false)
  return (
    <>
      <AddTaskModal isOpen={isAddTaskModalOpen} onClose={()=>setIsAddTaskModalOpen(false)} boardId={cboardId ||''}/>
      <div className="flex justify-between tasklistheader-container">
        <div>
          <p className="tasklistheader">{title}</p>
        </div>
        <div className="flex align-center justify-center gap-8">
          {type === 'todo' && <img style={{ width: '14px', height: '14px',cursor:"pointer" }} src="/addTask.png" alt="add task button" onClick={()=>setIsAddTaskModalOpen(true)} />}
          <img src="/collapse.png" alt="collapse button" onClick={onCollapseAll} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </>
    
  );
};

export default TaskListHeader;
