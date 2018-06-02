import React from 'react';
import {render} from 'react-dom';
import Login from './js/login/login.js';

import './js/components/event-handler.js'

setTimeout(function functionName() {
  render(<Login parentId='win10_login'/>, document.getElementById('win10_login'));
}, 500)


// import Desktop from './js/desktop/desktop.js'
// render(<div></div>, document.getElementById('win10_login'))
// render(<Desktop/>, document.getElementById('win10_main'))



window.onload=function () {
        document.addEventListener('touchstart',function (e) {
          e.preventDefault()
        })
        var lastTouchEnd=0;
        document.addEventListener('touchend',function (e) {
          e.preventDefault()
        })
        document.addEventListener('touchmove', function(e){
          e.preventDefault()
        })
    }




































console.log('Copyright (c) 2018 Zhuojun Chen. All Rights Reserved.');
