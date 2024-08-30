import { Subtask } from "../cards/SubTask";

type SubTaskInputProps = {
    subtask: Subtask;
    onToggle: () => void;
    onDelete: () => void;
    onUpdate: (newMessage: string) => void;
};

const SubTaskInput = ({ subtask, onToggle, onDelete, onUpdate }: SubTaskInputProps) => {
    return (
        <div className="subtask-item">
            <input type="checkbox" checked={subtask.done} onChange={onToggle} />
            <input
                type="text"
                value={subtask.message}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="Add a task..."
                className={subtask.done ? 'done' : ''}
            />
            <button onClick={onDelete}>
                <img src="/delete.png" alt="" />
            </button>
        </div>
    );
};

export default SubTaskInput;
