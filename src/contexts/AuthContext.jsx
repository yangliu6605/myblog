import { createContext, useReducer, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, isLoading: false, error: null }
        case 'LOGOUT':
            return { user: null, isLoading: false, error: null }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false }
        default:
            return state
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null,
        isLoading: false,
        error: null
    })

    // 从 localStorage 恢复用户状态
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                dispatch({ type: 'LOGIN', payload: user })
            }
        } catch (error) {
            console.error('Failed to parse user from localStorage:', error)
            localStorage.removeItem('user') // 清除损坏的数据
        }
    }, [])

    // 登出函数
    const logout = useCallback(() => {
        localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })
    }, [])

    // 登录函数
    const login = useCallback((userData) => {
        localStorage.setItem('user', JSON.stringify(userData))
        dispatch({ type: 'LOGIN', payload: userData })
    }, [])

    // 设置加载状态
    const setLoading = useCallback((isLoading) => {
        dispatch({ type: 'SET_LOADING', payload: isLoading })
    }, [])

    // 设置错误状态
    const setError = useCallback((error) => {
        dispatch({ type: 'SET_ERROR', payload: error })
    }, [])

    console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value={{ 
            ...state, 
            dispatch, 
            login, 
            logout, 
            setLoading, 
            setError 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
