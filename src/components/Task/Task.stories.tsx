import {Task} from "./Task";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Task component',
    component: Task,
}

const changeTaskStatusCallback = action('Status changed')
const changeTaskTitleCallback = action('Title changed')
const removeTaskCallback = action('Tack removed')

export const AddItemFormBaseExample = () => {
    return (
        <>
            <Task task={{id: '1', isDone: true, title: 'checkbox: true'}}
                  changeTaskStatus={changeTaskStatusCallback}
                  changeTaskTitle={changeTaskTitleCallback}
                  removeTask={removeTaskCallback}
                  todolistId={'todolistId1'}/>
            <Task task={{id: '2', isDone: false, title: 'checkbox: false'}}
                  changeTaskStatus={changeTaskStatusCallback}
                  changeTaskTitle={changeTaskTitleCallback}
                  removeTask={removeTaskCallback}
                  todolistId={'todolistId2'}/>
        </>
    )
}
