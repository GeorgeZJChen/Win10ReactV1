import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import css from '../../css/desktop/taskbar.css'
import icon from '../../css/components/icon.css'
import Iconjs from '../components/icon.js'
import '../../css/system.css'

class Taskbar extends Component{
  constructor(props){
    super(props)
    this.state = {
      test: 1
    }
  }
  componentDidMount() {

  }
  renderTasks(){
    return(
      <div className={css.tbTasks}>
        <div className={css.item+' '+css.itemTask}><span className={css.iconCt}>
          <Iconjs className="resource-manager"/>
        </span></div>
        <div className={css.item+' '+css.itemTask}><span className={css.iconCt}>
          <Iconjs className="unknown"/>
        </span></div>
        {/*<div className='item item-task' onclick='desktop.createWindow(this)' data-url='DOM/windows/Kugou.json'><span className='item-task-icon-ct'><span className='icon-kugou' id='item-task-kugou-span'></span></span></div>
        <div className='item item-task' onclick='desktop.createWindow(this)' data-url='DOM/windows/Atom.json'>
        <span className='item-task-icon-ct'>
        <span className='icon-atom' id='item-task-atom-span'>
        <span className='icon-atom-oval'></span>
        <span className='icon-atom-oval icon-atom-oval-1'></span>
        <span className='icon-atom-oval icon-atom-oval-2'></span>
        </span>
        </span>
        </div>
        <div className='item item-task' onclick='desktop.createWindow(this)' data-url='DOM/windows/WeChat.json'><span className='item-task-icon-ct'><span className='icon-task icon-WeChat coloured-WeChat'><span className='icon-WeChat-sub1'></span><span className='icon-WeChat-sub2'></span></span></span></div>
        */}
      </div>
    )
  }
  render(){
    return(
      <div className={css.taskbar}>
          <div className={css.tbLeft}>
            <div className={css.tbSys}>
              <div className={css.item+' '+css.itemMenu}>
                <span className={icon.startMenu+' '+css.iconStartMenu}></span>
              </div>
              <div className={css.item+' '+css.itemCortana}>
                <span className={icon.cortana}></span>
              </div>
            </div>
            <div style={{display:'flex',flex:1,position:'relative'}}>
              <input type='checkbox' className={css.item+' '+css.taskSwitch} defaultChecked/>
              <div className={css.item+' '+css.switchResponser}>
                <span className={icon.angle+' '+icon.up} style={{top:'50%',left:10}}></span>
              </div>
              {this.renderTasks()}
            </div>
          </div>
      </div>
    )
  }
}

export default Taskbar
