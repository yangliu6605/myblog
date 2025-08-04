import '../assets/navbar.css';
import { Link } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
    // const { isLoggedIn, user } = useContext(AuthContext);

    return (
        <header>
            <nav className="navbar">
                <Link to="/"><h1>我的博客</h1></Link>
                <ul>
                            <Link to='/new-post'><li>发布文章</li></Link>
                            {/* <li className='nav-item'>{user.username}</li> */}
                    {/* {!isLoggedIn &&
                        <Link to='/login'><li className='nav-item'>登录</li></Link>
                    } */}
                </ul>   
            </nav>
            <hr style={{ border: "1px solid black", margin: "10px 0" }} />  
        </header>
    );
}

export default Navbar;