import PostList from '../components/PostList';
import { useEffect, useState } from 'react';
import { usePostContext } from '../hooks/usePostContext';
import { getAllPosts } from '@/services/postService';


function Home() {

    const { posts, dispatch } = usePostContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const data = await getAllPosts();
            dispatch({ type: 'FETCH_POSTS', payload: data }); 
            setLoading(false);
            }
          catch (err) {
            setError('Failed to fetch posts. Please try again later.');
            console.error('Error fetching posts:', err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPosts();
      }, [dispatch]);
    
      if (error) return <div className="error">{error}</div>;
      if (loading) return <div className="loading">文章加载中</div>;

      if(posts.length > 0) {
        return (
          <div className="post-list">
            {posts.map((post) => (
              <PostList key={post._id} post={post} />
            ))}
          </div>
        );
      } else {
        return <div className="error">No posts found.</div>;
      }
}

export default Home;