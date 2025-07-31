import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

function Login() {
    const { backendUrl, setIsLoggedIn, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/auth/login`, { username, password });
            if (data.success) {
                setIsLoggedIn(true);
                setUser(data.user);
                navigate('/');
            } else {
                alert(data.message || '登录失败，请检查用户名和密码');
            }
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录失败，请检查用户名和密码');
        }
    };

    return (
        <div className="login-container">
            <h2>登录</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="username">用户名</label>
                <input
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    id="username"
                    name="username"
                    required
                />
                <label htmlFor="password">密码</label>
                <input
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    id="password"
                    name="password"
                    required
                />
                <button type="submit">登录</button>
            </form>
        </div>
    );
}

export default Login;