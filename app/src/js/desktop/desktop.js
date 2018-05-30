import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import Loader from '../components/loader.js'
import Events from '../components/event.js'
import Taskbar from './taskbar.js'
import Task from './task.js'
import './event-handler.js'
import StartMenu from './start-menu.js'

import css from '../../css/desktop/desktop.css'
import icon from '../../css/components/icon.css'
import '../../css/system.css'

class Desktop extends Component{

  constructor(props){
    super(props)
    this.state = {
      imgURL: 'static/img/desktop_default.jpg',
      pageReady: 0,
      imgReady: 0,
      tasks: []
    }
  }

  render(){
    return (
      <div className={css.desktop}>
        <img className={css.backgroundImg} src={this.state.imgURL} onLoad={()=>this.setState({imgReady:1})}/>
        <input id='start_menu_switch_X7VIV' type='checkbox' ref='start_menu_switch'/>
        <StartMenu/>
        <Taskbar tasks={this.state.tasks}/>
      </div>
    )
  }
  init(){
    this.addSystemTasks()

    this.loadStartMenuData()



    setTimeout(()=>{
      this.addTask('wechat_W8kyt9KR')
      this.addTask('wechat_W8kyt9KR0')
    }, 2000)

    setTimeout(()=>{
      this.addTask('dundee_pEsnAYaw0')
    }, 3000)

    setTimeout(()=>{
      this.addTask('dundee_pEsnAYaw')
    }, 4000)


    // TODO:
    //initial tasks
    let init_tasks = ['i6oxuWOp','i6oxuWOp0', 'i6oxuWOp1', 'i6oxuWOp2', 'i6oxuWOp3',
      'teamviewer_i6oxuWOp4', 'rOYGH6M8', "WLAN_W8kyt9KR2", "kugou_W8kyt9KR"]
    for (var i = 0; i < init_tasks.length; i++) {
      this.addTask(init_tasks[i])
    }
  }

  componentDidMount() {
    this.init()
    setTimeout(()=>{
      Events.emit(Events.names.desktopReady, 'Ready')
    }, 10)

  }
  addTask(name_id){
    if(Task.registeredTasks.has(name_id)){
      const url = 'static/data/tasks/'+name_id+'.json'
      axios({
        method: 'get',
        url: url,
        responseType: 'json'
      }).then((res)=>{
        try {
          if(!res.data) throw new Error()
          this.renderNewTask(res.data)
        } catch (e) {
          console.error('Data format error');
        }
      }).catch((err)=>{
        console.warn(err);
      })
    }
  }
  addSystemTasks(){
    let system_tasks = Task.systemTasks
    for (let key in system_tasks) {
      this.renderNewTask(system_tasks[key])
    }
  }
  renderNewTask(task){
    this.state.tasks.push(task)
    Events.emit(Events.names.to_taskbar_add_new_task, task)
  }
  loadStartMenuData(){
    const url = 'static/data/start-menu.json'
    axios({
      method: 'get',
      url: url,
      responseType: 'json'
    }).then((res)=>{
      try {
        if(!res.data) throw new Error()
        Events.emit(Events.names.to_start_menu_loaded_data, res.data)
      } catch (e) {
        console.error('Data format error');
      }
    }).catch((err)=>{
      console.warn(err);
    })
  }



}

export default Desktop
