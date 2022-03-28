import AppWithRedux from "./AppWithRedux";
import {ReduxStoreProviderDecorator} from "../../stories/ReduxStoreProviderDecorator";

export default {
    title: 'AppWithRedux component',
    component: AppWithRedux,
    decorators:[ReduxStoreProviderDecorator]
}


export const AppWithReduxBaseExample = () => {
    return <AppWithRedux/>
}
