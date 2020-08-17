import { observer, inject } from 'mobx-react';
import React from 'react';
import './App.css';

function Login(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand">
        <img className="brand-image" src="/static/images/lsc_brand.png" alt="Lafayette School Corporation logo" />
        LSC Student Registration
      </span>
    </nav>
  )
}
export default inject(stores => ({
}))(observer(Login));
