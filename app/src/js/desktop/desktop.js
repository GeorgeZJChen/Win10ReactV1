import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import Taskbar from './taskbar.js'
import Task from '../system/task.js'
import StartMenu from './start-menu.js'
import DesktopContainer from './desktop-container.js'

import Notification from '../system/notification.js'

import css from '../../css/desktop/desktop.css'

class Desktop extends Component{

  constructor(props){
    super(props)
    this.state = {
      imgURL: 'static/img/desktop_default.jpg',
      tasks: new Map()
    }
    this.wallpaperReady = 0

    window.desktop = this
  }

  render(){
    return (
      <div className={css.desktop}>
        <img className={css.wallpaper} src={this.state.imgURL} onLoad={()=>this.wallpaperReady=1}/>
        <input id='start_menu_switch_X7VIV' type='checkbox' ref='start_menu_switch'/>
        <StartMenu ref='startMenu'/>
        <Taskbar ref='taskbar'/>
        <DesktopContainer ref='desktopCt'/>
      </div>
    )
  }
  closeStartMenu(){
    this.refs.start_menu_switch.checked = false
  }
  init(){
    this.windows = this.refs.desktopCt.refs.windows

    this.addSystemTasks()

    this.loadStartMenu()
    this.loadDesktopItems()

    // setTimeout(()=>{
    //   this.addTask('wechat_W8kyt9KR')
    //   this.addTask('wechat_W8kyt9KR0')
    // }, 2000)
    //

    //
    // setTimeout(()=>{
    //   this.addTask('dundee_pEsnAYaw')
    // }, 4000)


    // TODO:
    //initial tasks
    let init_tasks = ['i6oxuWOp','i6oxuWOp0', 'i6oxuWOp1', 'i6oxuWOp2', 'i6oxuWOp3',
      'teamviewer_i6oxuWOp4', "WLAN_W8kyt9KR2", "kugou_W8kyt9KR"]
    for (var i = 0; i < init_tasks.length; i++) {
      this.addTask(init_tasks[i])
    }
  }

  componentDidMount() {
    this.init()

    const checkImagesReady = ()=>{
      if(this.wallpaperReady){
        if(this.props.login) this.props.login.unmount()
      }else{
        setTimeout(checkImagesReady, 200)
      }
    }
    setTimeout(checkImagesReady, 200)
  }
  addTask(id, name){
    let task = this.state.tasks.get(id)
    if(task){
      this.evokeTask(task)
      return
    }
    if(Task.registeredTasks.has(id)){
      const url = 'static/data/tasks/'+id+'.json'
      axios({
        method: 'get',
        url: url,
        responseType: 'json'
      }).then((res)=>{
        try {
          if(!res.data) throw new Error()
          const task = new Task(res.data)
          this._addTask(task)
        } catch (e) {
          console.error('Data format error');
        }
      }).catch((err)=>{
        console.warn(err);
      })
    } else {
      new Notification().alert('Cannot open '+name+'. The application is unregistered.')
    }
  }
  addSystemTask(task, cb){
    if(!(task instanceof Task)) return
    if(this.state.tasks.get(task.id)){
      this.evokeTask(task.id)
    }else {
      this._addTask(task, cb)
    }
  }
  addSystemTasks(){
    let system_tasks = Task.systemTasks
    for (let key in system_tasks) {
      this._addTask(system_tasks[key])
    }
  }
  _addTask(task, cb){
    this.state.tasks.set(task.id, task)
    this.refs.taskbar.update(task)
    if(task.win){
      this.refs.desktopCt.refs.windows.add(task, cb)
    }
  }
  shutDownTask(id){
    let task = this.state.tasks.get(id)
    if(task){
      this.state.tasks.delete(id)
      task.end()
      this.refs.taskbar.update(task)
    }
  }
  evokeTask(id){
    if(this.state.tasks.has(id)&&this.state.tasks.get(id).win)
      this.refs.desktopCt.refs.windows.evoke(id)
  }
  loadStartMenu(){
    const url = 'static/data/start-menu.json'
    axios({
      method: 'get',
      url: url,
      responseType: 'json'
    }).then((res)=>{
      try {
        if(!res.data) throw new Error()
        this.refs.startMenu.init(res.data)
      } catch (e) {
        console.error('Data format error');
      }
    }).catch((err)=>{
      console.warn(err);
    })
  }
  loadDesktopItems(){
    const url = 'static/data/desktop-items.json'
    axios({
      method: 'get',
      url: url,
      responseType: 'json'
    }).then((res)=>{
      try {
        if(!res.data) throw new Error()
        this.refs.desktopCt.refs.items.init(res.data)
      } catch (e) {
        console.error('Data format error');
      }
    }).catch((err)=>{
      console.warn(err);
    })
  }



}

export default Desktop
