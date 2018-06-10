import axios from 'axios'
import Task from './task.js'
import Notification from './notification.js'

import Desktop from '../desktop/desktop.js'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class System {
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

      this.addSystemTasks()
      this.addInitialTasks()

    }} onReady={()=>{ready()}}/>, document.getElementById('win10_main'))


  }
  addTask(id, name){
    let _task = this.desktop.getTask(id)
    if(_task){
      this.desktop.evokeTask(id)
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
          this.desktop.addTask(task)
        } catch (e) {
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
      this.addTask(init_tasks[i])
    }
  }
  addSystemTask(task){
    if(!(task instanceof Task)) return
    if(this.desktop.getTask(task.id)){
      this.desktop.evokeTask(task.id)
    }else {
      this.desktop.addTask(task)
    }
  }
  addSystemTasks(){
    let system_tasks = Task.systemTasks
    for (let key in system_tasks) {
      this.desktop.addTask(new Task(system_tasks[key]))
    }
  }
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
