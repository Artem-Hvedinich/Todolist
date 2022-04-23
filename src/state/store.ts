import {tasksReducer} from './tasks-reducer';
import {todolistsReducer} from './todolists-reducer';
import {combineReducers,} from 'redux';
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "./auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
})
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export type AppRootStateType = ReturnType<typeof rootReducer>
// @ts-ignore
window.store = store;
