import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {
    addTodolistTC, changeTodolistFilterAC, changeTodolistTitleTC, fetchTodolistsTC,
    FilterValuesType, removeTodolistTC, TodolistDomainType
} from './state/todolists-reducer'
import {addTaskTC, removeTaskTC, updateTaskTC} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskStatuses, TaskType} from './api/todolists-api'
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {Button, Container, Grid, Paper, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch();

    const removeTask = useCallback((id: string, todolistId: string) => dispatch(removeTaskTC(id, todolistId)), [])
    const addTask = useCallback((title: string, todolistId: string) => dispatch(addTaskTC(title, todolistId)), [dispatch])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => dispatch(updateTaskTC(id, {status}, todolistId)), [])
    const changeTaskTitle = useCallback((id: string, title: string, todolistId: string) => dispatch(updateTaskTC(id, {title}, todolistId)), [])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => dispatch(changeTodolistFilterAC(todolistId, value)), [])
    const removeTodolist = useCallback((id: string) => dispatch(removeTodolistTC(id)), [])
    const changeTodolistTitle = useCallback((id: string, title: string) => dispatch(changeTodolistTitleTC(id, title)), [])
    const addTodolist = useCallback((title: string) => dispatch(addTodolistTC(title)), [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];

                            return <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
