import React, {Component} from 'react'
import ReactDOM from 'react-dom'

const registeredTasks= new Set([
  "i6oxuWOp", "i6oxuWOp0", "i6oxuWOp1", "i6oxuWOp2", "i6oxuWOp3", "i6oxuWOp4",
  "WLAN_W8kyt9KR2", "kugou_W8kyt9KR", "teamviewer_i6oxuWOp4", "wechat_W8kyt9KR", "wechat_W8kyt9KR0",
  "dundee_pEsnAYaw", "dundee_pEsnAYaw0"
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
class Task extends Component{
}

Task.systemTasks = systemTasks
Task.registeredTasks = registeredTasks
export default Task
