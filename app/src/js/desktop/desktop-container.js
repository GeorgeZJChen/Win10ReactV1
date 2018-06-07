import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Select from '../components/select.js'
import Items from './desktop-item.js'
import Windows from './window.js'

import css from '../../css/desktop/desktop-container.css'

class DesktopContainer extends Component{

  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className={css.desktopCt} ref='element'>
        <Select select={(x, y, sx, sy)=>this.refs.items.select(x, y, sx, sy)} container={this}
            deselect={()=>this.refs.items.deselect()} zIndex={104}/>
        <Items container={this} ref='items'/>
        <Windows container={this} ref='windows'/>
      </div>
    )
  }
}




export default DesktopContainer
