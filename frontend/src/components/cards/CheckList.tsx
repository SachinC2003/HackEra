import SubTask, { Subtask } from "./SubTask";

type CheckListProps = {
    checklist: Subtask[];
    onToggle: (index: number) => void;
};

const CheckList = ({ checklist, onToggle }: CheckListProps) => {
    return (
        <div className="checklist">
            {checklist.map((subtask, index) => (
                <SubTask
                    key={index}
                    {...subtask}
                    onToggle={() => onToggle(index)}
                />
            ))}
        </div>
    );
};

export default CheckList;
