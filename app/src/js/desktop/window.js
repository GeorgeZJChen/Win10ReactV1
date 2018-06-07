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
      maxIndex: 0,
      selected: null,
      renderFlag: 1,
    }
    this.deselectFront = this.deselectFront.bind(this)
    setTimeout(()=>{
      this.add({
        name: 'New window 1',
        id: 'id_1',
        icon: {className: 'folder sm'}
      })
    },1000)
  }
  componentDidMount(){
    document.addEventListener('mousedown', this.deselectFront)
    document.addEventListener('touchstart', this.deselectFront)
  }
  componentWillUnmount(){
    document.removeEventListener('mousedown', this.deselectFront)
    document.removeEventListener('touchstart', this.deselectFront)
  }
  deselectFront(e){
    if(!this.__mousedown_on_window__){
      if(this.state.selected) this.state.selected.deselect()
    }
    delete this.__mousedown_on_window__
  }
  selectFront(){
    if(!this.state.selected)
    {
      const fw = this.getFront()
      if(fw) fw.select()
    }
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
    if(this.state.selected==win) this.state.selected = null
    this.setState((prevState)=>{
      return { renderFlag: ~prevState.renderFlag }
    })
  }
  getFront(){
    let frontWin = {zIndex: 0}
    this.state.wins.forEach((win)=>{
      if(win.zIndex > frontWin.zIndex){
        frontWin = win
      }
    })
    return frontWin
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
      color: props.data.color || ''
    }
    this.container = props.container.refs.element
    this.parentState = props.parent.state

    this.id = props.data.id
    this.btnGroup = props.data.btnGroup || [1, 1, 1]
    this.width = props.data.width || 600
    this.height = props.data.height || 400
    this.getPosition(props.center)

    this.close = this.close.bind(this)
    this.minimise = this.minimise.bind(this)
    this.maximise = this.maximise.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)

    this.maximised = 0
    this.minimised = 0

    this.onMouseDownLabel = this.onMouseDownLabel.bind(this)
  }
  componentDidMount() {
    this.setStyle({
      top: this.top +'px',
      left: this.left +'px',
      width: this.width +'px',
      height: this.height +'px',
      visibility: "visible"
    })
    this.select()
  }
  render(){
    return(
      <div className={css.window} ref='element' onMouseDown={this.onMouseDown}>
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
            style={{marginRight:(this.btnGroup[0]*46+this.btnGroup[1]*46+this.btnGroup[2]*46+5)}}
            onMouseDown={this.onMouseDownLabel} onTouchStart={this.onMouseDownLabel}
            onDoubleClick={this.maximise}
            ></div>
        </div>
        <div className={css.btnGroup}>
        {
          [
            this.btnGroup[0]?<div className={css.btn+' '+css.btnMinimise} onClick={this.minimise} key={'btn_1'}></div>:'',
            this.btnGroup[1]?<div className={css.btn+' '+css.btnMaximise} onClick={this.maximise} ref='maximise' key={'btn_2'}></div>:'',
            this.btnGroup[2]?<div className={css.btn+' '+css.btnClose} onClick={this.close} key={'btn_3'}></div>:''
          ]
        }
        </div>
        <div className={css.content}></div>
        <div className={css.resize} ref='resize'>
          <div className={css.barL}></div><div className={css.barT}></div><div className={css.barR}></div><div className={css.barB}></div>
          <div className={css.dotLT}></div><div className={css.dotRT}></div><div className={css.dotRB}></div><div className={css.dotLB}></div>
        </div>
      </div>
    )
  }
  onMouseDown(e){
    this.props.parent.__mousedown_on_window__ = 1
    if(!this.selected) this.select()
  }
  close(){
    this.props.parent.remove(this)
  }
  minimise(){

  }
  maximise(){
    const ct = this.container
    const maxBtn = this.refs.maximise
    if(!this.maximised){
      this.maximised = 1
      this.setStyle({
        left: 0,
        top: 0,
        width: ct.offsetWidth +'px',
        height: ct.offsetHeight +'px'
      })
      maxBtn.className += ' '+css.restore
    }else {
      this.maximised = 0
      this.setStyle({
        left: this.left+'px',
        top: this.top+'px',
        width: this.width +'px',
        height: this.height +'px'
      })
      maxBtn.className = maxBtn.className.replace(new RegExp(' '+css.restore, 'g'), '')
    }
  }
  select(){
    if(this.parentState.selected == this) return
    if(this.parentState.selected) this.parentState.selected.deselect()
    this.parentState.selected = this
    this.setStyle({
      backgroundColor:  this.props.data.color,
      color:  this.props.data.color,
      zIndex: ++this.parentState.maxIndex
    })
    this.zIndex = this.parentState.maxIndex
    this.refs.element.className = this.refs.element.className.replace(new RegExp(' '+css.deselected,'g'),'')
  }
  deselect(){
    if(this.parentState.selected != this) return
    this.parentState.selected = null
    this.setStyle({
      backgroundColor:  this.props.data.color2,
      color:  this.props.data.color2
    })
    this.refs.element.className += ' '+css.deselected
  }
  onMouseDownLabel(e){
    this.onDrag(e)
  }
  onDrag(e){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const ele = this.refs.element
    let beginLeft = this.left
    let beginTop = this.top

    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        this.refs.resize.style.visibility = 'hidden'
      }
      if(!this.maximised){
        this.left = mx-x +beginLeft
        this.top = my-y +beginTop
        this.setStyle({
          left: this.left +'px',
          top: this.top +'px'
        })
      }else {
        this.maximise()
        let width = this.width
        let ctWidth = this.container.offsetWidth
        let left
        if (x < width / 2)
          left = 0
        else if (x > ctWidth - width / 2)
          left = ctWidth - width
        else
          left = x - width / 2
        this.setStyle({
          left: left +'px',
          top: 0,
          width: this.width,
          height: this.height
        })
        beginLeft = left
        beginTop = 0
      }
    }
    const tm = function(e){e.preventDefault()}
    const up = (e)=>{
      document.removeEventListener('touchmove', tm, {passive: false})
      document.removeEventListener('mousemove', move, false)
      document.removeEventListener('mouseup', up, false)
      document.removeEventListener("touchmove", move, false)
      document.removeEventListener("touchend", up, false)
      document.removeEventListener("touchcancel", up, false)
      if(moved){
        this.refs.resize.style.visibility = ''

        if(this.top<-10){
          this.top = 0
          this.maximise()
        }else if(this.top<0){
          this.top = 0
          this.setStyle({
            top: 0
          })
        }else if(this.top>this.container.offsetHeight-10){
          this.top = this.container.offsetHeight-25
          this.setStyle({
            top: this.top +'px'
          })
        }
        if(this.left>this.container.offsetWidth-40){
          this.left = this.container.offsetWidth-40
          this.setStyle({
            left: this.left +'px'
          })
        }
      }
    }
    document.addEventListener('touchmove', tm, {passive: false})
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', up, false)
    document.addEventListener("touchmove", move, false)
    document.addEventListener("touchend", up, false)
    document.addEventListener("touchcancel", up, false)
  }
  setStyle(style){
    for(var key in style){
      if(style[key]==undefined||style[key]==null)
        style[key] = ''
      this.refs.element.style[key] = style[key]
    }
  }
  getPosition(center){
    const container = this.container
    if(center){
      this.left = Math.floor((container.offsetWidth - this.width)/2)
      this.top = Math.floor((container.offsetHeight - this.height)/2)
    }
    else{
      this.left = Math.floor((container.offsetWidth - this.width)*(Math.random()*0.5+0.25))
      this.top = Math.floor((container.offsetHeight - this.height)*(Math.random()*0.5+0.25))
    }
  }

}

export default Windows
