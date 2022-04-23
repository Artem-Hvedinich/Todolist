import {TasksStateType} from '../App';
import {
    TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType
} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {addTodolistAC, removeTodolistAC, setTodolistAC,} from "./todolists-reducer";
import {setAppStatus} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId].splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
        },
        setTaskAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(setTodolistAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
    },
})
export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, setTaskAC} = slice.actions

//thunks
export const fetchTasks = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTaskAC({tasks: res.data.items, todolistId}))
            dispatch(setAppStatus({status: 'succeeded'}))
        })
}
export const removeTaskTC = (id: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.deleteTask(todolistId, id)
        .then((res) => {
            dispatch(removeTaskAC({taskId: id, todolistId}))
            dispatch(setAppStatus({status: 'succeeded'}))
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.addTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatus({status: 'succeeded'}))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatus({status: 'loading'}))
        const task = getState().tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            ...domainModel
        }
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({taskId, model: domainModel, todolistId}))
                    dispatch(setAppStatus({status: 'succeeded'}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => handleServerNetworkError(error, dispatch))
    }

//types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}