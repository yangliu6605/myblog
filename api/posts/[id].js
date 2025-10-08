// 这是一个动态 API 路由。
// 文件名中的 `[id]` 是一个动态参数，它会被实际的文章 ID 替换。
// 访问此接口的路径会是 /api/posts/<文章ID>，例如 /api/posts/123。
// 完整的 URL 类似于 https://<你的 Vercel 项目名>.vercel.app/api/posts/123
import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();
  const { id } = req.query;

  switch (req.method) {
    // 获取单篇文章
    case 'GET':
      try {
        const result = await client.sql`
          SELECT id as _id, title, subtitle, content, created_at as "createdAt"
          FROM posts
          WHERE id = ${id}
        `;
        if (result.rows.length === 0) {
          return res.status(404).json({ error: '文章未找到' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    // 更新文章
    case 'PUT':
      try {
        const { title, subtitle, content } = req.body;
        const result = await client.sql`
          UPDATE posts 
          SET title = ${title}, subtitle = ${subtitle}, content = ${content} 
          WHERE id = ${id}
          RETURNING id as _id, title, subtitle, content, created_at as "createdAt"
        `;
        if (result.rows.length === 0) {
          return res.status(404).json({ error: '文章未找到' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    // 删除文章
    case 'DELETE':
      try {
        const result = await client.sql`
          DELETE FROM posts WHERE id = ${id}
          RETURNING id as _id
        `;
        if (result.rows.length === 0) {
          return res.status(404).json({ error: '文章未找到' });
        }
        res.status(200).json({ message: '文章删除成功', deletedPost: result.rows[0] });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: '方法不允许' });
  }
}