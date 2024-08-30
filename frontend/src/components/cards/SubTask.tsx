export type Subtask ={
    message :string ,
    done:boolean
}

const SubTask = ({ message, done, onToggle }: Subtask & { onToggle: () => void }) => {
    return (
      <div className="subtask">
        <input type="checkbox" checked={done} onChange={onToggle} />
        <span className={done ? 'done' : ''}>{message}</span>
      </div>
    );
  };
  
  export default SubTask;