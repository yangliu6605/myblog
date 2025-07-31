import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

function PostList() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (loading) return <div className="loading">Loading posts...</div>;

    return (
        <div className="post-list">
           {posts.map((post) => (
               <div className="post-item" key={post._id}>
                   <Link to={`/post/${post._id}`}>
                       <h2>{post.title}</h2>
                   </Link>
                   <p>{post.subtitle}</p>
                   <p>{post.author}</p>
                   <p>{post.createdAt}</p>
               </div>
           ))}
        </div>
    );
}

export default PostList;