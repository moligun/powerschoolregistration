import { observer, inject } from 'mobx-react';
import React from 'react';
import './App.css';
import GuestPortal from './components/guestportal'
import Loading from './components/loading'

function App(props) {
  if (props.authStore.loading && !props.authStore.userInfo) {
    return (
      <Loading />
    )
  } else if (props.authStore.authorized) {
    return (
      <GuestPortal />
    )
  } else {
    return (
      <p>Must access through Powerschool</p>
    )
  }
}
export default inject(stores => ({
  authStore: stores.rootStore.authStore
}))(observer(App));
