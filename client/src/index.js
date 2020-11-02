import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import LoginNav from './Login'
import * as serviceWorker from './serviceWorker'
import RootStore from './stores/rootstore'
import { Provider } from 'mobx-react'

ReactDOM.render(
    <Provider rootStore={RootStore}>
        <LoginNav />
    </Provider>, 
    document.getElementById('login-banner')
);

ReactDOM.render(
    <Provider rootStore={RootStore}>
        <App />
    </Provider>, 
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
