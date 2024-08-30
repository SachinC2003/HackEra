import { useContext } from 'react';
import '../../styles/topbar.css';
import { UserContext } from '../Providers/UserProvider';

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return 'th'; 
  switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
  }
}

function formatDate(date: Date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

const Topbar = () => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  const context = useContext(UserContext);
  
  if (!context) {
      throw new Error('Topbar must be used within a UserProvider');
  }

  const { user } = context;
  console.log('User in Topbar:', user);
  return (
    <div className="topbar-container flex justify-between">
      <div>
        <p className='title'>Welcome! {user.name}</p>
      </div>
      <div>
        <p className='date underline'>{formattedDate}</p>
      </div>
    </div>
  );
};

export default Topbar;
