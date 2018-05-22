import {EventEmitter} from 'events'

class MyEvents extends EventEmitter{}

const myEvents =  new MyEvents()
let eventsCount = 1000

myEvents.names = {
  desktopReady:  eventsCount+++''
}

export default myEvents
