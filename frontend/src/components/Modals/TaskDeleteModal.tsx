
import AssuranceModal from "./AssuranceModal"
type TaskDeleteModalProps ={
  isOpen:boolean
  onClose:()=>void,
  deleteTask:()=>void
}
const TaskDeleteModal = ({isOpen,onClose,deleteTask}:TaskDeleteModalProps) => {
  return (
    <AssuranceModal 
      title="Are you sure you want to Delete?"
      isOpen={isOpen}
      onClose={onClose}
      primaryLabel="Yes, Delete"
      primaryAction={deleteTask}
    />
  )
}

export default TaskDeleteModal