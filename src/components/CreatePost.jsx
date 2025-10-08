import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/editPost.css'; 
import { createPost } from '@/services/postService';
import { usePostContext } from '@/hooks/usePostContext';


const CreatePost = () => {
  const navigate = useNavigate(); 

  const { dispatch } = usePostContext();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = { title, subtitle, content };
    console.log('[CreatePost] will send:', postData, 'API_BASE=', import.meta?.env?.VITE_API_BASE_URL);

    try {
      const newPost = await createPost(postData);
      dispatch({ type: 'CREATE_POST', payload: newPost });
      console.log('文章创建成功:', newPost);
      alert('文章发布成功！');
      navigate('/');
    } catch (err) {
      setError(`提交失败: ${err.message}`);
      console.error('提交文章失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="create-post-container">
      <h2>创建新文章</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">标题:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subtitle">副标题:</label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? '发布中...' : '发布文章'}
          </button>
          <button type="button" onClick={() => navigate('/')} disabled={loading}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;