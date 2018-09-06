import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import Utils from '../components/Utils.js'
import Events from '../components/event.js'
import Select from '../components/select.js'
import Icon from '../components/icon.js'
import Task from '../system/task.js'

import css from '../../css/handler/DDNILX28W3.css'

class DDNILX28W3 {
  constructor(query, name){
    this.id = 'DDNILX28W3'

    System.addSystemTask(new Task({
      name: 'Read me',
      id: this.id,
      query: query,
      window: {
        width: 600,
        height: 430,
        windowIcon: {
          URL: 'static/img/icon/TXT.png'
        }
      },
      taskbarIcon: {
        URL: 'static/img/icon/TXT.png'
      },
      callback: (win)=>{
        win.onClose = ()=>{
          this.Txt.unmount()
        }
        ReactDOM.render(<Txt win={win} parent={this}/>, win.refs.content)
        win.load()
      }
    }))
  }
}
class Txt extends Component {
  constructor(props){
    super(props)
    this.state = {
      renderFlag: 0
    }
    this.items = []
    props.parent.Txt = this

  }
  unmount(){
    ReactDOM.unmountComponentAtNode(this.props.win.refs.content)
  }
  render(){
    return(
      <div className={css.txtContent} ref='element'>
        <p className={css.txtTxt}>This project is by CHEN ZHUOJUN. For more projects available see:</p>
        <p><a href={'https://georgezjchen.github.io/me/'} target="_blank" className={css.txtLink}>{'https://georgezjchen.github.io/me/'}</a></p>
      </div>
    )
  }
}



export default DDNILX28W3
