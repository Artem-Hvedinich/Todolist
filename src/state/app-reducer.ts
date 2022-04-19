export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>
}
type StateType = typeof initialState
type AppReducerActionType = setAppStatusType | setAppErrorType

export const appReducer = (state: StateType = initialState, action: AppReducerActionType): StateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppError = (error: NullableType<string>) => ({type: 'APP/SET-ERROR', error} as const)

export type setAppStatusType = ReturnType<typeof setAppStatus>
export type setAppErrorType = ReturnType<typeof setAppError>

