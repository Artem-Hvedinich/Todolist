import {Dispatch} from 'redux';
import {ResponseType} from '../api/todolists-api';
import {setAppErrorType, setAppStatus, setAppStatusType} from '../state/app-reducer';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppError(error.message))
    dispatch(setAppStatus('failed'))
}

type ErrorUtilsDispatchType = Dispatch<setAppErrorType | setAppStatusType>

function setAppError(arg0: string): any {
    throw new Error('Function not implemented.');
}