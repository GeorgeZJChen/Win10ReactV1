import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import Loader from '../components/loader.js'
import Select from '../components/select.js'
import Events from '../components/event.js'

import css from '../../css/desktop/desktop-container.css'
import icon from '../../css/components/icon.css'

class DesktopContainer extends Component{

  constructor(props){
    super(props)
    this.state = {

    }

  }

  render(){
    return (
      <div className={css.desktopCt} onMouseDown={(e)=>this.onMouseDown(e)}>
        <Select returnSelf={(self)=>this.select=self} parent={this}/>
      </div>
    )
  }
  onMouseDown(e){
    
  }
}
export default DesktopContainer
