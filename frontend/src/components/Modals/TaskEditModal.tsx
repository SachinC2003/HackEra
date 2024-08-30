import { Dispatch, SetStateAction } from "react";
import { Task } from "../cards/TaskCard";
import TaskModal from "./TaskModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoader } from "../Providers/LoaderProvider";

type TaskEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  setTask: Dispatch<SetStateAction<Task>>;
};

const TaskEditModal = ({ isOpen, onClose, task, setTask }: TaskEditModalProps) => {
  const { setIsLoading } = useLoader();

  const editTask = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/${task._id}`,
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data.success) {
        toast.success("Task updated successfully");
        onClose(); // Close the modal after success
        window.location.reload()
      } else {
        toast.error(response?.data.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Something went wrong while updating the task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TaskModal
        onClose={onClose}
        isOpen={isOpen}
        task={task}
        primaryAction={() => editTask()}
        setTask={setTask}
      />
    </div>
  );
};

export default TaskEditModal;
