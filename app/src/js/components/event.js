import {EventEmitter} from 'events'

class MyEvents extends EventEmitter{}

const myEvents =  new MyEvents()
let ec = 1000
myEvents.names = {  //register names
  desktopReady:   ec+++'',
  to_taskbar_add_new_task:   ec+++'',
  to_task_items_add_new_task:    ec+++'',
  to_start_menu_loaded_data:    ec+++'',
  handle_task_items_onclick:    ec+++'',
}

export default myEvents
