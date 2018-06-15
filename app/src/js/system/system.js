import axios from 'axios'
import Task from './task.js'
import Notification from './notification.js'

import Desktop from '../desktop/desktop.js'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Login from '../login/login.js'

class System {
  constructor(){
    this.tasks = new Map()
    window.System = this
  }
  start(ready){
    ReactDOM.render(<Desktop id='aaaaa' onConstruct={(desktop)=>{

      this.desktop = desktop

    }} onLoad={()=>{

      this.loadStartMenu((data)=>{
        this.desktop.initiateStartmenu(data)
      }, (err)=>{
        new Notification().alert('Error occured when loading startmenu.\n'+err, 'System Errors')
        ready()
      })
      this.loadDesktopItems((data)=>{
        this.desktop.initiateItems(data)
      }, (err)=>{
        new Notification().alert('Error occured when loading desktop items.\n'+err, 'System Errors')
        ready()
      })
      // this.addSystemTasks()
      this.addInitialTasks()
      this.desktop.initiateTaskbar()

    }} onReady={()=>{ready()}}/>, document.getElementById('Z5E0SZIPPCO9'))

  }
  lock(){
    ReactDOM.render(<Login lock={1} parentId='XLSEFG7DE7ON'/>, document.getElementById('XLSEFG7DE7ON'))
  }
  getTask(id, query){
    query = query || ''
    let taskMap =  this.tasks.get(id)
    if(taskMap) return taskMap.get(query)
  }
  deleteTask(id, query){
    let taskMap =  this.tasks.get(id)
    if(taskMap) this.desktop.refs.taskbar.delete(taskMap.get(query))
    if(taskMap&&taskMap.size == 1){
      this.desktop.refs.taskbar.delete(taskMap.get(query))
      this.tasks.delete(id)
    }

  }
  shutDownTask(id, query){
    let task = this.getTask(id, query)
    if(task) task.end()
  }
  addTask(id, query ,name){
    let _task = this.getTask(id, query)
    if(_task){
      _task.evoke()
    }else if (Task.systemTasks.has(id)) {
      new Task[id](query, name)
    }
    else if(Task.registeredTasks.has(id)){
      const url = 'static/data/tasks/'+id+'.json'
      axios({
        method: 'get',
        url: url,
        responseType: 'json'
      }).then((res)=>{
        try {
          if(!res.data) throw new Error()
          if(name) res.data.name = name
          if(query) res.data.query = query
          const task = new Task(res.data)
          task.launch()
        } catch (e) {
          console.warn(e);
          console.error('Data format error');
        }
      }).catch((err)=>{
        console.warn(err);
      })
    } else {
      new Notification().alert('Cannot open '+(name?name:'id: \''+id+'\'')+'. The application is unregistered.')
    }
  }
  addInitialTasks(){
    let init_tasks = ['i6oxuWOp0', 'i6oxuWOp1', 'i6oxuWOp2', 'i6oxuWOp3',
      'teamviewer_i6oxuWOp4', "WLAN_W8kyt9KR2", "kugou_W8kyt9KR"]
    for (var i = 0; i < init_tasks.length; i++) {
      this.addTask(init_tasks[i], "__default__")
    }
  }
  addSystemTask(task){
    if(!(task instanceof Task)) return
    if(this.getTask(task.id, task.query)){
      task.evoke()
    }else {
      task.launch()
    }
  }
  // addSystemTasks(){
  //   let system_tasks = Task.systemTasks
  //   for (let key in system_tasks) {
  //     this.addSystemTask(new Task(system_tasks[key]))
  //   }
  // }
  loadStartMenu(cb, err){
    const url = 'static/data/start-menu.json'
    axios({
      method: 'get',
      url: url,
      responseType: 'json'
    }).then((res)=>{
      try {
        if(!res.data) throw new Error()
        cb(res.data)

      } catch (e) {
        if(err) err(e)
        else console.error('Data format error')
      }
    }).catch((e)=>{
      if(err) err(e)
      else console.error(e)
    })
  }
  loadDesktopItems(cb, err){
    const url = 'static/data/desktop-items.json'
    axios({
      method: 'get',
      url: url,
      responseType: 'json'
    }).then((res)=>{
      try {
        if(!res.data) throw new Error()
        cb(res.data)
      } catch (e) {
        if(err) err(e)
        else console.error('Data format error')
      }
    }).catch((e)=>{
      if(err) err(e)
      else console.error(e)
    })
  }

}
const _System = new System()
export default _System
