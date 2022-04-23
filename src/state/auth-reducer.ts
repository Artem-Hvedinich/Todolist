import {Dispatch} from 'redux'
import {setAppStatus} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {authApi, LoginParamsType} from "../api/auth-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {isLoggedIn: false}

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authApi.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(setIsLoggedInAC({value: true}))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => handleServerNetworkError(error, dispatch))
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
