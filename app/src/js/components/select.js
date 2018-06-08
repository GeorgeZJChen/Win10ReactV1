import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import css from '../../css/components/select.css'

class Select extends Component{

  constructor(props){
    super(props)
    this.state = {
      activated: 0
    }

  }
  componentDidMount(){
    if(this.props.returnSelf)this.props.returnSelf(this)
    this.refs.element.addEventListener('touchmove', function(e){
      e.preventDefault()
    }, {passive: false})


    setTimeout(()=>{
      const toSelect = this.props.container.refs.items
      toSelect.refs.element.addEventListener('mousedown', ()=>{
        this.__mousedown_on_items_to_select_or_this__ = 1
      })
      toSelect.refs.element.addEventListener('touchstart', ()=>{
        this.__mousedown_on_items_to_select_or_this__ = 1
      })
      document.addEventListener('mousedown', ()=>{
        if(!this.__mousedown_on_items_to_select_or_this__)
          this.props.deselect()
        delete this.__mousedown_on_items_to_select_or_this__
      })
      document.addEventListener('touchstart', ()=>{
        if(!this.__mousedown_on_items_to_select_or_this__)
          this.props.deselect()
        delete this.__mousedown_on_items_to_select_or_this__
      })
      document.addEventListener('mouseup',()=>{
        setTimeout(()=>{
          delete this.__select_moved__
        },20)
      })
    },50)
  }
  onClick(){
    if(!this.__select_moved__)
      this.props.deselect()
    delete this.__select_moved__
  }
  onMouseDown(e){
    this.__mousedown_on_items_to_select_or_this__ = 1
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
    const area = this.refs.area
    if(!area) return
    let width = 0
    let height = 0
    let ch = this.refs.element.offsetHeight
    let cw = this.refs.element.offsetWidth
    let top
    let left
    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        this.__select_moved__ = 1
        this.setState({
          activated: 1
        })
      }
      top = y
      left = x
      let sx = 0
      let sy = 0
      if(mx-x>0) {
        width = mx-x
        if(width>=cw-x) width=cw-x
        sx = x + width
      } else {
        width = x-mx
        if(width >= x) width = x
        left = x-width
        sx = x - width
      }
      if(my-y>0){
        height = my-y
        if(height>=ch-y) height=ch-y
        sy = y + height
      } else {
        height = y-my
        if(height >= y) height = y
        top = y-height
        sy = y - height
      }
      area.style.top = top +'px'
      area.style.left = left +'px'
      area.style.width = width +'px'
      area.style.height = height +'px'
      this.props.select(x, y, sx, sy)
    }
    const up = (e)=>{
      document.removeEventListener('mousemove', move, false)
      document.removeEventListener('mouseup', up, false)
      document.removeEventListener("touchmove", move, false)
      document.removeEventListener("touchend", up, false)
      document.removeEventListener("touchcancel", up, false)
      if(moved){
        area.style.top = 0
        area.style.left = 0
        area.style.width = 0
        area.style.height = 0
        this.setState({
          activated: 0
        })
        moved = false
      }
    }
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', up, false)
    document.addEventListener("touchmove", move, false)
    document.addEventListener("touchend", up, false)
    document.addEventListener("touchcancel", up, false)
  }

  render(){
    return (
      <div className={css.selectCt} ref="element" onClick = {()=>this.onClick()} onTouchEnd={()=>this.onClick()}
        onMouseDown={(e)=>this.onMouseDown(e)} onTouchStart={(e)=>this.onMouseDown(e)}
        style={{zIndex: this.state.activated?this.props.zIndex:''}}>
        <div className={css.selectArea} ref="area" style={{display: this.state.activated?'block':'none'}}></div>
      </div>
    )
  }

}
export default Select
