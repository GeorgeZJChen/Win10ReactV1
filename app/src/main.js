import React from 'react';
import {render} from 'react-dom';
import Login from './js/login/login.js';

import './js/components/event-handler.js'

// setTimeout(function functionName() {
//   render(<Login parentId='win10_login'/>, document.getElementById('win10_login'));
// }, 500)


import Desktop from './js/desktop/desktop.js'
render(<div></div>, document.getElementById('win10_login'))
render(<Desktop/>, document.getElementById('win10_main'))



window.onload=function () {
        // document.addEventListener('touchstart',function (event) {
        //     if(event.touches.length>1){
        //         event.preventDefault();
        //     }
        // })
        // var lastTouchEnd=0;
        // document.addEventListener('touchend',function (event) {
        //     var now=(new Date()).getTime();
        //     if(now-lastTouchEnd<=300){
        //         event.preventDefault();
        //     }
        //     lastTouchEnd=now;
        // },false)
        // document.addEventListener('touchmove', function(e){
        //   e.preventDefault()
        // }, {passive: false})
    }




































console.log('Copyright (c) 2018 Zhuojun Chen. All Rights Reserved.');
