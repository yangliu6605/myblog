// Vercel 会根据此文件的路径自动创建 API 路由。
// 当你部署项目后，此文件的访问路径将是 /api/auth/login。
// 完整的 URL 类似于 https://<你的 Vercel 项目名>.vercel.app/api/auth/login
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '所有的信息都需要填写' });
    }

    const client = await db.connect();

    // 查找用户
    const result = await client.sql`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (result.rows.length === 0) {
      return res.status(400).json({ error: '用户名不存在' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: '密码错误' });
    }

    res.json({ 
      message: '登录成功',
      user: { username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}