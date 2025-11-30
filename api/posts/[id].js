// 这是一个动态 API 路由。
// 文件名中的 `[id]` 是一个动态参数，它会被实际的文章 ID 替换。
// 访问此接口的路径会是 /api/posts/<文章ID>，例如 /api/posts/123。
// 完整的 URL 类似于 https://<你的 Vercel 项目名>.vercel.app/api/posts/123
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 验证 JWT token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  let client;
  const { id } = req.query;

  // 验证 MongoDB ObjectId 格式
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: '无效的文章 ID' });
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('blog-db');
    const postsCollection = db.collection('posts');

    switch (req.method) {
      // 获取单篇文章
      case 'GET':
        try {
          const post = await postsCollection.findOne({ _id: new ObjectId(id) });
          
          if (!post) {
            return res.status(404).json({ error: '文章未找到' });
          }
          
          res.json({
            ...post,
            _id: post._id.toString()
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
        break;

      // 更新文章
      case 'PUT':
        // 验证用户身份
        const userForUpdate = verifyToken(req);
        if (!userForUpdate) {
          return res.status(401).json({ error: '未授权，请先登录' });
        }

        try {
          const { title, subtitle, content } = req.body;
          
          if (!title || !content) {
            return res.status(400).json({ error: '标题和内容不能为空' });
          }

          const result = await postsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
              $set: { 
                title, 
                subtitle, 
                content,
                updatedAt: new Date()
              } 
            },
            { returnDocument: 'after' }
          );

          if (!result.value) {
            return res.status(404).json({ error: '文章未找到' });
          }

          res.json({
            ...result.value,
            _id: result.value._id.toString()
          });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      // 删除文章
      case 'DELETE':
        // 验证用户身份
        const userForDelete = verifyToken(req);
        if (!userForDelete) {
          return res.status(401).json({ error: '未授权，请先登录' });
        }

        try {
          const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: '文章未找到' });
          }

          res.status(200).json({ 
            message: '文章删除成功', 
            deletedPost: { _id: id } 
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
        break;

      default:
        res.status(405).json({ error: '方法不允许' });
    }
  } catch (error) {
    console.error('Post API error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}