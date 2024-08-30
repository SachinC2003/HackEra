import '../../styles/auth.css';
import Input from '../Inputs/Input';
import { MdLockOutline, MdOutlineEmail, MdOutlinePerson } from 'react-icons/md';
import { useState } from 'react';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';

interface ErrorMessages {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    [key: string]: string | undefined;
}

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorMessages>({});
    const { setIsLoading } = useLoader();

    const registerUser = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            const user = {
                name,
                email,
                password,
                confirmPassword
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, user);
            if (response?.data.success) {
                localStorage.setItem('authToken', response?.data.authToken);
                toast.success(response?.data.message);
                navigate('/dashboard'); // Navigate after successful registration
            } else {
                toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };

    return (
        <div className="login-container">
            <div className="image-section">
                <div className='image-container'>
                    <div className='circle'></div>
                    <img src="/Art.png" alt="Center Image" className="center-image" />
                </div>
                
                <h1 className='image-heading'>Welcome aboard my friend</h1>
                <p className="image-text">just a couple of clicks and we start</p>
            </div>
            <div className="form-section">
                <h2>Register</h2>
                <form className="auth-form" autoComplete='off'>
                    <Input 
                        id='name'
                        icon={MdOutlinePerson} 
                        type='text' 
                        placeholder='Name...' 
                        value={name}
                        onChange={(value: string) => setName(value)}
                        error={errors.name}
                    />
                    <Input 
                        id='email'
                        icon={MdOutlineEmail} 
                        type='email' 
                        placeholder='Email...' 
                        value={email}
                        onChange={(value: string) => setEmail(value)}
                        error={errors.email}
                    />
                    <Input 
                        id='password'
                        icon={MdLockOutline} 
                        type={isPasswordVisible ? 'text' : 'password'} 
                        placeholder='Password...' 
                        extraIcon={isPasswordVisible ? PiEyeSlash : PiEye} 
                        extraIconOnclick={() => setIsPasswordVisible((t) => !t)} 
                        value={password}
                        onChange={(value: string) => setPassword(value)}
                        error={errors.password}
                    />
                    <Input 
                        id='confirmPassword'
                        icon={MdLockOutline} 
                        type={isConfirmPasswordVisible ? 'text' : 'password'} 
                        placeholder='Confirm Password...' 
                        extraIcon={isConfirmPasswordVisible ? PiEyeSlash : PiEye} 
                        extraIconOnclick={() => setIsConfirmPasswordVisible((t) => !t)} 
                        value={confirmPassword}
                        onChange={(value: string) => setConfirmPassword(value)}
                        error={errors.confirmPassword}
                    />
                    <button onClick={(e) => { e.preventDefault(); registerUser(); }}>Register</button>
                </form>
                <p>Have an account?</p>
                <button 
                    className='secondary'
                    onClick={() => navigate('/login')}
                >Log in</button>
            </div>
        </div>
    );
}

export default Register;
