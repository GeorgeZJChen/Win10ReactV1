import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Utils from './Utils.js'
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


    // setTimeout(()=>{
    //   // const toSelectItemsCt = this.props.container.getToSelectItemsCt()
    //   // toSelectItemsCt.addEventListener('mousedown', ()=>{
    //   //   this.__mousedown_on_items_to_select_or_this__ = 1
    //   // })
    //   // toSelectItemsCt.addEventListener('touchstart', ()=>{
    //   //   this.__mousedown_on_items_to_select_or_this__ = 1
    //   // })
    //   // document.addEventListener('mousedown', ()=>{
    //   //   if(!this.__mousedown_on_items_to_select_or_this__)
    //   //     this.props.deselect()
    //   //   delete this.__mousedown_on_items_to_select_or_this__
    //   // })
    //   // document.addEventListener('touchstart', ()=>{
    //   //   if(!this.__mousedown_on_items_to_select_or_this__)
    //   //     this.props.deselect()
    //   //   delete this.__mousedown_on_items_to_select_or_this__
    //   // })
    //   // document.addEventListener('mouseup',()=>{
    //   //
    //   // })
    // },50)
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
    let start_top
    let start_left
    let container
    let containerPos
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
        container = this.props.container.refs.element
        containerPos = Utils.computePosition(container)
        start_top = y - containerPos[1] + container.scrollTop
        start_left = x - containerPos[0] + container.scrollLeft
      }
      let end_top = my - containerPos[1] + container.scrollTop
      let end_left = mx - containerPos[0] + container.scrollLeft

      area.style.top = Math.min(start_top, end_top) +'px'
      area.style.left = Math.min(start_left, end_left) +'px'
      area.style.width = Math.abs(start_left - end_left) +'px'
      area.style.height = Math.abs(start_top - end_top) +'px'

      this.props.select(start_left, start_top, end_left, end_top)
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
        setTimeout(()=>{
          delete this.__select_moved__
        },20)
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
        {
          this.state.activated?
          <style>
            {'*{pointer-events:none}.'+
            this.props.container.refs.element.className+'{pointer-events:initial}'}
          </style>
          :''
        }
      </div>
    )
  }

}
export default Select
