import { observer, inject } from 'mobx-react';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Tickets from './registration/components/ticketlist';
import Editor from './registration/components/editor';

function App(props) {
  if (!props.rootStore.authStore.authorized) {
    return (
        <React.Fragment>
            <Tickets />
            <Editor />
        </React.Fragment>
    );
  }
}

export default inject('rootStore')(observer(App));
