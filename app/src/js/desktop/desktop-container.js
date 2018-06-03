import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import Loader from '../components/loader.js'
import Events from '../components/event.js'
import Select from '../components/select.js'

import Items from './desktop-item.js'

import css from '../../css/desktop/desktop-container.css'

class DesktopContainer extends Component{

  constructor(props){
    super(props)
    this.state = {

    }

  }
  componentDidMount(){
    setTimeout(()=>{
      this.refs.items.init()

    },50)
  }

  render(){
    return (
      <div className={css.desktopCt} ref='element'>
        <Select select={(x, y, sx, sy)=>this.refs.items.select(x, y, sx, sy)}
            deselect={()=>this.refs.items.deselect()}/>
        <Items container={this} ref='items'/>
        <Windows />
      </div>
    )
  }
}


class Windows extends Component {

  render(){
    return ''
  }
}



export default DesktopContainer
