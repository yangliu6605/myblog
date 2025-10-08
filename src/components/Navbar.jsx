import '../assets/navbar.css';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

function Navbar() {
   const { user, logout } = useAuthContext()

   const handleLogout = () => {
       logout()
   }

    return (
        <header>
            <nav className="navbar">
                <Link to="/"><h1>我的博客</h1></Link> 
                {user &&      
                    (<ul>
                        <Link to='/new-post'><li>发布文章</li></Link>
                        <li className='nav-item'>{user.username}</li>
                        <li className='nav-item' onClick={handleLogout} style={{cursor: 'pointer'}}>登出</li>
                    </ul>
                    )}
                {!user &&(
                    <ul>
                         <Link to='/login'><li className='nav-item'>登录</li></Link>
                     </ul>
                )} 
            </nav>    
        </header>
    );
}

export default Navbar;