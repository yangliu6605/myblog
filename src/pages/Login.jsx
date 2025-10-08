import { useState } from 'react';
import { useLogin } from '../hooks/useLogin'; 
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import '../assets/login.css';

function Login() {

    const [username, setUsername] = useState('')
    const [password,setPassword] = useState('')
    
    const {login} = useLogin()
    const { isLoading, error } = useAuthContext()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await login(username, password)
            // 如果登录成功，跳转到首页
            navigate('/')
        } catch (err) {
            // 错误已经在 context 中处理了
            console.log('登录失败:', err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="login">
            <h2>登录</h2>
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '登录中...' : '登录'}
                </button>
                {error && <div className="error-message">{error}</div>}
            </form>
    );
}

export default Login;