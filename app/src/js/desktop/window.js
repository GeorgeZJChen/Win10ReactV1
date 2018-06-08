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
      <React.Fragment>
      <div className={css.shadow} ref='shadow'>
        <div className={css.shadowInner}></div>
      </div>
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
      </React.Fragment>
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
    this.resize = this.resize.bind(this)

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
      <div className={css.window} ref='element' onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}>
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
            style={{marginRight:(this.btnGroup[0]*46+this.btnGroup[1]*46+this.btnGroup[2]*46)}}
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
        <div className={css.resize} ref='resize' onMouseDown={this.resize} onTouchStart={this.resize}>
          <div className={css.barLeft}></div><div className={css.barTop}></div><div className={css.barRight}></div><div className={css.barBottom}></div>
          <div className={css.dotLeftTop}></div><div className={css.dotRightTop}></div><div className={css.dotRightBottom}></div><div className={css.dotLeftBottom}></div>
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
      this.refs.resize.style.visibility = 'hidden'
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
      this.refs.resize.style.visibility = 'visible'
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
        this.refs.resize.style.visibility = 'hidden'
        shadow = this.props.parent.refs.shadow
        shadow.style.display = 'block'
      }
      if(this.maximised){
        this.maximise()
        let width = this.width
        let ctWidth = this.container.offsetWidth
        let _left
        if (x < width / 2)
        _left = 0
        else if (x > ctWidth - width / 2)
        _left = ctWidth - width
        else
        _left = x - width / 2
        beginLeft = _left
        beginTop = 0
        // this.top = 0
        // this.left = _left
        this.setStyle({
          left: _left +'px',
          top: 0,
          width: this.width+'px',
          height: this.height+'px'
        })

      }
      else if(this.clinging){
        if(my > 40){
          this.clinging = 0
          let _left = mx-x +beginLeft
          if(_left+this.width<mx-10)
            _left = mx - this.width / 2
          this.setStyle({
            left: _left +'px',
            top: 0,
            width: this.width +'px',
            height: this.height +'px'
          })
        } else {
          this.setStyle({
            left: mx-x +beginLeft +'px',
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
        this.refs.resize.style.visibility = ''
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
        this.clinging = 0
        this.setStyle({
          width: width + "px",
          height: height +'px',
          left: left + "px",
          top: top +'px'
        })
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
        }else {
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
