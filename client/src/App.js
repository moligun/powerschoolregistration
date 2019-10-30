import { observer, inject } from 'mobx-react';
import React from 'react';
import './App.css';
import UserPortal from './components/userportal'
import GuestPortal from './components/guestportal'
import AdminPortal from './components/adminportal'

function App(props) {
  if (props.authStore.isAdmin && props.editorStore.displayAdmin) {
    return (
      <AdminPortal />
    )
  }
  if (props.authStore.authorized) {
    return (
      <UserPortal />
    )
  } else {
    return (
      <GuestPortal />
    )
  }
}
export default inject(stores => ({
  authStore: stores.rootStore.authStore,
  editorStore: stores.rootStore.editorStore
}))(observer(App));
