import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Icon from '../components/icon.js'

import css from '../../css/desktop/start-menu.css'

class ItemsColumnOne extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render(){
    return (
      <div className={css.column1}>
        <div>
          <div className={css.item+' '+css.itemC1} label={'Unfold'}><span className={css.iconCtC1}>
            <Icon className={'unfold'}/>
          </span></div>
        </div>
        <div>
          <div className={css.item+' '+css.itemC1} label={'Unfold'}><span className={css.iconCtC1}>
            <Icon className={'portrait sm'}/>
          </span></div>
          <div className={css.item+' '+css.itemC1} label={'Setting'}><span className={css.iconCtC1}>
            <Icon className={'setting sm'}/>
          </span></div>
          <div className={css.item+' '+css.itemC1} label={'Exit'}><span className={css.iconCtC1}>
            <Icon className={'shutdown sm'}/>
          </span></div>
        </div>
      </div>
    )
  }
}
class ItemsColumnTwo extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
    let list = this.props.appList
    let latestItems = []
    let oftenItems = []
    let numericItems = []
    let symbolicItems = []
    let alphabeticItems = []
    for (let i = 0; i < list.length; i++) {
      if(list[i].latest)
        latestItems.push(list[i])
      if(list[i].often)
        oftenItems.push(list[i])

      if(list[i].name[0].match(/[0-9]/))
        numericItems.push(list[i])
      else if(list[i].name[0].match(/[A-Za-z]/))
        alphabeticItems.push(list[i])
      else
        symbolicItems.push(list[i])

    }
    this.latestItems = latestItems
    this.oftenItems = oftenItems
    this.symbolicItems = symbolicItems
    numericItems.sort(function(a, b){
      return a.name > b.name
    })
    this.numericItems = numericItems
    alphabeticItems.sort(function(a, b){
      if(a.name==b.name) return 0
      return a.name < b.name ? -1 : 1
    })
    this.alphabeticItems = alphabeticItems
  }
  onScroll(){
    this.scrollbar.onScroll()
  }
  onMouseOver(){
    this.scrollbar.setUpScroll()
  }
  handleDragScroll(diff){
    let content = this.refs.content
    let h = this.scrollbar.getHeight()
    let H = content.scrollHeight
    content.scrollTop += diff*H/h
  }
  render(){
    return (
      <div className={css.column2} onScroll={(e)=>this.onScroll()} onMouseEnter={this.onMouseOver.bind(this)}>
        <Scrollbar returnSelf={(self)=>this.scrollbar=self} parent={this} toScroll={this.refs.toScroll}/>
        <div className={css.contentC2} ref='toScroll'>
          {
            this.latestItems.length>0 ?
            <Item key={'Latest_ZIJMJD8C'} title={'Latest'} index={'Latest_ZIJMJD8C'}/>  : ''
          }
          {
            this.latestItems.map((app, index)=>{
              return <Item key={index} app={app} index={index}/>
            })
          }
          {
            this.oftenItems.length>0 ?
            <Item key={'often_ZIJMJD8C'} title={'Often'} index={'often_ZIJMJD8C'}/>  : ''
          }
          {
            this.oftenItems.map((app, index)=>{
              return <Item key={index} app={app} index={index}/>
            })
          }
          {
            this.symbolicItems.length>0 ?
            <Item key={'_ZIJMJD8C_s'} title={'&'} index={'_ZIJMJD8C_s'}/>  : ''
          }
          {
            this.symbolicItems.map((app, index)=>{
              return <Item key={index} app={app} index={index}/>
            })
          }
          {
            this.numericItems.length>0 ?
            <Item key={'_ZIJMJD8C_n'} title={'#'} index={'_ZIJMJD8C_n'}/>  : ''
          }
          {
            this.numericItems.map((app, index)=>{
              return <Item key={index} app={app} index={index}/>
            })
          }
          {
            this.alphabeticItems.map((app, index)=>{
              return <Item key={index} app={app} index={index} last={this.alphabeticItems[index-1]} alpha={1}/>
            })
          }
        </div>
      </div>
    )
  }
}
class Item extends Component{
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
      display: 'block'
    }
    this.imgStyleNotReady = {
      display: 'none'
    }
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  render(){
    if(this.props.title){
      return(
        <div className={css.item+' '+css.itemC2+' '+css.sectionTitle} data-title={this.props.title}></div>
      )
    }else {
      let app = this.props.app
      return(
        <React.Fragment>
          {
            (()=>{
              if(!this.props.alpha) return
              let last_init_letter = this.props.last?this.props.last.name[0]:''
              let letter = app.name[0].toUpperCase()
              if(letter.match(/[A-Z]/)){
                if(letter!=last_init_letter){
                  last_init_letter = letter
                  return <Item key={last_init_letter+'_ZIJMJD8C'} title={last_init_letter} index={last_init_letter+'_ZIJMJD8C'}/>
                }
              }
              return
            })()
          }
          <div className={css.item+' '+css.itemC2} data-title={app.name}>
            <span className={css.iconCtC2} style={{backgroundColor:app.icon.background?app.icon.background:''}}>
            {
              app.icon.URL?
                (this.state.imgReady?'':<Icon className={"unknown stm"}/>)
              :
              <Icon className={app.icon.className}/>
            }
            {
              app.icon.URL?
              <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady}
                    src={app.icon.URL} onLoad={()=>this.imgOnload()}/> : ''
            }
          </span></div>
        </React.Fragment>
      )
    }
  }


}
class Scrollbar extends Component {
  constructor(props){
    super(props)
    this.btnClass = 'scroll_HX2MMYZN'
  }
  componentDidMount(){
    if(this.props.returnSelf)this.props.returnSelf(this)
  }
  setUpScroll(){
    let toScroll = this.props.toScroll
    let [u,m] = this.computeScroll(toScroll)
    this.refs.slotUp.style.height = u +'px'
    this.refs.slotMiddle.style.height = m +'px'
  }
  computeScroll(toScroll){
    let h = this.refs.getHeight.offsetHeight
    h = h>70?h:494
    let M = toScroll.clientHeight
    let U = toScroll.scrollTop
    let H = toScroll.scrollHeight
    let m = h*M/H
    m = m>70?m:70
    let u = U*(h-m)/(H-M)
    return [u,m]
  }
  onScroll(toScroll){
    if(!toScroll) toScroll = this.props.toScroll
    let [u,m] = this.computeScroll(toScroll)
    this.refs.slotUp.style.height = u +'px'
  }
  btnScroll(e,sign, stride){
    const toScroll = this.props.toScroll
    stride = stride || toScroll.clientHeight
    let source = e.target
    while (!source.className.match(this.btnClass)) {
      source = source.parentNode
      if(!source) return
    }
    toScroll.scrollTop += sign*stride
    let hover = true
    const enter = ()=>{
      if(hover===false) {
        hover = true
        keepScrolling()
      }
    }
    const leave = ()=>{
      hover = false
    }
    const keepScrolling = ()=>{
      if(hover){
        toScroll.scrollTop += sign*stride *0.5
        setTimeout(keepScrolling,50)
      }
    }
    setTimeout(()=>{
      if(hover) keepScrolling()
    },600)
    const middle = this.refs.slotMiddle
    middle.addEventListener('mouseenter',leave,false)
    source.addEventListener('mouseenter',enter,false)
    source.addEventListener('mouseleave',leave,false)
    const docUp = ()=>{
      hover = false
      middle.removeEventListener('mouseenter',leave,false)
      source.removeEventListener('mouseenter',enter,false)
      source.removeEventListener('mouseleave',leave,false)
      document.removeEventListener('mouseup',docUp,false)
    }
    document.addEventListener('mouseup',docUp,false)
  }
  onDrag(e){
    if (e.button == 2) return
    let y = e.clientY || e.changedTouches[0].clientY
    let toScroll = this.props.toScroll
    let begin_top = toScroll.scrollTop
    this.refs.element.className += ' '+css.dragging
    const move = (e)=>{
      let my = e.clientY
      if(Math.abs(my-y)<4) return
      toScroll.scrollTop = begin_top + (my-y)*toScroll.scrollHeight/this.refs.getHeight.offsetHeight
      this.onScroll(toScroll)
    }
    const up = (e)=>{
      document.removeEventListener('mousemove', move, false);
      document.removeEventListener('mouseup', up, false);
      document.removeEventListener("touchmove", move, false);
      document.removeEventListener("touchend", up, false);
      document.removeEventListener("touchcancel", up, false);
      let ele = this.refs.element
      ele.className = ele.className.replace(new RegExp(css.dragging, 'g'), '')
    }
    document.addEventListener('mousemove', move, false);
    document.addEventListener('mouseup', up, false);
    document.addEventListener("touchmove", move, false);
    document.addEventListener("touchend", up, false);
    document.addEventListener("touchcancel", up, false);
  }
  render(){
    return(
      <div className={css.scrollbar} ref='element'>
        <div className={css.scrollBtn+' '+this.btnClass} onMouseDown={(e)=>this.btnScroll(e,-1, 20)}>
                    <Icon className={'angle up sm '+css.scrollAngle}/></div>
        <div className={css.scrollControl} ref='getHeight'>
          <div className={css.slotUp+' '+this.btnClass} ref='slotUp' onMouseDown={(e)=>this.btnScroll(e,-1)}></div>
          <div className={css.slotMiddle} ref='slotMiddle' onMouseDown={(e)=>{this.onDrag(e)}}></div>
          <div className={css.slotDown+' '+this.btnClass} onMouseDown={(e)=>this.btnScroll(e,1)}></div>
        </div>
        <div className={css.scrollBtn+' '+this.btnClass} onMouseDown={(e)=>this.btnScroll(e,1, 20)}>
                    <Icon className={'angle down sm '+css.scrollAngle}/></div>
      </div>
    )
  }
}
class Box extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render(){
    return
  }

}

export {ItemsColumnOne, ItemsColumnTwo}
