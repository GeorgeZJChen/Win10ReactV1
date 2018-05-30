import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Utils from '../components/Utils.js'

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
  onMouseEnter(){
    this.scrollbar.setUpScroll(this.refs.toScroll)
  }
  render(){
    return (
      <div className={css.column2} onScroll={(e)=>this.onScroll()} onMouseEnter={this.onMouseEnter.bind(this)}>
        <Scrollbar returnSelf={(self)=>this.scrollbar=self} parent={this}/>
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
    this.scrollbar.onScroll()
  }
  onMouseEnter(){
    this.scrollbar.setUpScroll(this.refs.toScroll)
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
      <div className={css.column3} onScroll={(e)=>this.onScroll()} onMouseEnter={(e)=>this.onMouseEnter()}>
        <Scrollbar returnSelf={(self)=>this.scrollbar=self} parent={this}/>
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
      height: '65%',
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
    if(this.props.data.faces){
      if(this.props.data.roll)
        this.createRollAnimation()
      else
        this.createSlideAnimation()
    }
    if(this.props.data.icon.text)
      setTimeout(()=>{
        this.refs.self.parentNode.style.color = this.props.data.icon.text
      }, 10)
  }
  createRollAnimation(){
    let faces = this.props.data.faces
    if(!(faces.length>1)) return
    const length = faces.length
    const transition_time = this.props.data.transition?this.props.data.transition:0.5
    const display_time = this.props.data.display?this.props.data.display:8
    const animation_name = this.props.data.id + '_box_animation'
    let whole_time = (display_time+transition_time)*length
    for (let i = 0; i < faces.length; i++) {
      faces[i].animation = {}
      faces[i].animation.delay = i*display_time +i*transition_time +'s'
      faces[i].animation.name = animation_name
      faces[i].animation.time = whole_time + 's'
    }
    let p = display_time/whole_time *100
    let tp = transition_time/whole_time *100
    Utils.addKeyFrames(animation_name,
      '0%{transform:rotateX(-120deg);visibility:visible;}'+
      tp+'%{transform:rotateX(0);visibility:visible;}'+
      (p+tp)+'%{transform:rotateX(0);visibility:visible;}'+
      (p+tp+tp)+'%{transform:rotateX(120deg);visibility:visible;}'+
      (p+tp+tp+0.001)+'%{transform:rotateX(120deg);visibility:hidden;}'+
      '99.999%{transform:rotateX(120deg);visibility:hidden;}'+
      '100%{transform:rotateX(120deg);visibility:visible;}'
    )

  }
  createSlideAnimation(){

  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  render(){
    return (
      <div className={css.boxContent+' '+(this.props.data.roll?css.box3D:'')} ref='self'
            style={!this.props.data.faces?
                {backgroundColor:this.props.data.icon.background}:{}}>
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
      height: '65%',
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
      width: '100%',
      position: 'relative',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'block',
      pointerEvents: 'none',
      zIndex: -1,
      overflow: 'hidden'
    }
  }
  imgOnload(){
    this.setState({
      imgReady: 1
    })
  }
  render(){
    let animation = this.props.face.animation
    if(this.props.icon)
      return(
        <div className={css.boxFace}
            style={{animationName:animation.name,animationDuration:animation.time,
              animationDelay:animation.delay, backgroundColor:this.props.icon.background}}>
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
    else
    return (
      <div className={css.boxFace}
        style={{animationName:animation.name,
          animationDuration:animation.time,
          animationDelay:animation.delay}}>
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
class Item extends Component{
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
  setUpScroll(toScroll){
    this.toScroll = toScroll
    let [u,m] = this.computeScroll(this.toScroll)
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

export {ItemsColumnOne, ItemsColumnTwo, ItemsColumnThree}