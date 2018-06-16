import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import Utils from '../components/Utils.js'
import Events from '../components/event.js'
import Select from '../components/select.js'
import Icon from '../components/icon.js'
import Task from '../system/task.js'

import css from '../../css/handler/A896YGSLCOF8.css'

class A896YGSLCOF8 {
  constructor(query, name){
    this.id = 'A896YGSLCOF8'

    this.fileItems = []

    System.addSystemTask(new Task({
      name: name || 'File Explorer',
      id: this.id,
      query: query,
      window: {
        width: 600,
        height: 430,
        windowIcon: {
          className: "folder sm"
        }
      },
      taskbarIcon: {
        className: "file-explorer"
      },
      callback: (win)=>{
        win.onDrop = (items)=>{
          let i = 0
          items.forEach((item)=>{
            let data = item.props.data
            this.fileItems.push(data)
          })
          this.renderItems()
        }
        win.afterResize = ()=>{
          this.FileItems.render()
        }
        win.onClose = ()=>{
          this.FileItems.unmount()
        }
        ReactDOM.render(<FileItems items={this.fileItems} win={win} parent={this}/>, win.refs.content)
        win.load()
      }
    }))
  }
  renderItems(){
    this.FileItems.triggerRender()
  }
}
class FileItems extends Component{
  constructor(props){
    super(props)
    this.selected = new Set()
    this.checked = null
    this.layout={
      interval : [112, 128],
      row: 0,
      column: 0
    }
    this.state = {
      renderFlag: 0
    }
    this.items = []
    props.parent.FileItems = this
  }
  unmount(){
    ReactDOM.unmountComponentAtNode(this.props.win.refs.content)
  }
  triggerRender(){
    this.setState((prevState)=>{
      return {
        renderFlag: ~prevState.renderFlag
      }
    })
  }
  getToSelectItemsCt(){
    return this.refs.items
  }
  select(x, y, sx, sy){
    this.layout.column = Math.floor(this.refs.items.offsetWidth/this.layout.interval[0])
    const items = this.refs.items.children
    let column = this.layout.column
    this.layout.row = Math.ceil(items.length/column)
    const min = Math.min(y,sy)
    const max = Math.max(y,sy)
    const top_bottom_of_nth_row = (n)=>{
      let item1 = items[(n-1)*column]
      let item2 = items[(n)*column]
      if(item1&&item2)
        return [item1.offsetTop, item2.offsetTop-1]
      else{
        let t = item1.offsetTop
        return [t, t+this.layout.interval[1]-16]
      }
    }
    const get_one_selected_row = (row, down, up)=>{
      let pos = top_bottom_of_nth_row(row)
      if(pos){
        if(pos[1]<min){
          if(row==down) return row
          return get_one_selected_row(Math.ceil((row+up)/2), row, up)
        }else if (pos[0]>max) {
          if(row==up) return row
          return get_one_selected_row(Math.ceil((row+1)/2), down, row)
        }else {
          return row
        }
      }
    }
    let a_row = get_one_selected_row(Math.ceil(this.layout.row/2), 1, this.layout.row)
    if(!a_row) return
    const selected_rows = [a_row,a_row]
    do{
      let row = selected_rows[0]-1
      if(row<1) break
      let pos = top_bottom_of_nth_row(row)
      if(!(pos[0]>max||pos[1]<min))
        selected_rows[0] = row
      else break
    }while(1)
    do{
      let row = selected_rows[1]+1
      if(row>this.layout.row) break
      let pos = top_bottom_of_nth_row(row)
      if(!(pos[0]>max||pos[1]<min))
        selected_rows[1] = row
      else break
    }while(1)
    const selected_columns = [0,0]
    const min_c = Math.min(x,sx)
    const max_c = Math.max(x,sx)
    const left_right_of_nth_column = (n)=>{
      n = (n-1) % this.layout.column
      return [this.layout.interval[0]*n+5, this.layout.interval[0]*(n+1)-5]
    }
    for (let i = 1; i <= this.layout.column; i++) {
      let pos = left_right_of_nth_column(i)
      if(!(pos[0]>max_c||pos[1]<min_c)){
        if(selected_columns[0]==0)
          selected_columns[0] = i
        selected_columns[1] = i
      }
    }
    const new_selected = new Set()
    if(selected_columns[0]*selected_columns[1]*selected_rows[0]*selected_rows[1]!=0){
      for (let i = selected_columns[0]; i <= selected_columns[1]; i++) {
        for (let j = selected_rows[0]; j <= selected_rows[1]; j++) {
          let n = (j-1)*column+i-1
          let item = items[n]
          if(item){
            if(!(item.offsetTop>max||item.offsetTop+item.offsetHeight<min)){
              let Item = this.items[n]
              Item.select()
              new_selected.add(Item)
            }
          }
        }
      }
    }
    this.selected.forEach((item)=>{
      if(!new_selected.has(item)){
        item.deselect()
      }
    })
  }
  onDrag(e, target){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)

