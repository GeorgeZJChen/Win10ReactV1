import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'
import Icon from '../components/icon.js'
import Utils from '../components/Utils.js'
import css from '../../css/desktop/taskbar.css'


class WindowItems extends Component{
  constructor(props){
    super(props)
    this.state = {
      renderFlag: 1
    }
  }
  update(){
    this.initiated = 1
    this.setState((prevState)=>{
      return {renderFlag: ~prevState.renderFlag}
    })
  }
  render(){
    if(this.initiated){
      return (
        <React.Fragment>
          <WindowPreview ref='preview'/>
          {
            (()=>{
              const arr = []
              System.desktop.refs.taskbar.windowTaskMaps.forEach((taskMap, key)=>{
                arr.push(<WindowItem key={key} taskMap={taskMap} parent={this}/>)
              })
              return arr
            })()
          }
        </React.Fragment>
      )
    }else{
      return null
    }
  }
}

class BackgroundItems extends Component{
  constructor(props){
    super(props)
    this.state = {
      renderFlag: 1
    }
  }
  update(){
    this.initiated = 1
    this.setState((prevState)=>{
      return {renderFlag: ~prevState.renderFlag}
    })
  }
  render(){
    return(
      this.initiated?
      (
        <React.Fragment>
          {
            (()=>{
              const arr = []
              System.desktop.refs.taskbar.backgroundTaskMaps.forEach((taskMap)=>{
                let task
                taskMap.forEach((_task)=>{
                  task = _task
                })

                let t = this.props.type
                let d = task.backgroundIcon.hidden
                if((t==1&&d==0)||(d==1&&t!=1)) return
                arr.push( <BackgroundItem key={task.id} data={task} type={this.props.type}/>)
              })
              return arr
            })()
          }
        </React.Fragment>
      )
      :
      null
      )
  }
}
class WindowPreview extends Component{
  constructor(props){
    super(props)
    this.display = 0
    this.reference = null
  }
  setPreviews(){
    const previewPages = []
    for (let i = 0; i < this.reference.tasks.length; i++) {
      let task = this.reference.tasks[i]
      let win = System.desktop.windows.get(task.window.wid)
      if(win){
        let previewPage = <PreviewPage win={win} key={win.wid+Math.random()} parent={this}/>
        previewPages.push(previewPage)
      }
    }
    ReactDOM.render(<React.Fragment>{previewPages}</React.Fragment>, this.refs.element)
  }
  show(reference){
    this.reference = reference
    const ele = this.refs.element

    this.setPreviews()

    if(!this.display)
      ele.style.transition = 'none'
    ele.style.display = 'block'
    setTimeout(()=>{
      ele.style.left = Math.max(Utils.computePosition(this.reference.refs.element)[0]-(ele.offsetWidth-this.reference.refs.element.offsetWidth)/2,0) +'px'
      setTimeout(()=>{
        ele.style.transition = ''
        setTimeout(()=>{
          ele.className += ' '+css.display
        },10)
      },10)
    },10)
    this.display = 1
  }
  hide(forceHide){
    if(this.__hovering__&&!forceHide) return
    if(this.display == 1){
      const ele = this.refs.element
      ele.className = ele.className.replace(new RegExp(' '+css.display, 'g'),'')
      this.display = 0
      setTimeout(()=>{
        ele.style.display = ''
      },350)
    }
  }
  onMouseOver(){
    this.__hovering__ = 1
  }
  onMouseLeave(){
    delete this.__hovering__
    setTimeout(()=>{
      if(!this.__hovering__&&!this.reference){
        this.hide()
      }
    },500)
  }
  render(){
    return (
      <div className={css.preview} ref='element'
        onMouseOver={()=>this.onMouseOver()} onMouseLeave={()=>this.onMouseLeave()}>
      </div>
    )
  }
}
class PreviewPage extends Component{
  componentDidMount(){
    const maxHeight = 120
    const maxWidth = 180
    const cloneWin = this.props.win.refs.element.cloneNode(true)

    let style = getComputedStyle(cloneWin)
    let width = style.width.replace('px','') *1
    let height = style.height.replace('px','') *1
    let scaleWidth = (maxWidth)/width
    let scaleHeight = maxHeight/height
    let scale = (Math.min(scaleWidth,scaleHeight)).toFixed(2)
    cloneWin.id = ''
    cloneWin.style.transform = 'translate(-50%,-50%) scale('+scale+')'
    cloneWin.className += ' '+css.cloneWin

    const content = this.refs.content
    this.refs.element.style.width = (width*scale+16).toFixed(2) +'px'
    content.style.height = (height*scale+8).toFixed(2) +'px'
    content.appendChild(cloneWin)
  }
  onClick(e){
    if(e.target == this.refs.closeBtn) return
    this.props.win.select()
    this.props.parent.hide(1)
  }
  close(){
    const ele = this.refs.element
    let oWidth = ele.offsetWidth
    let parent = this.props.parent
    let parentEle = this.props.parent.refs.element
    let computedLeft = Utils.computePosition(parent.reference.refs.element)[0]-(parentEle.offsetWidth-oWidth-parent.reference.refs.element.offsetWidth)/2
    let siblings = this.refs.element.parentNode.children
    let count = 0
    for(let i=0;i<siblings.length;i++){
      if(siblings[i].offsetWidth>1)
        count++
    }
    if(count>1){
      ele.style.transition = 'all ease-out 0.2s'
      for (let i = 0; i < ele.children.length; i++) {
        ele.children[i].style.opacity = 0
      }
    }
    ele.style.minWidth = 0
    ele.style.width = 0
    ele.style.opacity = 0
    parentEle.style.left = Math.max(computedLeft,0) +'px'
    this.props.win.close()
  }
  render(){
    const icon = this.props.win.props.data.windowIcon
    return(
      <div className={css.previewPage} onClick={(e)=>this.onClick(e)} ref='element'>
        <div className={css.previewHeader} ref='header'>
            {
              icon?(
                <div className={css.previewIcon}>
                {
                  icon.URL?
                  <img src={icon.URL} className={css.previewIconImg}/>
                  :
                  <Icon className={icon.className}/>
                }
                </div>
              ):''
            }
            <div className={css.previewTitle}>{this.props.win.name}</div>
            <div className={css.previewBtn} ref='closeBtn' onClick={()=>this.close()}></div>
        </div>
        <div className={css.previewContent} ref='content'></div>
      </div>
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
    this.selected = 0
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onClick = this.onClick.bind(this)
  }
  componentDidMount(){
    this.props.taskMap.taskbarItem = this
  }
  select(){
    if(!this.selected){
      let selected = System.desktop.refs.taskbar.selected
      if(selected) selected.deselect()
      System.desktop.refs.taskbar.selected = this
      this.refs.element.className += ' '+css.selected
      this.selected = 1
    }
  }
  deselect(){
    if(this.__mousedown__){
      return
    }
    if(this.selected){
      System.desktop.refs.taskbar.selected = null
      this.refs.element.className = this.refs.element.className.replace(new RegExp(' '+css.selected,'g'),'')
      this.selected = 0

      const preview = this.props.parent.refs.preview
      if(preview.reference==this)
        preview.hide()
    }
  }
  componentWillUnmount(){
    if(System.desktop.refs.taskbar.selected == this)
    System.desktop.refs.taskbar.selected = null
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  onClick(e){

    delete this.__mousedown__

    if(this.tasks.length==1){

      if(this.selected){
        let win = System.desktop.windows.get(this.tasks[0].window.wid)
        if(win.minimisable&&!win.minimised){
          win.minimise()
        }else{
          win.deselect()
        }
        this.deselect()
      }else{
        this.select()
        const win = System.desktop.windows.get(this.tasks[0].window.wid)
        if(win) win.select()
      }
    }else{
      if(this.selected){
        this.deselect()
        this.props.parent.refs.preview.hide()
      }else {
        this.select()
        this.props.parent.refs.preview.show(this)
        const tf = ()=>{
          if(!this.__mousedown__) this.deselect()
          document.removeEventListener('mousedown', tf)
        }
        document.addEventListener('mousedown', tf)
      }
    }

  }
  onMouseDown(){
    this.__mousedown__ = 1
  }
  onMouseEnter(){
    this.__hovering__ = 1
    const preview = this.props.parent.refs.preview
    setTimeout(()=>{
      if(this.__hovering__)
        preview.show(this)
    },(preview.display?150:500))
    preview.reference = this
  }
  onMouseLeave(){
    delete this.__hovering__
    const preview = this.props.parent.refs.preview
    setTimeout(()=>{
      if(!this.__hovering__){
        if(preview.reference==this&&!preview.__hovering__){
          preview.hide()
          preview.reference = null
        }
      }
    },500)
  }
  render(){
    this.tasks = []
    this.props.taskMap.forEach((_task)=>{
      this.tasks.push(_task)
    })
    if(this.tasks.length>0){
      const icon = this.tasks[0].taskbarIcon
      return (
        <div className={css.item+' '+css.itemTask+(this.tasks.length>1?(' '+css.x):'')+(this.selected?(' '+css.selected):'')} ref='element'
        onClick={this.onClick} onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}
        onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        >
        <span className={css.iconCt}>
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
    }else{
      return null
    }
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
    this.onClick = this.onClick.bind(this)
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  onClick(e){
    System.desktop.closeStartMenu()
  }
  onDoubleClick(e){
    System.addTask(this.props.data.id, this.props.data.query, this.props.data.name)
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
      <div className={t} onDoubleClick={this.onDoubleClick} onClick={this.onClick}
      ><span className={css.iconCtBg}>
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

export {WindowItems, BackgroundItems}
