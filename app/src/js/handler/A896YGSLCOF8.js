import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import Select from '../components/select.js'
import Icon from '../components/icon.js'
import Task from '../system/task.js'

import css from '../../css/handler/A896YGSLCOF8.css'

class A896YGSLCOF8 {
  constructor(query, name){
    this.id = 'A896YGSLCOF8'

    this.fileItems = []

    System.addSystemTask(new Task({
      name: name || 'File Explorer',
      id: this.id,
      query: query,
      window: {
        width: 600,
        height: 430,
        windowIcon: {
          className: "folder sm"
        }
      },
      taskbarIcon: {
        className: "folder task"
      },
      callback: (win)=>{
        win.onDrop = (items)=>{
          let i = 0
          items.forEach((item)=>{
            let data = item.props.data
            this.fileItems.push(data)
          })
          ReactDOM.render(<FileItems items={this.fileItems} win={win}/>, win.refs.content)
        }
        win.load()
      }
    }))
  }
}
class FileItems extends Component{
  constructor(props){
    super(props)
    this.selected = new Set()
    this.checked = null
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onClick = this.onClick.bind(this)
  }
  onMouseDown(){
  }
  onClick(){
  }
  getToSelectItemsCt(){
    return this.refs.items
  }
  select(){

  }
  deselect(){
    this.selected.forEach((item)=>{
      item.deselect()
    })
  }
  render(){
    if(this.refs.select&&this.refs.select.refs.element){
      setTimeout(()=>{
        this.refs.select.refs.element.style.height = this.refs.element.scrollHeight +'px'
      },50)
    }
    return(
      <div className={css.container} ref='element' onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}
        onClick={this.onClick}>
        <Select select={(x, y, sx, sy)=>this.select(x, y, sx, sy)} container={this}
        deselect={()=>this.deselect()} zIndex={104} ref='select'/>
        <div className={css.itemsCt} ref='items'>
          {
            this.props.items.map((data)=>{
              return <FileItem data={data} win={this.props.win} parent={this} key={''+Math.random()}/>
            })
          }
        </div>
      </div>
    )
  }
}
class FileItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      iconReady: 0
    }
    this.selected = 0
    this.iconOnload = this.iconOnload.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onClick = this.onClick.bind(this)
  }
  iconOnload(){
    this.setState({
      iconReady: 1
    })
  }
  onClick(){
    this.props.parent.refs.element.click()
  }
  onMouseDown(){
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window
    })
    this.props.parent.refs.element.dispatchEvent(event);

    if(!this.selected){
      this.props.parent.deselect()
    }
    this.select()
  }
  select(){
    if(!this.selected){
      this.refs.element.className += ' '+css.selected
      this.props.parent.selected.add(this)
      this.selected = 1
    }
  }
  deselect(){
    if(this.selected){
      let ele = this.refs.element
      ele.className = ele.className.replace(new RegExp(css.selected, 'g'), '')
      this.selected = 0
      this.props.parent.selected.delete(this)
    }
    this.uncheck()
  }
  check(){
    let lastChecked = this.props.parent.checked
    if(lastChecked==this) return
    if(lastChecked) lastChecked.uncheck()
    this.refs.input.checked = true
    this.props.parent.checked = this
    this.select()
  }
  uncheck(){
    this.refs.input.checked = false
    let lastChecked = this.props.parent.checked
    if(lastChecked!=this) return
    this.props.parent.checked = null
    this.deselect()
  }
  render(){
    const icon = this.props.data.icon
    return(
      <div className={css.fileItem} ref='element'
        onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}
        onClick={this.onClick}
        >
        <div className={css.fileIconCt}>
        {
          icon.URL?
          (
            <React.Fragment>
              <img src={icon.URL} className={css.iconImg}
              onLoad={this.iconOnload} style={{display:this.state.iconReady?'':'none'}}/>
              {this.state.iconReady? '' : <Icon className={"unknown"}/>}
            </React.Fragment>
          )
          :
          <Icon className={icon.className+' big'}/>
        }
        </div>
        <input name={this.props.win.wid+'files'} className={css.itemCheck} type="radio" ref='input'/>
        <div className={css.fileBg}></div>
        <div className={css.fileName} data-title={this.props.data.name}></div>
      </div>
    )
  }
}

export default A896YGSLCOF8