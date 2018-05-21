import React from 'react';
import {render} from 'react-dom';
import Login from './js/login/login.js';

setTimeout(function functionName() {
  render(<Login parentId='win10_login'/>, document.getElementById('win10_login'));
}, 500)
