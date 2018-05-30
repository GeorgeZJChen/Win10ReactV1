import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import {ItemsColumnOne, ItemsColumnTwo, ItemsColumnThree} from './start-menu-comps.js'
import Events from '../components/event.js'

import css from '../../css/desktop/start-menu.css'

import '../../css/system.css'

class StartMenu extends Component{
  constructor(props){
    super(props)
    this.state ={
      data: null
    }
  }
  componentDidMount() {
    Events.once(Events.names.to_start_menu_loaded_data, (data)=>{
      this.setState({
        data: data
      })
    })
  }
  render(){
    return(
      <div className={css.startMenu}>
        <input className={css.columnSwitch+' '+css.switch1} type='radio' name={'HydAxYn8'} defaultChecked/>
        <div className={css.switchResponser}></div>
        <input className={css.columnSwitch+' '+css.switch2} type='radio' name={'HydAxYn8'}/>
        <div className={css.switchResponser}></div>
      {
        this.state.data?
        ( <React.Fragment>
            <ItemsColumnOne/>
            <ItemsColumnTwo appList = {this.state.data.appList}/>
            <ItemsColumnThree boxGroups = {this.state.data.boxGroups}/>
          </React.Fragment>  ):''
      }
      </div>
    )
  }
}

export default StartMenu
