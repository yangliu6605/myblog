import { createContext, useReducer} from "react";

export const PostContext = createContext();

export const postsReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_POSTS':
        return {
            ...state,
            posts: action.payload,
        };
        case 'CREATE_POST':
            return {
                ...state,
                posts: [...state.posts, action.payload],
            };
        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map(post => post._id === action.payload._id ? action.payload : post),
            };
        case 'DELETE_POST':
            return {
                ...state,   
                posts: state.posts.filter(post => post._id !== action.payload._id),
            };
        default:
            return state;
    }
}

export const PostContextProvider = ({children}) => {
    const [posts, dispatch] = useReducer(postsReducer, {
        posts: []
    });


    return (
        <PostContext.Provider value={{...posts, dispatch}}>
            {children}
        </PostContext.Provider>
    )
}

