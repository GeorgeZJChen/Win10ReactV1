import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Events from '../components/event.js'
import Icon from '../components/icon.js'

import css from '../../css/desktop/window.css'

class Windows extends Component {

  constructor(props){
    super(props)
    this.state = {
      wins: new Set(),
      winsData: new Set(),
      renderFlag: 1
    }
    this.add = this.add.bind(this)
    setTimeout(()=>{
      Events.emit(Events.names.to_windows_add_window, {
        name: 'New window 1',
        id: 'id_1',
        icon: {className: 'folder sm'}
      })
    },1000)
  }
  componentDidMount(){
    Events.on(Events.names.to_windows_add_window, this.add)
  }
  componentWillUnmount(){
    Events.removeListener(Events.names.to_windows_add_window, this.add)
  }
  add(data){
    this.state.winsData.add(data)
    this.setState((prevState)=>{
      return { renderFlag: ~prevState.renderFlag }
    })
  }
  remove(win){
    this.state.wins.delete(win)
    this.state.winsData.delete(win.props.data)
    this.setState((prevState)=>{
      return { renderFlag: ~prevState.renderFlag }
    })
  }

  render(){
    return (
      <div className={css.windowCt} ref='element'>
        {
          (()=>{
            const arr = []
            this.state.winsData.forEach((data)=>{
              arr.push(<Win data={data} key={data.id} parent={this} container={this.props.container}/>)
            })
            return arr
          })()
        }
      </div>
    )
  }
}

class Win extends Component{
  constructor(props){
    super(props)
    this.state ={
      color: this.props.data.color || ''
    }
    this.btnGroup = props.data.btnGroup || [1, 1, 1]
    this.id = props.data.id


    this.close = this.close.bind(this)
    this.minimise = this.minimise.bind(this)
    this.maximum = this.maximise.bind(this)

    console.log('new');
  }
  componentDidMount() {
    this.setStyle({
      visibility: "visible"
    })
    this.select()
    console.log('mount');
  }
  render(){
    return(
      <div className={css.window} ref='element'>
        <div className={css.label}>
          <div className={css.labelIcon}>
            {
              this.props.data.icon.URL?
              (
                [<img src={this.props.data.icon.URL} className={css.iconImg} key={0} onLoad={this.imgOnLoad} style={{display:this.state.imgReady?'':'none'}}/>,
                this.state.imgReady? '' : <Icon className={"unknown"} key={1}/>]
              )
              :
              <Icon className={this.props.data.icon.className}/>
            }
          </div>
          <div className={css.labelName} data-title={this.props.data.name}
            style={{marginRight:(this.btnGroup[0]*46+this.btnGroup[1]*46+this.btnGroup[2]*46+5)}}></div>
        </div>
        <div className={css.btnGroup}>
        {
          [
            this.btnGroup[0]?<div className={css.btn+' '+css.btnMinimise} onClick={this.minimise} key={'btn_1'}></div>:'',
            this.btnGroup[1]?<div className={css.btn+' '+css.btnMaximise} onClick={this.maximum} key={'btn_2'}></div>:'',
            this.btnGroup[2]?<div className={css.btn+' '+css.btnClose} onClick={this.close} key={'btn_3'}></div>:''
          ]
        }
        </div>
        <div className={css.content}></div>
        <div className={css.resize}>
          <div className={css.barL}></div>
          <div className={css.barT}></div>
          <div className={css.barR}></div>
          <div className={css.barB}></div>
          <div className={css.dotLT}></div>
          <div className={css.dotRT}></div>
          <div className={css.dotRB}></div>
          <div className={css.dotLB}></div>
        </div>
      </div>
    )
  }
  close(){
    this.props.parent.remove(this)
  }
  minimise(){

  }
  maximise(){

  }
  select(){
    this.setStyle({
      backgroundColor:  this.props.data.color,
      color:  this.props.data.color
    })
  }
  deselect(){

    this.setStyle({
      backgroundColor:  this.props.data.color2,
      color:  this.props.data.color2
    })
  }
  setStyle(style){
    for(var key in style){
      if(style[key]==undefined||style[key]==null)
      style[key] = ''
      this.refs.element.style[key] = style[key]
    }
  }

}

export default Windows
