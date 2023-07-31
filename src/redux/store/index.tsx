import { createSlice, configureStore } from '@reduxjs/toolkit'
const reducerFunc = (state={}, action:any) =>{

}

const store = configureStore({reducer: reducerFunc})

export default store