import {Dispatch} from "redux";
import {authApi} from "../api/auth-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}


export const appReducer = (state: StateType = initialState, action: AppReducerActionType): StateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppError = (error: NullableType<string>) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppInitialized = (isInitialized: boolean) => ({type: 'APP/SET-INITIALIZED', isInitialized} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authApi.me()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            return handleServerNetworkError(error, dispatch)
        })
        .finally(() => {
            dispatch(setAppInitialized(true))
        })
}

type StateType = typeof initialState

type AppReducerActionType = setAppStatusType | setAppErrorType | ReturnType<typeof setAppInitialized>
export type setAppStatusType = ReturnType<typeof setAppStatus>
export type setAppErrorType = ReturnType<typeof setAppError>

