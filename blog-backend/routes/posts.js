const express = require('express');
const router = express.Router(); 
const Post = require('../models/Post')

// 获取所有文章
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find(); // 直接查询所有文章
      res.json(posts); 
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // 创建新文章
  router.post('/', async (req, res) => {
    // 数据验证
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }

    const post = new Post({
      title: req.body.title,
      subtitle: req.body.subtitle || '', // 添加副标题字段
      content: req.body.content,
    });
  
    try {
      const newPost = await post.save(); // 保存新文章到数据库
      res.status(200).json(newPost); // 成功创建，返回状态码 201 和新文章数据
    } catch (err) {
      res.status(400).json({ message: err.message }); // 数据验证失败
    }
  }); 

// 获取单个文章
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 更新文章
router.put('/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.subtitle) updateData.subtitle = req.body.subtitle;
    if (req.body.content) updateData.content = req.body.content;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: '文章不存在' });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: '文章不存在' });
    }
    res.json({ message: '文章已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;