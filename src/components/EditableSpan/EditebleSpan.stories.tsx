import {EditableSpan} from "./EditableSpan";
import {action} from "@storybook/addon-actions";

export default {
    title: 'EditableSpan component',
    component: EditableSpan,
}

const callback = action("Value changed")

export const EditableSpanBaseExample = () => {
    return (
        <EditableSpan
            value={'Start Value'}
            onChange={callback}/>
    )
}
