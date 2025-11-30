import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import PostContent from './components/PostContent';
import { useAuthContext } from './hooks/useAuthContext';

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {

  return (
    <Router>
      <Navbar />
      <div className='pages'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/post/:id" element={<PostContent />} />
          <Route path="/edit-post/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } /> 
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;