    const ctid = 'ct_v0rpg10b'
    const tagid = 'tag_v0rpg10b'

    let ondroppable = false
    const Tag = {
      show: 0,
      name: '',
      action: ''
    }
    const onOverListener = (_target)=>{
      if(_target==target || this.selected.has(_target) || _target==this.props.win) return

      if(_target.hoverTag){
        Tag.show = 1
        Tag.name = _target.hoverTag.name
        Tag.action = _target.hoverTag.action
      }

      ondroppable = true
    }
    const onDropListener = (_target)=>{
      if(_target==target || this.selected.has(_target) || _target==this.props.win) return
      if(_target && _target.onDrop) _target._onDrop(this.selected)
    }
    const onLeaveListener = (_target)=>{
      if(_target==target || this.selected.has(_target) || _target==this.props.win) return
      Tag.show = 0
      Tag.name = ''
      Tag.action = ''
      ondroppable = false
    }
    const containerPos = Utils.computePosition(this.refs.element)
    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        target.dragged = true
        const ct = document.createElement('div')
        ct.id = ctid
        ct.className = css.copiesCt

        ct.style.pointerEvents = 'none'
        ct.style.top = my +'px'
        ct.style.left = mx +'px'

        const tag = document.createElement('div')
        tag.id = tagid
        tag.className = css.draggingTag
        tag.style.top = 103 +'px'
        tag.style.left = 65 +'px'
        tag.style.visibility = 'hidden'
        tag.innerHTML = "<p class='"+ css.draggingTagText +"'>"+
        "<span class='"+ css.draggingTagAction +"' id='"+tagid+"_action'></span>&nbsp"+
        "<span class='"+ css.draggingTagName +"' id='"+tagid+"_name'></span></p>"

        const copies = document.createElement('div')
        copies.className = css.copies
        this.selected.forEach((item)=>{
          let copyIcon = item.refs.element.querySelector('.'+css.fileIconCt).cloneNode(true)
          copyIcon.className = css.copyIcon

          if(item == target){
            copyIcon.style.zIndex = 1
          }
          copies.appendChild(copyIcon)
        })

        const count = document.createElement('div')
        count.className = css.countCopies
        let size = this.selected.size
        count.innerHTML = size>1?size:''
        ct.appendChild(tag)
        ct.appendChild(copies)
        ct.appendChild(count)
        document.body.appendChild(ct)

