import React, {useEffect} from 'react'
import './App.css';
import {TaskType} from './api/todolists-api'
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {Container, LinearProgress, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodolistList} from './features/Todolists/TodolistList';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import styled from "styled-components";
import {ErrorSnackbar} from "./components/ErrorSnackbar";
import {Routes, Route, Navigate, NavLink} from 'react-router-dom';
import {Login} from "./features/Login";
import {initializeAppTC, RequestStatusType} from "./state/app-reducer";
import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";
import {logoutTC} from "./state/auth-reducer";

const LinearProgressWrapper = styled(LinearProgress)`
  //top: 4rem;
  position: fixed;
  width: 100%`
const CircularProgressWrapper = styled(CircularProgress)`
  position: fixed;
  top: 35%;
  left: 50%`
const NavLinkWrapper = styled(NavLink)`
  text-decoration: none;
  color: white;
  margin-right: 2vw;
  padding: 5px;

  :hover {
    border-radius: 5px;
    background-color: rgba(22, 59, 166, 0.1);
  }`
const ToolbarWrapper = styled(Toolbar)`
  display: flex;
  justify-content: space-around;`

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const isInitialized = useSelector<AppRootStateType, boolean>(s => s.app.isInitialized)
    const status = useSelector<AppRootStateType, RequestStatusType>(s => s.app.status)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(s => s.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const onClickLogoutHandler = () => {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return <CircularProgressWrapper/>
    }
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <ToolbarWrapper>
                    <Typography variant="h6">
                        <NavLinkWrapper to={'/'}>Todo </NavLinkWrapper>
                    </Typography>
                    <div>
                        {isLoggedIn ? <Button onClick={onClickLogoutHandler} color={'inherit'}>Log out</Button> :
                            <NavLinkWrapper to={'/login'}>Login </NavLinkWrapper>}
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                    </div>
                </ToolbarWrapper>
            </AppBar>
            {status === 'loading' && <LinearProgressWrapper/>}
            <Container fixed>
                <Routes>
                    <Route path="/" element={<TodolistList demo={demo}/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path="*" element={<Navigate to={"/404"}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App;

