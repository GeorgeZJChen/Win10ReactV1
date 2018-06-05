import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Loader from '../components/loader.js'
import Events from '../components/event.js'
import Select from '../components/select.js'

import Items from './desktop-item.js'
import Windows from './window.js'

import css from '../../css/desktop/desktop-container.css'

class DesktopContainer extends Component{

  constructor(props){
    super(props)
    this.state = {

    }

  }
  componentDidMount(){
    Events.once(Events.names.to_desktop_items_loaded_data, (data)=>{
      setTimeout(()=>{
        this.refs.items.init(data)
      },50)
    })
  }

  render(){
    return (
      <div className={css.desktopCt} ref='element'>
        <Select select={(x, y, sx, sy)=>this.refs.items.select(x, y, sx, sy)}
            deselect={()=>this.refs.items.deselect()} zIndex={104}/>
        <Items container={this} ref='items'/>
        <Windows container={this}/>
      </div>
    )
  }
}




export default DesktopContainer
