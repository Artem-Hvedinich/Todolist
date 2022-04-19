import React from 'react'
import './App.css';
import {TaskType} from './api/todolists-api'
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodolistList} from './features/Todolists/TodolistList';
import {useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import styled from "styled-components";
import {ErrorSnackbar} from "./components/ErrorSnackbar";

const LinearProgressWrapper = styled(LinearProgress)`
  top: 4rem;
  position: fixed;
  width: 100%`

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const status = useSelector<AppRootStateType>(s => s.app.status)
    console.log(status)
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todo
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgressWrapper/>}
            <Container fixed>
                <TodolistList/>
            </Container>
        </div>
    )
}

export default App;

