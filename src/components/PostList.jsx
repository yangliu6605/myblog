import { Link } from 'react-router-dom';

function PostList({ post }) {
    // 格式化时间函数 - 显示年月日时分
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return date.toLocaleDateString('zh-CN', options);
    };

    return (
        <div className="post-list">
           <Link to={`/post/${post._id}`}>
            <h4>{post.title}</h4>
          </Link>
          <p>{post.subtitle}</p>
          <p>{post.author}</p>
          <p>{formatDate(post.createdAt)}</p>
        </div>   
    );
}

export default PostList;