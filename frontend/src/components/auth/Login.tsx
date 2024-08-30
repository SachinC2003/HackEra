import '../../styles/auth.css';
import Input from '../Inputs/Input';
import { MdLockOutline, MdOutlineEmail } from 'react-icons/md';
import { useState } from 'react';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoader } from '../Providers/LoaderProvider';

interface ErrorMessages {
    email?: string;
    password?: string;
    [key: string]: string | undefined;
}

function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorMessages>({});
    const navigate = useNavigate();
    const { setIsLoading } = useLoader();

    const loginUser = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            const user = {
                email,
                password,
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, user);
            if (response?.data.success) {
                localStorage.setItem('authToken', response?.data.authToken);
                toast.success(response?.data.message);
                navigate('/dashboard'); // Navigate after successful login
            } else {
                toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error("Something went wrong!");
                console.error(err)
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
                <h2>Login</h2>
                <form className="auth-form">
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
                    <button onClick={(e) => { e.preventDefault(); loginUser(); }}>Log in</button>
                </form>
                <p>Have no account yet ??</p>
                <button 
                    className='secondary'
                    onClick={() => navigate('/register')}
                >Register</button>
            </div>
        </div>
    );
}

export default Login;
