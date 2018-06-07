import {EventEmitter} from 'events'

class MyEvents extends EventEmitter{}

const myEvents =  new MyEvents()
let ec = 1000
myEvents.names = {  //register names
  being_dragged_items_onenter:    ec+++'',
  being_dragged_items_onleave:    ec+++'',
  being_dragged_items_ondrop:    ec+++'',
}

export default myEvents
