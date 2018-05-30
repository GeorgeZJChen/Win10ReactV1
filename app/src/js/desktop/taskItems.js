import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Events from '../components/event.js'
import Icon from '../components/icon.js'
import css from '../../css/desktop/taskbar.css'

class TaskItems extends Component{
  constructor(props){
    super(props)
    this.state = {
      renderFlag: true
    }
  }
  componentDidMount() {
    Events.on(Events.names.to_task_items_add_new_task, (task)=>{
      this.setState((prevState)=>{
        return {renderFlag: !prevState.renderFlag}
      })
    })
  }
  render(){
    return(
      <React.Fragment>
        {
          this.props.tasks.map((task, index)=>{
            if(this.props.type == 0){ //render on taskbar
              if(task.isTaskbarTask){
                if(task.taskbarIcon.URL)
                  return <Item key={task.id} id={task.id} className={'unknown'} URL={task.taskbarIcon.URL} isImage={true} index={index}/>
                else
                return <Item key={task.id} id={task.id} className={task.taskbarIcon.className} index={index}/>
              }
            } else {  //render background task
              if (task.isBackgroundTask) {
                let t = this.props.type
                let d = task.backgroundIcon?task.backgroundIcon.display:0
                if((t==1&&d==1)||(d==0&&t!=1)) return
                if(task.backgroundIcon.URL)
                  return <BackgroundItem key={task.id} URL={task.backgroundIcon.URL}  id={task.id} className={'unknown bg'}
                     isImage={true} index={index} type={this.props.type}/>
                else
                return (
                  <BackgroundItem key={task.id} id={task.id} className={task.backgroundIcon.className}
                      index={index} type={this.props.type}/>
                )
              }
            }
          })
        }
      </React.Fragment>
    )
  }
}
class Item extends Component{
  constructor(props){
    super(props)
    this.state = {
      imgReady: 0,
      renderFlag: true
    }
    this.imgStyle ={
      width: 'auto',
      height: '70%',
      maxWidth: '85%',
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
    this.index = props.index
  }
  imgOnload(){
    this.setState((prevState)=>{
      return{
        imgReady: 1,
        renderFlag: !prevState.renderFlag
      }
    })
  }
  onclick(e){
    Events.emit(Events.names.handle_task_items_onclick, e, this.props.id)
  }
  render(){
    if(this.props.isImage){
      return(
        <div className={css.item+' '+css.itemTask} key={this.props.id} onClick={(e)=>this.onclick(e)}><span className={css.iconCt}>
          {this.state.imgReady? '':<Icon className={this.props.className}/>}
          <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady} src={this.props.URL} onLoad={()=>{this.imgOnload()}}/>
        </span></div>
      )
    }else
    return(
      <div className={css.item+' '+css.itemTask} key={this.props.id} onClick={(e)=>this.onclick(e)}><span className={css.iconCt}>
        <Icon className={this.props.className}/>
      </span></div>
    )
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.index == nextProps.index&&this.state.renderFlag==nextState.renderFlag) return false
    return true
  }
}
class BackgroundItem extends Component{
  constructor(props){
    super(props)
    this.index = props.index
    this.state = {
      imgReady: 0,
      renderFlag: true
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
  }
  imgOnload(){
    this.setState((prevState)=>{
      return{
        imgReady: 1,
        renderFlag: !prevState.renderFlag
      }
    })
  }
  onclick(e){
    Events.emit(Events.names.handle_task_items_onclick, e, this.props.id)
  }
  render(){
    let t = ''
    if(this.props.type == 1)
    t = css.itemBg+' '+css.itemBgH+' '+css.item
    else if(this.props.type == 2)
    t = css.itemBgH+' '+css.item+' '+css.itemBg+' '+css.shrink
    else if(this.props.type == 3)
    t = css.item+' '+css.itemBg+' '+css.shrink
    if(this.props.isImage){
      return(
        <div className={t} key={this.props.id} onClick={(e)=>this.onclick(e)}><span className={css.iconCtBg}>
          {this.state.imgReady? '':<Icon className={this.props.className}/>}
          <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady} src={this.props.URL} onLoad={()=>{this.imgOnload()}}/>
        </span></div>
      )
    }else {
      return(
        <div className={t} key={this.props.id} onClick={(e)=>this.onclick(e)}><span className={css.iconCtBg}>
          <Icon className={this.props.className}/></span>
        </div>
      )
    }

  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.index == nextProps.index&&this.state.renderFlag==nextState.renderFlag) return false
    return true
  }
}

export default TaskItems
