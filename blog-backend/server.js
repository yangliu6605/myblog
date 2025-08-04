// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const app = express();
const PORT = process.env.PORT || 8000;

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/myblogdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => console.error('MongoDB 连接失败', err));



app.use(express.json()); // 允许 Express 解析 JSON 请求体

// 配置 CORS
app.use(cors({
  origin: 'http://localhost:5173', // 允许的前端地址
  credentials: true                // 如果需要携带 cookie
}));

app.use('/api/posts', postsRoutes);


app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});