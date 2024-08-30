import SubTaskInput from '../Inputs/SubTaskInput';
import { Subtask } from '../cards/SubTask';

type CheckListInputProps = {
    checklist: Subtask[];
    onToggle: (index: number) => void;
    onDelete: (index: number) => void;
    onUpdate: (index: number, newMessage: string) => void;
};

const CheckListInput = ({ checklist, onToggle, onDelete, onUpdate }: CheckListInputProps) => {
    return (
        <div className="checklist-input">
            {checklist.map((subtask, index) => (
                <SubTaskInput
                    key={index}
                    subtask={subtask}
                    onToggle={() => onToggle(index)}
                    onDelete={() => onDelete(index)}
                    onUpdate={(newMessage) => onUpdate(index, newMessage)}
                />
            ))}
        </div>
    );
};

export default CheckListInput;
