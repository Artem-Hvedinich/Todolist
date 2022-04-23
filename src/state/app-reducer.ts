import {Dispatch} from "redux";
import {authApi} from "../api/auth-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: NullableType<string> }>) {
            state.error = action.payload.error
        },
        setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const {setAppStatus, setAppError, setAppInitialized} = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authApi.me()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            return handleServerNetworkError(error, dispatch)
        })
        .finally(() => {
            dispatch(setAppInitialized({isInitialized: true}))
        })
}


//types
export type setAppStatusType = ReturnType<typeof setAppStatus>
export type setAppErrorType = ReturnType<typeof setAppError>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type NullableType<T> = null | T

