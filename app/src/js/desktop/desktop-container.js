import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Select from '../components/select.js'
import Items from './desktop-item.js'
import Windows from './window.js'

import System from '../system/system.js'

import css from '../../css/desktop/desktop-container.css'

class DesktopContainer extends Component{

  constructor(props){
    super(props)
  }
  onMouseDown(){
    System.desktop.closeStartMenu()
  }
  getToSelectItemsCt(){
    return this.refs.items.refs.element
  }
  render(){
    return (
      <div className={css.desktopCt} ref='element'
        onMouseDown={()=>this.onMouseDown()} onTouchStart={()=>this.onMouseDown()}>
        <Select select={(x, y, sx, sy)=>this.refs.items.select(x, y, sx, sy)} container={this}
            deselect={()=>this.refs.items.deselect()} zIndex={104}/>
        <Items container={this} ref='items'/>
        <Windows container={this} ref='windows'/>
      </div>
    )
  }
}




export default DesktopContainer
