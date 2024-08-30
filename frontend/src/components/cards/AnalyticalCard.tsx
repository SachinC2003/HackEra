import '../../styles/analyticalcard.css'

type AnalyticalCardProps = {
    properties:{ label:string , title:string , value:number}[]
}

const AnalyticalCard = ({properties}:AnalyticalCardProps) => {
  return (
    <div className="analyticalcard-container">
        <ul>
            {properties.map((property, index) => (
                <li key={index}>
                    <div className="flex justify-between">
                        <div>
                            {property.label}
                        </div>
                        <div className='property-value'>
                            {property.value.toString().padStart(2, '0')}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
        
    </div>
  )
}

export default AnalyticalCard