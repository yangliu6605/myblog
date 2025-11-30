import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import axios from 'axios'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { login: contextLogin } = useAuthContext()

  const login = async (username, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/auth/login', {
        username, 
        password
      })
      
      // API 返回的数据格式: { message: '登录成功', user: { username, token } }
      const userData = response.data.user

      // 使用 context 的 login 方法，保存用户信息和 token
      contextLogin(userData)

      // update loading state
      setIsLoading(false)
    }
    catch(error) {
      setIsLoading(false)
      if (error.response) {
        // 服务器响应了错误状态码
        setError(error.response.data.error || '登录失败')
      } else if (error.request) {
        // 请求已发出但没有收到响应
        setError('无法连接到服务器')
      } else {
        // 其他错误
        setError('登录过程中发生错误')
      }
      console.error(error);
    }
  }

  return { login, isLoading, error }
}