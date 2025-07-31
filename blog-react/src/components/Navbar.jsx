import '../assets/navbar.css';
import { Link } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
    // const { isLoggedIn, user } = useContext(AuthContext);

    return (
        <>
            <nav className="navbar">
                <Link to="/"><span className='navbar-brand'>我的博客</span></Link>
                <ul>
                            <Link to='/new-post'><li className='nav-item'>发布文章</li></Link>
                            {/* <li className='nav-item'>{user.username}</li> */}
                    {/* {!isLoggedIn &&
                        <Link to='/login'><li className='nav-item'>登录</li></Link>
                    } */}
                </ul>
            </nav>
            <hr style={{ border: "1px solid black", margin: "10px 0" }} />
        </>
    );
}

export default Navbar;