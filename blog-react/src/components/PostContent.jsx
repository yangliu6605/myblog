import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../services/postService';

const PostContent = () => {
  const { id } = useParams();
  // const { backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('文章 ID 缺失，无法加载。');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // 根据 ID 调用后端 API 获取单篇文章的完整数据
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (err) {
        setError('加载文章失败，文章可能不存在或发生错误。');
        console.error('获取单篇文章失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // 依赖项是 id，当 id 变化时重新请求数据

  const handleClick = () => {
    navigate(`/edit-post/${id}`);
  }

  if (loading) {
    return <div className="detail-page-loading">文章加载中...</div>;
  }

  if (error) {
    return <div className="detail-page-error">{error}</div>;
  }

  if (!post) {
    return <div className="detail-page-not-found">未找到该文章。</div>;
  }

  return (
    <div className="post-detail-container">
      <h1 className="post-detail-title">{post.title}</h1>
      <p className="post-detail-date">
        发布于: {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="post-detail-content">
        <p>{post.content}</p>
      </div>
      <button onClick={handleClick}>编辑</button>
    </div>
  );
};


export default PostContent;