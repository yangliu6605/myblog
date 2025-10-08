import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/posts`);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE}/api/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching post with id ${id}:`, error);
        throw error;
    }
};

// 创建文章
export const createPost = async (postData) => {
    try{
        const newPost = {
        title: postData.title,
        subtitle: postData.subtitle || '', // 如果没有副标题，可以为空
        content: postData.content,
        createdAt: new Date().toISOString().split('T')[0], // 当前日期
    };
        const response = await axios.post(`${API_BASE}/api/posts`, newPost);
        console.log('Post created successfully:', response.data);
        return response.data; // 返回创建的文章数据
    }catch(error) {
        console.error('Error creating post:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
};

// 更新文章
export const updatePost = async (id, postData) => {
    try {
        const response = await axios.put(`${API_BASE}/api/posts/${id}`, postData);
        return response.data; // 返回更新后的文章数据
    } catch (error) {
        console.error(`Error updating post with id ${id}:`, error);
        throw error;
    }
};

// 删除文章
export const deletePost = async(id) => {
    const response = await axios.delete(`${API_BASE}/api/posts/${id}`);
    return response.data;
}