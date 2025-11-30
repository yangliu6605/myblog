import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  let client;

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '所有的信息都需要填写' });
    }

    // 连接 MongoDB
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('blog-db');
    const usersCollection = db.collection('users');

    // 查找用户
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: '用户名不存在' });
    }

    // 验证密码
    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(400).json({ error: '密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' } // token 7天后过期
    );

    res.json({ 
      message: '登录成功',
      user: { 
        username: user.username,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}