        Events.on(Events.names.being_dragged_items_onenter, onOverListener)
        Events.on(Events.names.being_dragged_items_ondrop, onDropListener)
        Events.on(Events.names.being_dragged_items_onleave, onLeaveListener)
      }else{
        const ct = document.getElementById(ctid)
        ct.style.top = my +'px'
        ct.style.left = mx +'px'

        if(ondroppable){
          if(Tag.show){
            document.getElementById(tagid+'_action').innerHTML = Tag.action
            document.getElementById(tagid+'_name').innerHTML = Tag.name
            let tagNode = document.getElementById(tagid)
            tagNode.style.visibility = 'visible'
            if(mx+15>document.body.clientWidth-tagNode.offsetWidth){
              tagNode.style.left = ''
              tagNode.style.right = '55px'
            }else {
              tagNode.style.right = ''
              tagNode.style.left = '65px'
            }
          }
        }else{
          document.getElementById(tagid).style.visibility = 'hidden'
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
        const ct = document.getElementById(ctid)
        if(ct) ct.parentNode.removeChild(ct)
        setTimeout(()=>{
          delete target.dragged
        },50)
        Events.removeListener(Events.names.being_dragged_items_onenter, onOverListener)
        Events.removeListener(Events.names.being_dragged_items_ondrop, onDropListener)
        Events.removeListener(Events.names.being_dragged_items_onleave, onLeaveListener)

        if(!ondroppable){

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



  deselect(){
    this.selected.forEach((item)=>{
      item.deselect()
    })
  }
  render(){
    if(this.refs.select&&this.refs.select.refs.element){
      setTimeout(()=>{
        this.refs.select.refs.element.style.height = this.refs.element.scrollHeight +'px'
      },50)
    }
    return(
      <div className={css.container} ref='element'>
        {
          this.props.items.length==0?
            <p style={{fontSize: 30,color: '#aaa', textAlign: 'center', padding: '0 12px'}}>
            You can drop items here
              {
                Utils.isMobile?
                " if open this with PC browsers":''
              }
            </p>
            :
            (
              <React.Fragment>
              <Select select={(x, y, sx, sy)=>this.select(x, y, sx, sy)} container={this}
              deselect={()=>this.deselect()} zIndex={104} ref='select'/>
              <div className={css.itemsCt} ref='items'>
              {
                this.props.items.map((data, i)=>{
                  return <FileItem data={data} win={this.props.win} parent={this} key={i}/>
                })
              }
              </div>
              </React.Fragment>
            )
        }
      </div>
    )
  }
}
class FileItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      iconReady: 0
    }
    this.selected = 0
    this.iconOnload = this.iconOnload.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)
    this.onClick = this.onClick.bind(this)

    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)

    this.props.parent.items.push(this)
    this.hoverTag = {
      name: this.props.data.name,
      action: "Move to"
    }
  }
  onMouseOver(e){
    Events.emit(Events.names.being_dragged_items_onenter, this)
  }
  onMouseLeave(e){
    Events.emit(Events.names.being_dragged_items_onleave, this)
  }
  onMouseUp(e){
    Events.emit(Events.names.being_dragged_items_ondrop, this)
  }
  iconOnload(){
    this.setState({
      iconReady: 1
    })
  }
  onDoubleClick(){
    System.addTask(this.props.data.id, this.props.data.query, this.props.data.name)
  }
  onClick(e){
    if(this.selected&&!this.dragged){
      delete this.dragged
      this.props.parent.deselect()
      this.check()
    }
  }
  onMouseDown(e){
    if(!this.selected){
      this.props.parent.deselect()
    }
    this.select()
    this.props.parent.onDrag(e, this)
  }
  select(){
    if(!this.selected){
      this.refs.element.className += ' '+css.selected
      this.props.parent.selected.add(this)
      this.selected = 1
    }
  }
  deselect(){
    if(this.selected){
      let ele = this.refs.element
      ele.className = ele.className.replace(new RegExp(css.selected, 'g'), '')
      this.selected = 0
      this.props.parent.selected.delete(this)
    }
    this.uncheck()
  }
  check(){
    let lastChecked = this.props.parent.checked
    if(lastChecked==this) return
    if(lastChecked) lastChecked.uncheck()
    this.refs.input.checked = true
    this.props.parent.checked = this
    this.select()
  }
  uncheck(){
    this.refs.input.checked = false
    let lastChecked = this.props.parent.checked
    if(lastChecked!=this) return
    this.props.parent.checked = null
    this.deselect()
  }
  render(){
    const icon = this.props.data.icon
    let className = 'unknown'
    if(icon.className)
      className = icon.className.replace(/\bdesktop\b/g, '')
    return(
      <div className={css.fileItem} ref='element'
        onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}
        onDoubleClick={this.onDoubleClick} onClick={this.onClick}
        onMouseOver = {this.onMouseOver} onMouseUp = {this.onMouseUp} onMouseLeave = {this.onMouseLeave}
        >
        <div className={css.fileIconCt}>
        {
          icon.URL?
          (
            <React.Fragment>
              <img src={icon.URL} className={css.iconImg}
              onLoad={this.iconOnload} style={{display:this.state.iconReady?'':'none'}}/>
              {this.state.iconReady? '' : <Icon className={"unknown big"}/>}
            </React.Fragment>
          )
          :
          <Icon className={className+' big'}/>
        }
        </div>
        <input name={this.props.win.wid+'files'} className={css.itemCheck} type="radio" ref='input'/>
        <div className={css.fileBg}></div>
        <div className={css.fileName} data-title={this.props.data.name}></div>
      </div>
    )
  }
}

export default A896YGSLCOF8
