import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService'; 
import '../assets/editPost.css'; 
// import { AuthContext } from '../contexts/AuthContext';  

const EditPost = () => {
  const { id } = useParams(); // 从 URL 获取 ID
  const navigate = useNavigate(); 
  // const { backendUrl } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await getPostById(id);
        setTitle(fetchedPost.title);
        setSubtitle(fetchedPost.subtitle); 
        setContent(fetchedPost.content);
      } catch (err) {
        setError('加载文章失败，无法编辑。');
        console.error('获取文章失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = { title, subtitle, content };

    try {
      await updatePost(id, postData);
      alert('文章更新成功！');
      navigate('/');
    } catch (err) {
      setError(`更新失败: ${err.message}`);
      console.error('更新文章失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载文章信息...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-post-container">
      <h2 style={{textAlign: 'center'}}>编辑文章</h2>
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
            {loading ? '更新中...' : '更新文章'}
          </button>
          <button type="button" onClick={() => navigate('/')} disabled={loading}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;