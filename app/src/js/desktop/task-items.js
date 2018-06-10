import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'
import Icon from '../components/icon.js'
import css from '../../css/desktop/taskbar.css'


class TaskItems extends Component{
  constructor(props){
    super(props)
    this.state = {
      renderFlag: 1
    }

  }
  update(){
    this.setState((prevState)=>{
      return {renderFlag: ~prevState.renderFlag}
    })
  }
  render(){
    return(
      <React.Fragment>
        {
          (()=>{
            const arr = []
            System.desktop.state.tasks.forEach((task)=>{
              if(this.props.type == 0){ //render on taskbar
                if(task.taskbarIcon){
                  arr.push(<WindowItem key={task.id} task={task}/>)
                }
              } else {  //render background task
                if (task.backgroundIcon) {
                  let t = this.props.type
                  let d = task.backgroundIcon.hidden
                  if((t==1&&d==0)||(d==1&&t!=1)) return
                  arr.push( <BackgroundItem key={task.id} data={task} type={this.props.type}/>)
                }
              }
            })
            return arr
          })()
        }
      </React.Fragment>
    )
  }
}
class WindowItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      imgReady: 0
    }
    this.imgStyle ={
      width: 'auto',
      height: '70%',
      position: 'relative',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'block',
      pointerEvents: 'none'
    }
    this.imgStyleNotReady = {
      display: 'none'
    }
    this.id = props.task.id
    this.selected = 0
  }
  componentDidMount(){
    System.desktop.refs.taskbar.state.windowTasks.set(this.id, this)
    System.desktop.windows.add(this.props.task)
  }
  componentWillUnmount(){
    System.desktop.refs.taskbar.state.windowTasks.delete(this.id)
  }
  select(){
    if(this.selected){
      if(this.__mousedown_while_window_minimised__) {
        delete this.__mousedown_while_window_minimised__
        return
      }
      let win = System.desktop.windows.get(this.id)
      if(win.minimisable&&!win.minimised){
        win.minimise()
        this.deselect()
      }else{
        win.select()
      }
    }else{
      System.desktop.refs.taskbar.state.windowTasks.forEach((item)=>{
        if(item!=this) item.deselect()
      })
      this.refs.element.className += ' '+css.selected
      this.selected = 1
      System.desktop.windows.get(this.id).select()
    }
  }
  deselect(){
    if(this.__mousedown_while_window_selected__) {
      delete this.__mousedown_while_window_selected__
      return
    }
    if(this.selected){
      this.refs.element.className = this.refs.element.className.replace(new RegExp(' '+css.selected,'g'),'')
      this.selected = 0
      let win = System.desktop.windows.get(this.id)
      if(win) win.deselect()
    }
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  onclick(e){
    this.select()
  }
  onMouseDown(){
    if(System.desktop.windows.get(this.id).selected)
      this.__mousedown_while_window_selected__ = 1
    if(System.desktop.windows.get(this.id).minimised)
      this.__mousedown_while_window_minimised__ = 1
  }
  render(){
    const icon = this.props.task.taskbarIcon
    return (
      <div className={css.item+' '+css.itemTask} ref='element'
        onClick={(e)=>this.onclick(e)}><span className={css.iconCt}
        onMouseDown={(e)=>this.onMouseDown(e)} onTouchStart={(e)=>this.onMouseDown(e)}
        >
          {
            icon.URL?
              <React.Fragment>
                <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady} src={icon.URL} onLoad={()=>{this.imgOnload()}}/>
                {this.state.imgReady? '':<Icon className={'unknown'}/>}
              </React.Fragment>
              :
              <Icon className={icon.className}/>
          }
      </span></div>
    )
  }
}
class BackgroundItem extends Component{
  constructor(props){
    super(props)
    this.index = props.index
    this.state = {
      imgReady: 0
    }
    this.imgStyle ={
      width: 'auto',
      height: '85%',
      maxWidth: '90%',
      position: 'relative',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'block',
      pointerEvents: 'none'
    }
    this.imgStyleNotReady = {
      display: 'none'
    }
    this.imgOnload = this.imgOnload.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  onDoubleClick(e){

  }
  render(){
    let t = css.item +' '+css.itemBg+' '
    if(this.props.type == 1)
      t += css.itemBgH
    else if(this.props.type == 2)
      t += css.itemBgH+' '+css.shrink
    else if(this.props.type == 3)
      t += css.shrink
    const icon = this.props.data.backgroundIcon
    return (
      <div className={t} onDoubleClick={this.onDoubleClick}><span className={css.iconCtBg}>
        {
          icon.URL?
            <React.Fragment>
              <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady} src={icon.URL} onLoad={this.imgOnload}/>
              {this.state.imgReady? '':<Icon className={'unknown'}/>}
            </React.Fragment>
          :
          <Icon className={icon.className}/>
        }
      </span></div>
    )
  }
}

export default TaskItems
