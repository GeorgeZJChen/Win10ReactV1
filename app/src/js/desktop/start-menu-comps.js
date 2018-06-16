import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Utils from '../components/Utils.js'
import Icon from '../components/icon.js'

import System from '../system/system.js'

import css from '../../css/desktop/start-menu.css'

class ItemsColumnOne extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  shutdown(){
    System.desktop.closeStartMenu()
    System.lock()
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
          <div className={css.item+' '+css.itemC1} label={'Exit'}
            onClick={()=>this.shutdown()}
          ><span className={css.iconCtC1}>
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
    this.refs.scrollbar.onScroll()
  }
  onMouseEnter(){
    this.refs.scrollbar.setUpScroll(this.refs.toScroll)
  }

  render(){
    return (
      <div className={css.column2} onScroll={(e)=>this.onScroll()} onMouseEnter={this.onMouseEnter.bind(this)} onTouchStart={(e)=>this.onMouseEnter()}>
        <Scrollbar ref='scrollbar' parent={this}/>
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
class ItemsColumnThree extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
    this.columns()
  }
  onScroll(){
    this.refs.scrollbar.onScroll()
  }
  onMouseEnter(ms){
    this.refs.scrollbar.setUpScroll(this.refs.toScroll)
  }
  columns(){
    const groups = this.props.boxGroups
    let column1 = []
    let column2 = []
    column1.depth = column2.depth = 0
    for (let i = 0; i < groups.length; i++) {
      let boxes = groups[i].boxes
      let depth = 1
      let layer_size = 0
      let was_box1 = 0
      let layers = []
      let layer = []
      for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i]
        let size = box.size
        if(12-layer_size >= size){
          if(was_box1){
            if(size == 1){
              layer_size += 1
              layer[layer.length-1].push(box)
            }
            else{
              was_box1 = 0
              let supp = 4 - layer_size%4
              layer_size += size + supp
              layer.push(box)
            }
          }else{
            if(size == 1){
              was_box1 = 1
              layer.push([box])
            }else{
              layer.push(box)
            }
            layer_size += size
          }
          if(layer_size==12){
            depth ++
            layers.push(layer)
            layer_size = 0
            layer = []
          }else if(i==boxes.length-1){
            layers.push(layer)
          }
        }else{
          depth++
          layers.push(layer)
          layer_size = size
          layer = []
          if(size==1){
            was_box1 = 1
            layer.push([box])
          }else{
            was_box1 = 0
            layer.push(box)
          }
          if(i==boxes.length-1){
            layers.push(layer)
          }
        }
      }
      groups[i].layers = layers
      if(column1.depth<=column2.depth){
        column1.push(groups[i])
        column1.depth += depth
      }else {
        column2.push(groups[i])
        column2.depth += depth
      }
    }
    let groups1 =  column1.map((group, index)=>{
      return <BoxGroup data={group} key={'groups1'+index}/>
    })
    let groups2 =  column2.map((group, index)=>{
      return <BoxGroup data={group} key={'groups2'+index}/>
    })
    this.columns = [
      <div className={css.c3Column} key='column1'>{groups1}</div>,
      <div className={css.c3Column} key='column2'>{groups2}</div>,
    ]
  }
  render(){
    return (
      <div className={css.column3} onScroll={(e)=>this.onScroll()} onMouseEnter={(e)=>this.onMouseEnter()} onTouchStart={(e)=>this.onMouseEnter()}>
        <Scrollbar ref='scrollbar' parent={this}/>
        <div className={css.contentC3} ref={'toScroll'}>
          {this.columns}
        </div>
      </div>
    )
  }
}
class BoxGroup extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
    this.boxes = this.parseLayers(this.props.data.layers)
  }
  parseLayers(layers){
    let boxes = []
    for (let i = 0; i < layers.length; i++) {
      let layer = layers[i]
      let layer_size = 0
      for (let j = 0; j < layer.length; j++) {
        let boxx = layer[j]
        if(boxx instanceof Array){
          let box1s = []
          for (let k = 0; k < boxx.length; k++) {
            box1s.push(
              <div className={css.box+' '+css['box1']} key={j+'_box1_'+k+''+i}>
                <Box data={boxx[k]}/>
              </div>
            )
          }
          while(box1s.length<4){
            box1s.push(
              <div className={css.box+' '+css['box1']+' '+css.boxNull} key={j+'_box1_null_'+box1s.length+''+i}></div>
            )
          }
          boxes.push(
            <div className={css.box+' '+css['box4']+' '+css.boxCt} key={j+'_box1_ct_'+i}>
              <div className={css.boxR}>
                {box1s}
              </div>
            </div>
          )
          layer_size += 4
        }else{
          if(boxx.size==4){
            boxes.push(
              <div className={css.box+' '+css['box4']} data-title={boxx.name} key={j+'_box4_'+i}>
                <Box data={boxx}/>
              </div>
            )
            layer_size += 4
          }else if (boxx.size==8) {
            boxes.push(
              <div className={css.box+' '+css['box8']} key={j+'_box8_'+i}>
                <div className={css.boxR} data-title={boxx.name}>
                  <Box data={boxx}/>
                </div>
                <div className={css.boxH}></div>
                <div className={css.boxH}></div>
              </div>
            )
            layer_size += 8
          }
        }
      }
      let _key = 0
      while(layer_size<12){
        boxes.push(
          <div className={css.box+' '+css['box4']+' '+css.boxNull} key={_key+++'_box_null_'+i}></div>
        )
        layer_size += 4
      }
    }
    return boxes
  }
  render(){
    return (
      <div className={css.boxGroup}>
        <div className={css.groupTitle}>{this.props.data.name}</div>
        <div className={css.groupContent}>
          {this.boxes}
        </div>
      </div>
    )
  }

}
class Box extends Component{
  constructor(props){
    super(props)
    this.state = {
      imgReady: 0
    }
    this.imgStyle ={
      width: 'auto',
      maxHeight: '65%',
      maxWidth: '80%',
      position: 'relative',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'block',
      pointerEvents: 'none'
    }
    if(this.props.data.icon&&this.props.data.icon.small){
      this.imgStyle.height = '35%'
      this.imgStyle.height = '38%'
    }
    this.imgStyleNotReady = {
      display: 'none'
    }
    if(this.props.data.faces){
      this.createAnimation()
    }
    if(this.props.data.icon&&this.props.data.icon.text)
      setTimeout(()=>{
        this.refs.element.parentNode.style.color = this.props.data.icon.text
      }, 10)
    this.onClick = this.onClick.bind(this)
  }
  onClick(){
    System.addTask(this.props.data.id, this.props.data.query ,this.props.data.name)
    System.desktop.closeStartMenu()
  }
  createAnimation(){
    let faces = this.props.data.faces
    if(!(faces.length>0)) return
    const default_transition = this.props.data.roll?0.5:1.5
    const default_display = this.props.data.roll?8:5
    let length = faces.length
    let transition_time = this.props.data.transition?this.props.data.transition:default_transition
    let display_time = this.props.data.display?this.props.data.display:default_display
    let animation_name = this.props.data.id + '_box_animation_roll'
    transition_time += transition_time*(Math.random()-0.5)/5
    let stoch_delay = Math.random()*Math.min(display_time, 5) - transition_time -display_time*0.8
    let whole_time = (display_time+transition_time)*length
    for (let i = 0; i < faces.length; i++) {
      faces[i].animation = {}
      faces[i].animation.delay = i*(display_time +transition_time) +stoch_delay +'s'
      faces[i].animation.name = animation_name
      faces[i].animation.time = whole_time + 's'
      if(this.props.data.slide)
        faces[i].animation.timingFunction = 'cubic-bezier(0.85, 0, 0.15, 1)'
    }
    let p = display_time/whole_time *100
    let tp = transition_time/whole_time *100
    if(this.props.data.roll)
      Utils.addKeyFrames(animation_name,
        '0%{transform:rotateX(-120deg);visibility:visible;}'+
        tp+'%{transform:rotateX(0);visibility:visible;}'+
        (p+tp)+'%{transform:rotateX(0);visibility:visible;}'+
        (p+tp+tp)+'%{transform:rotateX(120deg);visibility:visible;}'+
        (p+tp+tp+0.01)+'%{transform:rotateX(120deg);visibility:hidden;}'+
        '99.999%{transform:rotateX(120deg);visibility:hidden;}'+
        '100%{transform:rotateX(120deg);visibility:visible;}'
      )
    else
      Utils.addKeyFrames(animation_name,
        '0%{top:100.1%;visibility:visible;z-index:5;}'+
        tp+'%{top:0;visibility:visible;z-index:4;}'+
        (p+tp)+'%{top:0;visibility:visible;z-index:4;}'+
        (p+tp+tp)+'%{top:0;visibility:visible;z-index:3;}'+
        (p+tp+tp+0.01)+'%{top:0%;visibility:visible;z-index:2}'+
        '99.9%{top:0%;;visibility:visible;z-index:1}'+
        '99.999%{top:100.1%;;visibility:hidden;z-index:1}'+
        '100%{top:100.1%;;visibility:visible;z-index:5;}'
      )
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  render(){
    let style
    if(!this.props.data.faces){
      style = {}
      if(this.props.data.icon.background) style.backgroundColor = this.props.data.icon.background
      if(this.props.data.icon.backgroundURL) style.backgroundImage = 'url('+this.props.data.icon.backgroundURL+')'
    }
    return (
      <div className={css.boxContent+' '+(this.props.data.faces?css.boxAnimation:' ')
            +' '+(this.props.data.roll?css.box3D:'')} ref='element' style={style}
            onClick={this.onClick}
            >
        {
          this.props.data.faces?this.props.data.faces.map((face, index)=>{
            if(index==0){
              return <BoxFace face={face} key={index} icon={this.props.data.icon} size={this.props.data.size}/>
            }
            return <BoxFace face={face} key={index} size={this.props.data.size}/>
          })
          :
          (
            this.props.data.icon.URL?
              [
                <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady}
                src={this.props.data.icon.URL} onLoad={()=>this.imgOnload()} key='uWA13NQJIMG'/>
                ,
                this.state.imgReady?'':<Icon className={"unknown box"+this.props.data.size} key='NIWA13NQJ'/>
              ]
            :
            <Icon className={this.props.data.icon.className+' box'+this.props.data.size}/>
          )

        }
      </div>
    )
  }
}
class BoxFace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgReady: 0
    }
    this.imgStyle ={
      width: 'auto',
      maxHeight: '65%',
      maxWidth: '80%',
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
    this.imgStyleFace = {
      width: 'auto',
      height: '100.1%',
      position: 'relative',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'block',
      pointerEvents: 'none',
      zIndex: -1,
      overflow: 'hidden'
    }
    if(this.props.size == 8){
      this.imgStyleFace.width = '100.1%'
      this.imgStyleFace.height = 'auto'
    }
    if(this.props.face.fitHeight){
      this.imgStyleFace.width = 'auto'
      this.imgStyleFace.height = '100.1%'
    }
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  render(){
    let animation = this.props.face.animation
    let style = {}
    if(animation){
      style = {
        animationName:animation.name,
        animationDuration:animation.time,
        animationDelay:animation.delay,
      }
      if(animation.timingFunction)
        style.animationTimingFunction = animation.timingFunction
    }
    if(this.props.icon){
      if(this.props.icon.background) style.backgroundColor = this.props.icon.background
      if(this.props.icon.backgroundURL) style.backgroundImage = 'url('+this.props.icon.backgroundURL+')'
      return(
        <div className={css.boxFace}
        style={style}>
          {
            this.props.icon.URL?
            [
              <img style={this.state.imgReady?this.imgStyle:this.imgStyleNotReady}
              src={this.props.icon.URL} onLoad={()=>this.imgOnload()} key='1DgALBRVIMG'/>
              ,
              this.state.imgReady?'':<Icon className={"unknown box"+this.props.size} key='1DgALBRV'/>
            ]
            :
            <Icon className={this.props.icon.className+' box'+this.props.size}/>
          }
          </div>
        )
    }
    else{
      if(this.props.face.background) style.backgroundColor = this.props.face.background
      return (
        <div className={css.boxFace}
        style={style}>
        {
          [
            <img style={this.state.imgReady?this.imgStyleFace:this.imgStyleNotReady}
            src={this.props.face.URL} onLoad={()=>this.imgOnload()} key='1DgALBRVIMG2'/>
            ,
            this.state.imgReady?'':<Icon className={"unknown box"+this.props.size} key='1DgALBRV2'/>
          ]
        }
        </div>
      )
    }
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
      maxHeight: '70%',
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
    this.onClick = this.onClick.bind(this)
  }
  onClick(){
    if(this.props.app && this.props.app.id){
      System.addTask(this.props.app.id, this.props.app.query ,this.props.app.name)
      System.desktop.closeStartMenu()
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
          <div className={css.item+' '+css.itemC2} data-title={app.name} onClick={this.onClick}>
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
  setUpScroll(toScroll){
    this.toScroll = toScroll
    let [u,m] = this.computeScroll(this.props.parent.refs.toScroll)
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
    if(!toScroll&&!this.toScroll) this.setUpScroll(this.props.parent.refs.toScroll)
    toScroll = toScroll || this.toScroll
    let [u,m] = this.computeScroll(toScroll)
    this.refs.slotUp.style.height = u +'px'
    this.refs.slotMiddle.style.height = m +'px'
  }
  btnScroll(e,sign, stride){
    const toScroll = this.toScroll
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
    let toScroll = this.toScroll
    if(!toScroll) return
    let begin_top = toScroll.scrollTop
    this.refs.element.className += ' '+css.dragging
    const move = (e)=>{
      let my = e.clientY || e.changedTouches[0].clientY
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
          <div className={css.slotMiddle} ref='slotMiddle' onMouseDown={(e)=>{this.onDrag(e)}} onTouchStart={(e)=>{this.onDrag(e)}}></div>
          <div className={css.slotDown+' '+this.btnClass} onMouseDown={(e)=>this.btnScroll(e,1)}></div>
        </div>
        <div className={css.scrollBtn+' '+this.btnClass} onMouseDown={(e)=>this.btnScroll(e,1, 20)}>
                    <Icon className={'angle down sm '+css.scrollAngle}/></div>
      </div>
    )
  }
}

export {ItemsColumnOne, ItemsColumnTwo, ItemsColumnThree}
