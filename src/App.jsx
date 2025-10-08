import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import PostContent from './components/PostContent';

const App = () => {

  return (
    <Router>
      <Navbar />
      <div className='pages'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostContent />} />
          <Route path="/edit-post/:id" element={<EditPost />} /> 
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;