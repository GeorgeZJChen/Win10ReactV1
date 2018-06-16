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
      imgURL: 'static/img/desktop_default.jpg'
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
        <input id='start_menu_switch_X7VIV' type='checkbox' ref='start_menu_switch' onChange={()=>this.onChangeSmSwitch()}/>
        <StartMenu ref='startMenu'/>
        <Taskbar ref='taskbar'/>
        <DesktopContainer ref='desktopCt'/>
      </div>
    )
  }
  onChangeSmSwitch(){
    const startmenu = this.refs.startMenu.refs.element
    if(this.refs.start_menu_switch.checked){
      startmenu.style.display = 'flex'
      setTimeout(()=>{
        startmenu.setAttribute('style',
        ` height: 85%;
          visibility: visible;
          min-height: 400px;
          display: flex;
          opacity: 1;
          transition: height,opacity,visibility 0.5s,0.5s,0.5s;
          transition-timing-function: cubic-bezier(0, 1, 0, 1);`)
      },50)
    }else{
      startmenu.setAttribute('style', 'display: flex;')
      setTimeout(()=>{
        startmenu.removeAttribute('style')
      },300)
    }

  }
  closeStartMenu(){
    if(this.refs.start_menu_switch.checked == true)
      this.refs.start_menu_switch.click()
  }
  deselectItems(){
    this.refs.desktopCt.refs.items.deselect()
    this.refs.desktopCt.refs.items.blur()
  }

  componentDidMount() {

    this.windows = this.refs.desktopCt.refs.windows
    this.props.onLoad()

    const checkDesktopReady = ()=>{
      let ready = this.wallpaperReady *this.startmenuReady *this.itemsReady *this.taskbarReady
      if(ready===1){
        this.props.onReady? this.props.onReady() : 1
        delete this.itemsReady
        delete this.wallpaperReady
        delete this.startmenuReady
        delete this.taskbarReady
      }else{
        setTimeout(checkDesktopReady, 200)
      }
    }
    setTimeout(checkDesktopReady, 200)
  }

  initiateStartmenu(data){
    this.refs.startMenu.init(data)
    this.startmenuReady = 1
  }

  initiateItems(data){
    this.refs.desktopCt.refs.items.init(data)
    this.itemsReady = 1
  }

  initiateTaskbar(){
    this.refs.taskbar.init()
    this.taskbarReady = 1
  }
}

export default Desktop
