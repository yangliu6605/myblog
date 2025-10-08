import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import validator from 'validator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { username, password } = req.body;

    // 验证
    if (!username || !password) {
      return res.status(400).json({ error: '所有的信息都需要填写' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: '密码不够强' });
    }

    const client = await db.connect();

    // 检查用户是否存在
    const existingUser = await client.sql`
      SELECT username FROM users WHERE username = ${username}
    `;

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 创建用户
    await client.sql`
      INSERT INTO users (username, password) 
      VALUES (${username}, ${hash})
    `;

    res.status(201).json({ 
      message: '用户注册成功',
      user: { username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}