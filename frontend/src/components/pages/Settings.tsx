import Input from "../Inputs/Input";
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { MdLockOutline, MdOutlineEmail, MdOutlinePerson } from 'react-icons/md';
import { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import '../../styles/settings.css';
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';
import { UserContext } from '../Providers/UserProvider';
import { useNavigate } from 'react-router-dom';

interface ErrorMessages {
    name?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
    [key: string]: string | undefined;
}

const Settings = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('UserProvider error');
  }

  const { user, setUser } = context;
  const [name, setName] = useState(user.name);
  const [newPassword, setNewPassword] = useState('');
  const [updateEmail, setUpdateEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<ErrorMessages>({});
  const { setIsLoading } = useLoader();
  const navigate = useNavigate();
  
  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setErrors({});

      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error("User is not authenticated");
        return;
      }

      const payload: { name?: string; email?: string; oldPassword?: string; newPassword?: string} = {};
      if (name !== user.name) payload.name = name;
      if (updateEmail !== user.email) payload.email = updateEmail;
      if (oldPassword && newPassword) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response?.data.success) {
        toast.success('User information updated successfully');
        
        if (payload.email || payload.newPassword) {
          localStorage.removeItem('authToken');
          setUser(prevUser => ({
            ...prevUser,
            name: '',
            email: '',
          }));
          toast.info('Your profile was updated. Please log in again.');
          navigate('/login');
        } else {
          setUser(prevUser => ({
            ...prevUser,
            name: payload.name || prevUser.name,
            email: payload.email || prevUser.email,
          }));
        }
      } else {
        if (response.status === 409) {
          toast.error('User with given email already exists');
        } else {
          setErrors(response.data.errors || {});
          toast.error(response?.data.message || 'Failed to update user information');
        }
      }
    } catch (error: any) {
      console.error('Error updating user information:', error);
      toast.error(error.response?.data.message || 'Something went wrong while updating user information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form className="auth-form" onSubmit={handleUpdate} autoComplete="off">
        <Input
          id="name"
          icon={MdOutlinePerson}
          type="text"
          placeholder="Name..."
          value={name}
          onChange={(value: string) => setName(value)}
          error={errors.name}
        />
        <Input
          id="email"
          icon={MdOutlineEmail}
          type="email"
          placeholder="Updated Email..."
          value={updateEmail}
          onChange={(value: string) => setUpdateEmail(value)}
          error={errors.email}
        />
        <Input
          id="oldPassword"
          icon={MdLockOutline}
          type={isOldPasswordVisible ? 'text' : 'password'}
          placeholder="Old Password..."
          extraIcon={isOldPasswordVisible ? PiEyeSlash : PiEye}
          extraIconOnclick={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
          value={oldPassword}
          onChange={(value: string) => setOldPassword(value)}
          error={errors.oldPassword}
        />
        <Input
          id="newPassword"
          icon={MdLockOutline}
          type={isNewPasswordVisible ? 'text' : 'password'}
          placeholder="New Password..."
          extraIcon={isNewPasswordVisible ? PiEyeSlash : PiEye}
          extraIconOnclick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          value={newPassword}
          onChange={(value: string) => setNewPassword(value)}
          error={errors.newPassword}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Settings;
