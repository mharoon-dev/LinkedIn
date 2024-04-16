import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    article: [],
    loading: false,
    error: '',
}

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        getArticlePending: (state) => {
            state.loading = true
        },
        getArticleSuccess: (state, { payload }) => {
            state.article = payload
            state.loading = false
            state.error = ''
        },
        getArticleFailure: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
    },
})

const { actions, reducer } = articleSlice

export const { getArticlePending, getArticleSuccess, getArticleFailure } = actions

export default reducer
