import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import Icon from '../components/icon.js'
import Task from './task.js'

import css from '../../css/system/notification.css'

let count = 3000

class Notification {
  constructor(){
    this.id = 'NI37RYT8KYJY'
  }
  alert(message, title){
    System.addSystemTask(new Task({
      name: title?title:'Alert',
      id: this.id,
      query: "alert" +count++,
      window: {
        width: 300,
        height: 120,
        resizable: 0,
        maximisable: 0,
        minimisable: 0,
        center: 1,
        color: '#333',
        backgroundColor: '#fff',
        backgroundColor2: '#fff',
      },
      callback: (win)=>{
        ReactDOM.render(<Alert win={win} message={message}/>, win.refs.content)
      }
    }))
  }
}

class Alert extends Component{

  constructor(props){
    super(props)
  }
  componentDidMount(){
    setTimeout(()=>{
      this.focus()
    }, 200)
    let messageHeight = this.refs.message.offsetHeight
    if(messageHeight<66) this.refs.message.style.height = 66+'px'
    this.props.win.height = Math.max(messageHeight,66)+35+29
    this.props.win.load()
  }
  ok(){
    this.props.win.close()
  }
  focus(e){
    this.refs.ok.style.outline=''
    this.refs.ok.focus()

  }
  render(){
    return(
      <div className={css.alertCt}>
        <div className={css.alertIcon}></div>
        <p className={css.alertMessage} ref='message'>{this.props.message}</p>
        <div className={css.alertFooter}>
          <button className={css.button} ref='ok' style={{outline:'2px solid rgb(0,120,215)'}}
            onClick={()=>this.ok()}>OK</button>
        </div>
      </div>
    )
  }
}

export default Notification
