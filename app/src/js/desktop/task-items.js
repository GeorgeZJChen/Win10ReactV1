import React, {Component} from 'react'
import ReactDOM from 'react-dom'
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
            window.desktop.state.tasks.forEach((task)=>{
              if(this.props.type == 0){ //render on taskbar
                if(task.taskbarIcon){
                  arr.push(<WindowItem key={task.id} data={task}/>)
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
    this.setState({
      imgReady: 1
    })
  }
  onclick(e){

  }
  render(){
    const icon = this.props.data.taskbarIcon
    return (
      <div className={css.item+' '+css.itemTask} onClick={(e)=>this.onclick(e)}><span className={css.iconCt}>
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
