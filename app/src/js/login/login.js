import React, {Component} from 'react'

import css from '../../css/login/login.css';

class Login extends Component{
  transitionDelayFlag: 0;
  componentDidMount() {
    setTimeout(() =>{
      this.transitionDelayFlag = 1
    }, 100)
  };
  render() {
    return (
      <div className={[css.container, this.transitionDelayFlag?css.transition:''].join(' ')} id="login_container">
        <div className={css.greetings} id="login_greetings">
          Welcome
        </div>
        <div className='icon-loader' id={css.loader}>
          <div className='icon-loader-circle'></div>
          <div className='icon-loader-circle'></div>
          <div className='icon-loader-circle'></div>
          <div className='icon-loader-circle'></div>
          <div className='icon-loader-circle'></div>
        </div>
        <div className={css.button} id="login_button">
          Log in
        </div>
      </div>
    );
  }
}

export default Login
