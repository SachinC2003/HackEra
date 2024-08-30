import CustomLabel from "../general/CustomLabel"

type PrioritySelectProps = {
    value:string,
    onSelect:(value:string)=>void
}
const PrioritySelect = ({value,onSelect}:PrioritySelectProps) => {
    const priorities = [
        {
            value:'low',
            priorityStatus:'LOW PRIORITY',
            priorityImage:'/lowpriority.png'
        },
        {
            value:'moderate',
            priorityStatus:'MODERATE PRIORITY',
            priorityImage:'/moderatepriority.png'
        },
        {
            value:'high',
            priorityStatus:'HIGH PRIORITY',
            priorityImage:'/highpriority.png'
            
        }
    ]
    return (
        <div className="flex align-center">
            <CustomLabel title='Select Priority' required/>
            
            {priorities.map((priority,index)=>(
                <span 
                    className={`flex gap-12 align-center ml-10 priority-container ${value===priority.value ? 'selected':''}`}
                    onClick={()=>onSelect(priority.value)}
                    key={index}
                >
                    <img className="" src={priority.priorityImage} alt="Priority" />
                    {priority.priorityStatus}
              </span>
            ))}
        </div>
    )
}

export default PrioritySelect