import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();

  switch (req.method) {
    case 'GET':
      try {
        const result = await client.sql`
          SELECT id as _id, title, subtitle, content, created_at as "createdAt"
          FROM posts
          ORDER BY created_at DESC
        `;
        if(result.rows.length === 0) {
          return res.status(200).json([]);
        }
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { title, subtitle = '', content } = req.body;
        const result = await client.sql`
          INSERT INTO posts (title, subtitle, content)
          VALUES (${title}, ${subtitle}, ${content})
          RETURNING id as _id, title, subtitle, content, created_at as "createdAt"
        `;
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: '方法不允许' });
  }
}