import React, {Component} from 'react'
import ReactDOM from 'react-dom'

const registeredTasks= new Set([
  "i6oxuWOp", "i6oxuWOp0", "i6oxuWOp1", "i6oxuWOp2", "i6oxuWOp3", "i6oxuWOp4",
  "WLAN_W8kyt9KR2", "kugou_W8kyt9KR", "teamviewer_i6oxuWOp4", "wechat_W8kyt9KR", "wechat_W8kyt9KR0",
  "dundee_pEsnAYaw", "NQ3NR3XKV3FV"
])
const systemTasks = {
  "resource_manager": {
    id: "resource_manager",
    name: "Resource Manager",
    isBackgroundTask: 0,
    isTaskbarTask: 1,
    taskbarIcon: {className:"resource-manager"}
  }
}
class Task {
  constructor(data){
    if(!data.id || !data.name) throw new Error()
    this.id = data.id
    this.name = data.name
    if(data.isBackgroundTask){
      this.backgroundIcon = {}
      let b = this.backgroundIcon
      let d = data.backgroundIcon || {}
      b.className = d.className || 'unknown bg'
      b.URL = d.URL || null
      b.hidden = d.hidden || 0
    }
    if(data.isTaskbarTask){
      this.taskbarIcon = {}
      let t = this.taskbarIcon
      let d = data.taskbarIcon
      t.className = d.className || 'unknown'
      t.URL = d.URL || null
    }
    if(data.window){
      this.win = {}
      let w = this.win
      let dw = data.window
      w.backgroundColor = dw.backgroundColor || ''
      w.backgroundColor2 = dw.backgroundColor2 || ''
      w.color = dw.color || ''
      w.color2 = dw.color2 || ''
      w.btnGroup = dw.btnGroup || [1,1,1]
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
  end(){
    // TODO: 
  }
}

Task.systemTasks = systemTasks
Task.registeredTasks = registeredTasks
export default Task
