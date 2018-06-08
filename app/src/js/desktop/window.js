import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Events from '../components/event.js'
import Icon from '../components/icon.js'

import css from '../../css/desktop/window.css'

class Windows extends Component {

  constructor(props){
    super(props)
    this.state = {
      wins: new Map(),
      winsData: new Set(),
      maxIndex: 1000,
      selected: null,
      renderFlag: 1,
    }
    this.deselectFront = this.deselectFront.bind(this)

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
      if(fw instanceof Win) fw.select()
    }
  }
  evoke(id){
    let win = this.state.wins.get(id)
    if(win){
      if(win.minimised)
        win.minimise()
      win.select()
      return 1
    }
    return 0
  }
  add(task, cb){
    if(!this.state.wins.get(task.id)){
      this.state.winsData.add(task)

      cb = cb?cb: (win)=>{win.load()}
      if(cb) Events.once('_window_ready_'+task.id, cb)

      this.setState((prevState)=>{
        return { renderFlag: ~prevState.renderFlag }
      })
      return 1
    }
    return 0
  }
  remove(win){
    this.state.wins.delete(win.id)
    this.state.winsData.delete(win.props.data)
    if(!win.donotend) window.desktop.shutDownTask(win.id)
    if(this.state.selected==win) this.state.selected = null
    this.setState((prevState)=>{
      return { renderFlag: ~prevState.renderFlag }
    })
    this.selectFront()
  }
  getFront(){
    let frontWin
    this.state.wins.forEach((win)=>{
      if(win.zIndex > frontWin?frontWin.zIndex:1000){
        frontWin = win
      }
    })
    return frontWin
  }

  render(){
    return (
      <div className={css.windowCt} ref='element'>
        <div className={css.shadow} ref='shadow'>
          <div className={css.shadowInner}></div>
        </div>
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
      iconReady: 0
    }
    this.container = props.container.refs.element

    this.id = props.data.id
    this.name = props.data.name
    this.color = props.data.win.color
    this.color2 = props.data.win.color2
    this.backgroundColor = props.data.win.backgroundColor
    this.backgroundColor2 = props.data.win.backgroundColor2
    this.btnGroup = props.data.win.btnGroup || [1, 1, 1]
    this.resizable = props.data.win.resizable===0?0:1
    this.width = props.data.win.width || 600
    this.height = props.data.win.height || 400
    this.getPosition(props.data.win.center)

    this.donotend = props.data.win.donotend || 0

    const f = ()=>{}
    this.minimise = this.btnGroup[0]?this.minimise.bind(this):f
    this.maximise = this.btnGroup[1]?this.maximise.bind(this):f
    this.close = this.btnGroup[2]?this.close.bind(this):f
    this.resize = this.resizable?this.resize.bind(this):f

    this.onMouseDown = this.onMouseDown.bind(this)
    this.iconOnload = this.iconOnload.bind(this)

    this.maximised = 0
    this.minimised = 0
    this.loaded = 0
    this.onMouseDownLabel = this.onMouseDownLabel.bind(this)

    props.parent.state.wins.set(this.id, this)
  }
  componentDidMount() {
    this.onLoad()
  }
  onLoad(){
    Events.emit('_window_ready_'+this.id, this)
  }
  load(){
    this.loaded = 1
    this.setStyle({
      top: this.top +'px',
      left: this.left +'px',
      width: this.width +'px',
      height: this.height +'px',
    })
    this.setStyle({
      visibility: "visible"
    })
    this.select()
  }
  render(){
    const icon = this.props.data.win.windowIcon
    return(
      <div className={css.window} ref='element' onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}>
        <div className={css.label} ref='label'>
          {
            icon?
              <div className={css.labelIcon}>
              {
                icon.URL?
                (
                  <React.Fragment>
                  <img src={icon.URL} className={css.iconImg}
                  onLoad={this.iconOnload} style={{display:this.state.iconReady?'':'none'}}/>
                  this.state.iconReady? '' : <Icon className={"unknown bg"}/>
                  </React.Fragment>
                )
                :
                <Icon className={icon.className}/>
              }
              </div>
              :''
          }
          <div className={css.labelName} data-title={this.name}
            style={{marginRight:(this.btnGroup[0]*46+this.btnGroup[1]*46+this.btnGroup[2]*46)}}
            onMouseDown={this.onMouseDownLabel} onTouchStart={this.onMouseDownLabel}
            onDoubleClick={this.maximise}
            ></div>
        </div>
        <div className={css.btnGroup} ref='btns'>
        {
          [
            this.btnGroup[0]?<div className={css.btn+' '+css.btnMinimise} onClick={this.minimise} key={'btn_1'}></div>:'',
            this.btnGroup[1]?<div className={css.btn+' '+css.btnMaximise} onClick={this.maximise} ref='maximise' key={'btn_2'}></div>:'',
            this.btnGroup[2]?<div className={css.btn+' '+css.btnClose} onClick={this.close} key={'btn_3'}></div>:''
          ]
        }
        </div>
        <div className={css.content} ref='content'></div>
        {
          this.resizable?
            <div className={css.resize} ref='resize' onMouseDown={this.resize} onTouchStart={this.resize}>
              <div className={css.barLeft}></div><div className={css.barTop}></div><div className={css.barRight}></div><div className={css.barBottom}></div>
              <div className={css.dotLeftTop}></div><div className={css.dotRightTop}></div><div className={css.dotRightBottom}></div><div className={css.dotLeftBottom}></div>
            </div>
            :
            ''
        }
      </div>
    )
  }
  iconOnload(){
    this.setState({
      iconReady: 1
    })
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
      if(this.resizable) this.refs.resize.style.visibility = 'hidden'
    }else {
      this.maximised = 0
      this.clinging = 0
      this.setStyle({
        left: this.left+'px',
        top: this.top+'px',
        width: this.width +'px',
        height: this.height +'px'
      })
      maxBtn.className = maxBtn.className.replace(new RegExp(' '+css.restore, 'g'), '')
      if(this.resizable)this.refs.resize.style.visibility = 'visible'
    }
  }
  select(){
    if(this.props.parent.state.selected == this) return
    if(this.props.parent.state.selected) this.props.parent.state.selected.deselect()
    this.props.parent.state.selected = this
    this.selected = 1
    this.setStyle({
      backgroundColor:  this.backgroundColor,
      borderColor:  this.backgroundColor,
      color:  this.color,
      zIndex: ++this.props.parent.state.maxIndex
    })
    this.refs.btns.style.color = this.color
    this.refs.label.style.color = this.color

    this.zIndex = this.props.parent.state.maxIndex
    this.refs.element.className = this.refs.element.className.replace(new RegExp(' '+css.deselected,'g'),'')

  }
  deselect(){
    if(this.props.parent.state.selected != this) return
    this.props.parent.state.selected = null
    this.selected = 0
    this.setStyle({
      backgroundColor:  this.backgroundColor2,
      borderColor:  this.backgroundColor2,
      color:  this.color2
    })
    this.refs.label.style.color = this.color2
    this.refs.btns.style.color = this.color2
    this.refs.element.className += ' '+css.deselected
  }
  onMouseDownLabel(e){
    this.onDrag(e)
  }
  onDrag(e){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const ele = this.refs.element
    let beginLeft = this.refs.element.offsetLeft
    let beginTop = this.refs.element.offsetTop
    let left
    let top
    let shadow
    let shadowShowing = 0

    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        if(this.resizable)this.refs.resize.style.visibility = 'hidden'
        shadow = this.props.parent.refs.shadow
        shadow.style.display = 'block'
        shadow.style.zIndex = this.props.parent.state.maxIndex
      }
      if(this.maximised){
        this.maximise()
        let width = this.width
        let ctWidth = this.container.offsetWidth
        if (x < width / 2)
        left = 0
        else if (x > ctWidth - width / 2)
        left = ctWidth - width
        else
        left = x - width / 2
        beginLeft = left
        beginTop = 0
        this.setStyle({
          left: left +'px',
          top: 0,
          width: this.width+'px',
          height: this.height+'px'
        })

      }
      else if(this.clinging){
        left = mx-x +beginLeft
        if(my > 40){
          this.clinging = 0
          if(left+this.width<mx-10)
            left = mx - this.width / 2
          this.setStyle({
            left: left +'px',
            top: 0,
            width: this.width +'px',
            height: this.height +'px'
          })
        } else {
          this.setStyle({
            left: left +'px',
            top: 0
          })
        }
      }
      else {
        left = mx-x +beginLeft
        top = my-y +beginTop
        this.setStyle({
          left: left +'px',
          top: top+'px'
        })
        if(!this.resizable) return
        //shadow
        let showShadow = 0
        if(top<-10){
          if(shadow.className.indexOf(css.top)==-1)
            shadow.className += ' '+css.top
          showShadow = 1
        }else if(top>0){
          shadow.className = shadow.className.replace(new RegExp(' '+css.top,'g'),'')
        }
        if(mx<=1){
          if(shadow.className.indexOf(css.left)==-1)
            shadow.className += ' '+css.left
          showShadow = 1
        }else if(mx>15){
          shadow.className = shadow.className.replace(new RegExp(' '+css.left,'g'),'')
        }
        if(mx>=this.container.offsetWidth-1){
          if(shadow.className.indexOf(css.right)==-1)
            shadow.className += ' '+css.right
          showShadow = 1
        }else if(mx<this.container.offsetWidth-15){
          shadow.className = shadow.className.replace(new RegExp(' '+css.right,'g'),'')
        }
        if(showShadow&&!shadowShowing){
          shadowShowing = 1
          shadow.style.opacity = 1
          shadow.style.top = Math.max(my,0) +'px'
          shadow.style.left = Math.min(Math.max(mx,0),this.container.offsetWidth) +'px'
          shadow.style.width = 0
          shadow.style.height = 0
          shadow.style.transition = 'none'
          setTimeout(()=>{
            shadow.style.top = ''
            shadow.style.left = ''
            shadow.style.width = ''
            shadow.style.height = ''
            shadow.style.transition = ''
          },50)
        }else if (!showShadow&&shadowShowing) {
          shadowShowing = 0
        }
        if(!shadowShowing){
          shadow.style.opacity = 0
          shadow.style.top = shadow.offsetTop +'px'
          shadow.style.left = shadow.offsetLeft +'px'
          shadow.style.width = shadow.offsetWidth +'px'
          shadow.style.height = shadow.offsetHeight +'px'
        }
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
        if(this.resizable)this.refs.resize.style.visibility = ''
        shadow.style.display = ''

        let cn = shadow.className
        const ct = this.container
        if(cn.indexOf(css.top)!=-1){
          if(cn.indexOf(css.left)!=-1){
            this.clinging = 1
            this.setStyle({
              top: 0,
              left: 0,
              width: ct.offsetWidth/2 +'px',
              height: ct.offsetHeight/2 +'px'
            })
          }else if(cn.indexOf(css.right)!=-1){
            this.clinging = 1
            this.setStyle({
              top: 0,
              left: ct.offsetWidth/2 +'px',
              width: ct.offsetWidth/2 +'px',
              height: ct.offsetHeight/2 +'px'
            })
          }else{
            this.maximise()
          }
        }else if(cn.indexOf(css.left)!=-1){
          this.clinging = 1
          this.setStyle({
            top: 0,
            left: 0,
            width: ct.offsetWidth/2 +'px',
            height: ct.offsetHeight +'px'
          })
        }else if (cn.indexOf(css.right)!=-1){
          this.clinging = 1
          this.setStyle({
            top: 0,
            left: ct.offsetWidth/2 +'px',
            width: ct.offsetWidth/2 +'px',
            height: ct.offsetHeight +'px'
          })
        }else if(top<0){
          top = 0
          this.setStyle({
            top: 0
          })
        }else if(top>this.container.offsetHeight-10){
          top = this.container.offsetHeight-25
          this.setStyle({
            top: top +'px'
          })
        }
        if(left>this.container.offsetWidth-40 && cn.indexOf(css.right)==-1){
          left = this.container.offsetWidth-40
          this.setStyle({
            left: left +'px'
          })
        }else if (left<40-this.width && cn.indexOf(css.left)==-1) {
          this.setStyle({
            left: 40-this.width +'px'
          })
        }
        if(!this.maximised&&!this.clinging){
          this.top = top
          this.left = left
        }
        shadow.removeAttribute('style')
        shadow.className = css.shadow
      }
    }
    document.addEventListener('touchmove', tm, {passive: false})
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', up, false)
    document.addEventListener("touchmove", move, false)
    document.addEventListener("touchend", up, false)
    document.addEventListener("touchcancel", up, false)
  }
  resize(e){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const cls = e.target.className
    let top = this.refs.element.offsetTop
    let left = this.refs.element.offsetLeft
    let width = this.refs.element.offsetWidth
    let height = this.refs.element.offsetHeight
    let minHeight
    let minWidth
    let maxHeight
    let maxWidth
    const shadow = this.props.parent.refs.shadow
    let shadowShowing
    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        let style = getComputedStyle(this.refs.element)
        minWidth = style.minWidth.replace('px','') *1
        minHeight = style.minHeight.replace('px','') *1
      }
      let vx = mx - x
      let vy = my - y
      if(this.clinging){
        if(cls.indexOf("top") != -1){
          this.clinging = 0
        }
      }
      if (cls.indexOf("left") != -1) {
        if(vx> width -minWidth) vx = width - minWidth
        this.setStyle({
          width: (width - vx) + "px",
          left: (left + vx) + "px"
        })
      } else if (cls.indexOf("right") != -1) {
        this.setStyle({
          width: (width + vx) + "px",
        })
      }
      if (cls.indexOf("top") != -1) {
        if(vy> height -minHeight) vy = height -minHeight
        if(top+vy<-10){
          if(cls.indexOf('dot')==-1){
            if(!shadowShowing){
              shadowShowing = 1
              shadow.style.display = 'block'
              shadow.style.opacity = 1
              shadow.style.top = Math.max(my,0) +'px'
              shadow.style.left = Math.min(Math.max(mx,0),this.container.offsetWidth) +'px'
              shadow.style.width = 0
              shadow.style.height = 0
              shadow.style.transition = 'none'
              shadow.style.zIndex = this.props.parent.state.maxIndex
              setTimeout(()=>{
                shadow.style.top = 0
                shadow.style.left = left-14 +'px'
                shadow.style.width = this.width+28 +'px'
                shadow.style.height = this.container.offsetHeight +'px'
                shadow.style.transition = ''
              },50)
            }
          }
        }else if(shadowShowing){
          shadow.style.opacity = 0
          shadowShowing = 0
        }
        this.setStyle({
          height: (height - vy) + "px",
          top: (top + vy) + "px"
        })
      } else if (cls.indexOf("bottom") != -1) {
        this.setStyle({
          height: (height + vy) + "px",
        })
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
        if(this.refs.element.offsetTop<-10){
          this.setStyle({
            top: 0,
            height: this.container.offsetHeight +'px'
          })
          this.clinging = 1
        }else if(!this.clinging){
          this.width = this.refs.element.offsetWidth
          this.height = this.refs.element.offsetHeight
          this.left = this.refs.element.offsetLeft
          this.top = this.refs.element.offsetTop
        }
        shadow.style.opacity = 0
        setTimeout(()=>{
          shadow.removeAttribute('style')
        },200)
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
