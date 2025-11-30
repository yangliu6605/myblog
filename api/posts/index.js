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
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let client;

  try {
    // 调试日志
    console.log('[API] Request method:', req.method);
    console.log('[API] MONGODB_URI exists:', !!uri);
    console.log('[API] Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('blog-db');
    const postsCollection = db.collection('posts');

    switch (req.method) {
      case 'GET':
        try {
          console.log('[API] Fetching posts...');
          const posts = await postsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
          
          console.log('[API] Found posts:', posts.length);
          
          // 将 _id 转换为字符串，处理日期格式
          const formattedPosts = posts.map(post => {
            const formatted = {
              ...post,
              _id: post._id.toString()
            };
            
            // 确保 createdAt 是标准格式
            if (post.createdAt) {
              formatted.createdAt = post.createdAt instanceof Date 
                ? post.createdAt.toISOString() 
                : new Date(post.createdAt).toISOString();
            }
            
            return formatted;
          });
          
          res.json(formattedPosts);
        } catch (error) {
          console.error('[API] GET error:', error);
          res.status(500).json({ error: error.message });
        }
        break;

      case 'POST':
        // 验证用户身份
        const user = verifyToken(req);
        if (!user) {
          return res.status(401).json({ error: '未授权，请先登录' });
        }

        try {
          const { title, subtitle = '', content } = req.body;
          
          if (!title || !content) {
            return res.status(400).json({ error: '标题和内容不能为空' });
          }

          const newPost = {
            title,
            subtitle,
            content,
            createdAt: new Date()
          };
          
          // 可选：添加作者信息
          if (user && user.username) {
            newPost.author = user.username;
          }

          const result = await postsCollection.insertOne(newPost);
          const createdPost = {
            ...newPost,
            _id: result.insertedId.toString()
          };

          res.status(201).json(createdPost);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      default:
        res.status(405).json({ error: '方法不允许' });
    }
  } catch (error) {
    console.error('Posts API error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}