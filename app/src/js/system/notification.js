import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Icon from '../components/icon.js'
import Task from './task.js'

import css from '../../css/system/notification.css'

class Notification {
  constructor(){
    this.prefixId = 'NI37RYT8KYJY'
    this.alertCount = 0
  }
  alert(message){
    window.desktop.addSystemTask(new Task({
      name: 'Alert',
      id: 'sys_alert_'+(++this.alertCount)+'_YSZ6ZO0R',
      window: {
        width: 300,
        height: 120,
        resizable: 0,
        btnGroup: [0,0,1],
        center: 1,
        color: '#333',
        backgroundColor: '#fff',
        backgroundColor2: '#fff',
      }
    }), (win)=>{
      ReactDOM.render(<Alert win={win} message={message}/>, win.refs.content)
    })
  }
}

class Alert extends Component{

  constructor(props){
    super(props)
  }
  componentDidMount(){
    let messageHeight = this.refs.message.offsetHeight
    if(messageHeight<66) this.refs.message.style.height = 66+'px'
    this.props.win.height = Math.max(messageHeight,66)+35+29
    this.props.win.load()
  }
  ok(){
    this.props.win.close()
  }

  render(){
    return(
      <div className={css.alertCt}>
        <div className={css.alertIcon}></div>
        <p className={css.alertMessage} ref='message'>{this.props.message}</p>
        <div className={css.alertFooter}>
          <div className={css.button} onClick={()=>this.ok()}>OK</div>
        </div>
      </div>
    )
  }
}

export default Notification
