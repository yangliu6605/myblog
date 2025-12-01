import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost } from '../services/postService'; 
import { usePostContext } from '../hooks/usePostContext'; // 导入 PostContext
import { useAuthContext } from '../hooks/useAuthContext'; // 导入 AuthContext

const PostContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = usePostContext();
  const { user } = useAuthContext(); // 获取用户登录状态

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

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  }

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这篇文章吗？')) {
      return;
    }
    try {
      const result = await deletePost(id);
      dispatch({ type: 'DELETE_POST', payload: { _id: id } });
      alert(result.message);
      navigate('/');
    } catch (err) {
      setError('删除失败: ' + err.message);
    }
  };

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
      <h4>{post.title}</h4>
      <p className="post-detail-date">
        发布于: {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="post-detail-content">
        <p>{post.content}</p>
      </div>
      {/* 只有登录用户才能看到编辑和删除按钮 */}
      {user && (
        <div className="post-detail-buttons">
          <button onClick={handleEdit}>编辑</button>
          <button onClick={handleDelete}>删除</button>
        </div>
      )}
    </div>
  );
};

export default PostContent;