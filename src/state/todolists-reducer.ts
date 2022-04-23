import {Dispatch} from 'redux';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {RequestStatusType, setAppError, setAppStatus, setAppStatusType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: "todolists",
    initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        setTodolistAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            state[state.findIndex(tl => tl.id === action.payload.id)].entityStatus = action.payload.entityStatus
        }
    }
})
export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC, addTodolistAC, changeTodolistTitleAC,
    changeTodolistFilterAC, setTodolistAC, changeTodolistEntityStatusAC
} = slice.actions

//thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistAC({todolists: res.data}))
            dispatch(setAppStatus({status: 'succeeded'}))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistAC({id: todolistId}))
            dispatch(setAppStatus({status: 'succeeded'}))

        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.addTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatus({status: 'succeeded'}))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.changeTodolist(id, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC({id, title}))
            dispatch(setAppStatus({status: 'succeeded'}))
        })
}

//types
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type SetTodolistAT = ReturnType<typeof setTodolistAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
