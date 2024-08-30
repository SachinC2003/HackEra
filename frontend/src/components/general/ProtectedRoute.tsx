import { ReactNode, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Providers/UserProvider';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  if (!context) {
    throw new Error('UserProvider error');
  }

  const { user, setUser } = context;

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser((prev) => ({ ...prev, ...response.data.data }));
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.log(error)
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user.id) {
    return <div>{children}</div>;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoute;
