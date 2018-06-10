import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

const registeredTasks= new Set([
  "i6oxuWOp0", "i6oxuWOp1", "i6oxuWOp2", "i6oxuWOp3", "i6oxuWOp4",
  "WLAN_W8kyt9KR2", "kugou_W8kyt9KR", "teamviewer_i6oxuWOp4", "wechat_W8kyt9KR", "wechat_W8kyt9KR0",
  "dundee_pEsnAYaw", "NQ3NR3XKV3FV", "chromeQPPY2SEKS479", "LJ6OVRV8MJ2Z", "atom_OIOWFV4XMLYB"
])
const systemTasks = {
  // "resource_manager": {
  //   id: "resource_manager",
  //   name: "Resource Manager",
  //   isTaskbarTask: 1,
  //   taskbarIcon: {className:"resource-manager"}
  // }
}
class Task {
  constructor(data){
    if(!data.id || !data.name) throw new Error()
    this.id = data.id
    this.name = data.name
    this.callback = data.callback
    if(data.isBackgroundTask){
      this.backgroundIcon = {}
      let b = this.backgroundIcon
      let d = data.backgroundIcon || {}
      b.className = d.className || 'unknown bg'
      b.URL = d.URL || null
      b.hidden = d.hidden || 0
    }
    if(data.window){

      this.taskbarIcon = {}
      let t = this.taskbarIcon
      let d = data.taskbarIcon
      if(d){
        t.className = d.className || 'unknown'
        t.URL = d.URL || null
      }else{
        t.className = 'unknown'
        t.URL = null
      }

      this.win = {}
      let w = this.win
      let dw = data.window
      w.backgroundColor = dw.backgroundColor || ''
      w.backgroundColor2 = dw.backgroundColor2 || ''
      w.color = dw.color || ''
      w.color2 = dw.color2 || ''
      w.maximisable = dw.maximisable===0?0:1
      w.minimisable = dw.minimisable===0?0:1
      w.resizable = dw.resizable===0?0:1
      w.width = dw.width || 600
      w.height = dw.height || 400
      w.center = dw.center || 0

      if(dw.windowIcon){
        w.windowIcon = {}
        let d = dw.windowIcon || {}
        w.windowIcon.className = d.className || 'unknown bg'
        w.windowIcon.URL = d.URL || null
      }
    }
  }
  evoke(){
    if(this.win){
      System.desktop.windows.get(this.id).select()
    }
  }
  end(){
    System.desktop.state.tasks.delete(this.id)
    System.desktop.refs.taskbar.update(this)
    if(this.win){
      let win = System.desktop.windows.get(this.id)
      if(win) win.close()
    }

  }
}

Task.systemTasks = systemTasks
Task.registeredTasks = registeredTasks
export default Task
