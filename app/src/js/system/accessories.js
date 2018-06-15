import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import css from '../../css/system/accessories.css'

class Accessories {

  fullScreen(){

  }

}

class FullScreenButton extends Component{

  constructor(props){
    super(props)
    this.state = {
      ready: 0,
      show: 0,
    }
    this.returnToOrigin = this.returnToOrigin.bind(this)
    const ele = document.documentElement
    let requestMethod = ele.requestFullScreen ||
      ele.webkitRequestFullScreen ||
      ele.mozRequestFullScreen ||
      ele.msRequestFullScreen
    if (requestMethod) {
      this.state.show = 1
    }
  }
  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        ready: 1
      })
    },1000)
    window.addEventListener('resize', ()=>{
      clearTimeout(this.returnToOrigin)
      setTimeout(this.returnToOrigin, 1000)
    })
  }

  returnToOrigin(){
    const ele = this.refs.element
    ele.style.transition = 'top,left cubic-bezier(.75,.27,.41,1.27) 2s,2s'
    ele.style.left = document.body.offsetWidth-ele.offsetWidth-30 +'px'
    ele.style.top = '30px'
    setTimeout(()=>{
      ele.style.transition = ''
    },2100)
  }
  onClick(){
    if(this.__ondrag_moved__) return
    delete this.__ondrag_moved__
    if(document.fullscreenElement    ||
       document.msFullscreenElement  ||
       document.mozFullScreenElement ||
       document.webkitFullscreenElement || false)
    {
      let exitMethod = document.exitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen ||
            document.webkitExitFullscreen
      if (exitMethod) {
        exitMethod.call(document)
      }
    }else {

      const ele = document.documentElement
      let requestMethod = ele.requestFullScreen ||
      ele.webkitRequestFullScreen ||
      ele.mozRequestFullScreen ||
      ele.msRequestFullScreen
      if (requestMethod) {
        requestMethod.call(ele)
      }
    }
    setTimeout(()=>{
      System.desktop.windows.state.wins.forEach((win)=>{
        if(win.maximised)
          win.setStyle({
            width: win.container.offsetWidth +'px',
            height: win.container.offsetHeight +'px',
          })
      })
    },200)
  }

  onDrag(e){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const ele = this.refs.element
    let beginLeft = ele.offsetLeft
    let beginTop = ele.offsetTop
    let left
    let top

    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        this.__ondrag_moved__ = 1
        moved = true
        ele.className += ' '+css.hovering
        ele.style.transition = ''
      }
      left = mx-x +beginLeft
      top = my-y +beginTop
      let h_width = ele.offsetWidth/2
      left = Math.max(-h_width, left)
      top = Math.max(-h_width, top)
      left = Math.min(document.body.offsetWidth-h_width, left)
      top = Math.min(document.body.offsetHeight-h_width, top)
      ele.style.left = left +'px'
      ele.style.top = top +'px'
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
        ele.className = ele.className.replace(new RegExp(' '+css.hovering,'g'),'')
        this.returnToOrigin()
        setTimeout(()=>{
          delete this.__ondrag_moved__
        },100)
      }
    }
    document.addEventListener('touchmove', tm, {passive: false})
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', up, false)
    document.addEventListener("touchmove", move, false)
    document.addEventListener("touchend", up, false)
    document.addEventListener("touchcancel", up, false)
  }

  onMouseDown(e){
    this.onDrag(e)
  }
  render(){
    if(this.state.show)
    return(
      <div className={css.fullScreenBtn} ref='element' style={{visibility:this.state.ready?'':'hidden'}}
        onMouseDown={(e)=>this.onMouseDown(e)} onTouchStart={(e)=>this.onMouseDown(e)} onClick={()=>this.onClick()}
      >
        <div className={css.leftTop+' '+css.angle}></div><div className={css.leftBottom+' '+css.angle}></div>
        <div className={css.rightTop+' '+css.angle}></div><div className={css.rightBottom+' '+css.angle}></div>
      </div>
    )
    else return null
  }

}
Accessories.FullScreenButton = FullScreenButton

export default Accessories
