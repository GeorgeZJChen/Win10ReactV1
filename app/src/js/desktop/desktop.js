import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Loader from '../components/loader.js'
import Events from '../components/event.js'
import css from '../../css/desktop/desktop.css'
import icon from '../../css/icon.css'
import '../../css/system.css'

class Desktop extends Component{

  constructor(props){
    super(props)
    this.state = {
      imgURL: 'static/img/desktop_default.jpg',
      pageReady: 0,
      imgReady: 0
    }
  }

  componentDidMount() {
    setTimeout(()=>{
      Events.emit(Events.names.desktopReady, 'Ready')
    }, 1000)
  }

  render(){
    return (
      <div className={css.desktop}>
        <img className={css.backgroundImg} src={this.state.imgURL} onLoad={()=>this.setState({imgReady:1})}/>

      </div>
    )
  }

}

export default Desktop
