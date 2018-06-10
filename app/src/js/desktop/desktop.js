import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import Taskbar from './taskbar.js'
import StartMenu from './start-menu.js'
import DesktopContainer from './desktop-container.js'


import css from '../../css/desktop/desktop.css'

class Desktop extends Component{

  constructor(props){
    super(props)
    this.state = {
      imgURL: 'static/img/desktop_default.jpg',
      tasks: new Map()
    }
    this.wallpaperReady = 0
    this.startmenuReady = 0
    this.itemsReady = 0

    props.onConstruct(this)
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
  deselectItems(){
    this.refs.desktopCt.refs.items.deselect()
    this.refs.desktopCt.refs.items.blur()
  }

  componentDidMount() {

    this.windows = this.refs.desktopCt.refs.windows
    this.props.onLoad()

    const checkDesktopReady = ()=>{
      let ready = this.wallpaperReady *this.startmenuReady *this.itemsReady
      if(ready===1){
        this.props.onReady? this.props.onReady() : 1
        delete this.itemsReady
        delete this.wallpaperReady
        delete this.startmenuReady
      }else{
        setTimeout(checkDesktopReady, 200)
      }
    }
    setTimeout(checkDesktopReady, 200)
  }
  getTask(id){
    return this.state.tasks.get(id)
  }
  addTask(task){
    this.state.tasks.set(task.id, task)
    this.refs.taskbar.update(task)
  }
  shutDownTask(id){
    let task = this.state.tasks.get(id)
    if(task) task.end()
  }
  evokeTask(id){
    let task = this.state.tasks.get(id)
    if(task) task.evoke()
  }

  initiateStartmenu(data){
    this.refs.startMenu.init(data)
    this.startmenuReady = 1
  }

  initiateItems(data){
    this.refs.desktopCt.refs.items.init(data)
    this.itemsReady = 1
  }
}

export default Desktop
