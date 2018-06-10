import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import System from '../system/system.js'

import Icon from '../components/icon.js'
import ut from '../components/Utils.js'
import Events from '../components/event.js'

import css from '../../css/desktop/desktop-container.css'


class Items extends Component {

  constructor(props){
    super(props)

    this.state = {
      initiated : 0,
      items: []
    }
  }
  init(data){
    if(this.state.initiated) return
    this.groupInfo = {
      name: '',
      parent: this,
      focused: null,
      checked: null,
      interval: [0, 0],
      column: -1,
      row: -1,
      selectedColumns: [-1, -1], //[left column number, right column number].
      itemWidth: 0,
      lattice: [], //lattice[column][row] = item
      outcasts: [],
      selected: new Set()
    }
    if(this.props.container.constructor.name == 'DesktopContainer'){
      this.groupInfo.itemWidth = 72
      this.groupInfo.interval = [76, 110]
      this.groupInfo.name = "desktop"
    }
    this.lattice_init()
    window.addEventListener('resize', ()=>{
      const resize = ()=>{
        this.lattice_reset()
      }
      clearTimeout(resize)
      setTimeout(resize, 300)
    })
    this.setState({
      initiated : 1,
      items: data.items
    })
  }
  render(){
    return (

      <div className={css.itemsCt} ref='element'>
        {
          this.state.initiated?
            this.state.items.map((item, index)=>{
              return <Item data={item} key={index} groupInfo={this.groupInfo} parent={this}/>
            })
            :
            ''
        }
      </div>
    )
  }

  lattice_init(){
    let p = this.groupInfo
    let container = this.props.container.refs.element
    let containerHeight = container.offsetHeight
    let containerWidth = container.offsetWidth
    let row = Math.floor(containerHeight/p.interval[1])
    let column = Math.floor(containerWidth/p.interval[0])
    p.lattice = new Array(column)
    for (let i = 0; i < column; i++) {
      p.lattice[i] = new Array(row)
    }
    p.column = column
    p.row = row
  }
  lattice_reset(){
    if(!this.state.initiated) return
    let p = this.groupInfo
    let container = this.props.container.refs.element
    let containerHeight = container.offsetHeight
    let containerWidth = container.offsetWidth
    let row = Math.floor(containerHeight/p.interval[1])
    let column = Math.floor(containerWidth/p.interval[0])
    if(row == p.row && column == p.column) return  //nothing changes
    let added_slots = row*column-p.row*p.column
    if(column>p.column){ //adds columns
      for (let i = p.column; i < column; i++) {
        p.lattice[i] = new Array(row)
      }
    } else if(column < p.column){ //reduces columns
      let outcasts = []
      for(let i=p.column-1; i>=column; i--){
        for (let j = 0; j<p.row; j++) {
          let item = p.lattice[i][j]
          if(item)
            outcasts.push(item)
        }
      }
      outcasts.reverse()
      p.lattice.splice(column, p.column - column)
      let outcast_length = outcasts.length
      for (let i = 0; i < outcast_length; i++){  //puts outcast items from reduced columns on the right side
        let found = false                           //find next available stall,
        for (let j = column-1; j >=0 && !found; j--) {   // from top to bottom, right to left
          for (let k = 0; k < row && !found; k++) {
            if(!p.lattice[j][k]){
              let item = outcasts.pop()
              if(item.insert(j+1, k+1))
                found = true
              else{
                outcasts.push(item)
              }
            }
          }
        }
        if(!found){
          for (let i = 0; i < outcasts.length; i++) {
            outcasts[i].outcast()
          }
          break
        }
      }
    }
    p.column = column
    if(row > p.row){
      for (let i = 0; i < p.lattice.length; i++) { //adds rows
        for (let j = p.row; j < row; j++) {
          p.lattice[i][j] = undefined
        }
      }
    }
    else if(row < p.row){
      let outcasts = []
      for(let i=0; i<p.lattice.length; i++){
        for (let j = row; j<p.row; j++) {
          let item = p.lattice[i][j]
          if(item){
            outcasts.push(item)
          }
        }
        p.lattice[i].splice(row, p.row-row)
      }
      outcasts.reverse()
      let outcast_length = outcasts.length
      for (let i = 0; i < outcast_length; i++){  //puts outcast items from reduced rows to the left side
        let found = false                            //find next available stall,
        for (let j = 0; j < column && !found; j++) {   // from top to bottom, left to right
          for (let k = 0; k < row && !found; k++) {
            if(!p.lattice[j][k]){
              let item = outcasts.pop()
              item.insert(j+1,k+1)
              found = true
            }
          }
        }
        if(!found){
          for (let m = 0; m < outcasts.length; m++) {
            outcasts[m].outcast()
          }
          break
        }
      }
    }
    p.row = row
    if(added_slots>0){
      let min_n = Math.min(added_slots, p.outcasts.length)
      for (let i = 0; i < min_n ; i++) {
        let item = p.outcasts.pop()
        item.append()
        item.show()
      }
    }
  }
  getChecked(){
    let p = this.groupInfo
    let inputs = document.getElementsByName(p.name)
    for (let i = 0; i < inputs.length; i++) {
      if(inputs[i].checked) {
        return inputs[i]
      }
    }
  }
  deselect(){
    let p = this.groupInfo
    p.selected.forEach((item)=>{
      item.deselect()
    })
    p.selectedColumns[0] = -1
    p.selectedColumns[1] = -1
    if(p.checked) p.checked.uncheck()
  }
  blur(){
    let p = this.groupInfo
    if(p.focused) p.focused.blur()
  }
  select(x, y, sx, sy){
    if(!this.state.initiated) return

    const p = this.groupInfo
    if(p.checked) p.checked.uncheck()

    let left_n = Math.floor(Math.max(Math.min(x, sx)-0.75*p.itemWidth, -1)/p.interval[0]) +1
    let right_n = Math.floor((Math.max(x, sx) +0.75*p.itemWidth)/p.interval[0])-1
    if(!(p.selectedColumns[0] == left_n && p.selectedColumns[1] == right_n)){
      let deselected =-1

      let old_selected = []
      for (let j=0, i = p.selectedColumns[0]; i <= p.selectedColumns[1]; i++, j++) {
        old_selected[j] = i
      }
      let new_selected = []
      for (let j=0, i = left_n; i <= right_n; i++, j++) {
        new_selected[j] = i
      }
      if(!Array.prototype.minus)
        Array.prototype.minus = function (arr) {
          let result = []
          let obj = {}
          for (let i = 0; i < arr.length; i++) {
              obj[arr[i]] = 1
          }
          for (let j = 0; j < this.length; j++) {
              if (!obj[this[j]])
              {
                  obj[this[j]] = 1
                  result.push(this[j])
              }
          }
          return result
        }
      deselected = old_selected.minus(new_selected)
      let columns_deselected = []

      for (let i = 0; i < deselected.length; i++) {
        columns_deselected.push(p.lattice[deselected[i]])
      }

      for (let i = 0; i < columns_deselected.length; i++) {
        let column = columns_deselected[i]
        if(!column) continue
        for (let j = 0; j < column.length; j++) {
          let item = column[j]
          if(!item) continue
          item.deselect()
        }
      }
      p.selectedColumns[0] = left_n
      p.selectedColumns[1] = right_n
    }

    let column = []
    for (let k = p.selectedColumns[0]; k <= p.selectedColumns[1]; k++) {
      //since height of an item is unfixed, all items above bottom edge of the area within the column need to be computed
      column = p.lattice[k]
      if(!column) continue
      for (let i = 0; i<column.length; i++) {
        let item = column[i]
        if(!item) continue
        let item_node = item.refs.element
        let item_select_top = item_node.offsetTop+item_node.offsetHeight*0.25
        let item_select_bottom = item_node.offsetTop+item_node.offsetHeight*0.75
        if(sy>y){
          if((item_select_top>=y&&item_select_top<=sy)||(item_select_bottom>=y&&item_select_bottom<=sy)
                ||(item_select_bottom>sy&&item_select_top<y)){
            item.select()
          }else {
            item.deselect()
          }
        }else {
          if((item_select_top>=sy&&item_select_top<=y)||(item_select_bottom>=sy&&item_select_bottom<=y)
                ||(item_select_bottom>y&&item_select_top<sy)){
            item.select()
          }else {
            item.deselect()
          }
        }
      }
    }
  }
  onDrag(e, target){
    const x = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
    const y = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)

    const ctid = 'ct_CEbcp1oiBy'
    const tagid = 'tag_CEbcp1oiBy'

    let ondroppable = false
    const Tag = {
      show: 0,
      name: '',
      action: ''
    }
    const onEnterListener = (_target)=>{
      if(_target==target || this.groupInfo.selected.has(_target) ) return

      if(_target.hoverTag){
        Tag.show = 1
        Tag.name = _target.hoverTag.name
        Tag.action = _target.hoverTag.action
      }

      ondroppable = true
    }
    const onDropListener = (_target)=>{
      if(_target==target || this.groupInfo.selected.has(_target) ) return

    }
    const onLeaveListener = (_target)=>{
      if(_target==target || this.groupInfo.selected.has(_target) ) return
      Tag.show = 0
      Tag.name = ''
      Tag.action = ''
      ondroppable = false
    }
    let moved = false
    const move = (e)=>{
      let mx = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
      let my = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
      if(!moved&&Math.abs(my-y)<4&&Math.abs(mx-x)<4) return
      if(!moved){
        moved = true
        const origin = [target.column, target.row]
        const opacity = 0.63

        const ct = document.createElement('div')
        ct.id = ctid
        ct.className = css.itemsCt
        ct.style.pointerEvents = 'none'
        ct.style.zIndex = 99999997

        const tag = document.createElement('div')
        tag.id = tagid
        tag.className = css.draggingTag
        tag.style.zIndex = 99999998
        tag.style.top = y +'px'
        tag.style.left = x+12 +'px'
        tag.style.visibility = 'hidden'
        tag.innerHTML = "<p class='"+ css.draggingTagText +"'>"+
        "<span class='"+ css.draggingTagAction +"' id='"+tagid+"_action'></span>&nbsp"+
        "<span class='"+ css.draggingTagName +"' id='"+tagid+"_name'></span></p>"

        ct.appendChild(tag)

        let p = this.groupInfo
        p.selected.forEach((item)=>{
          let copy = item.refs.element.cloneNode(true)
          copy.className += ' '+css.dragged
          copy.id += '_dragged'
          if(item == target){
            target.dragged = true
            copy.style.opacity = opacity

            let children = copy.children
            for (let k = 0; k < children.length; k++) {
              if (children[k].className.indexOf(css.itemBackground)!=-1) {
                children[k].style.outline = 'unset'
                children[k].style.backgroundColor = 'unset'
              }
            }
          }else {
            let position = [item.column, item.row]
            let distance = Math.sqrt(Math.pow((position[0]-origin[0]),2)+Math.pow((position[1]-origin[1]),2))
            let ac = 1/((Math.pow(1.1*(distance),2)+2) *0.5)//attenuation coefficient
            copy.style.opacity = ac *opacity
          }
          ct.appendChild(copy)
        })
        this.props.container.refs.element.appendChild(ct)

        Events.on(Events.names.being_dragged_items_onenter, onEnterListener)
        Events.on(Events.names.being_dragged_items_ondrop, onDropListener)
        Events.on(Events.names.being_dragged_items_onleave, onLeaveListener)
      }else{
        const ct = document.getElementById(ctid)
        ct.style.top = my-y +'px'
        ct.style.left = mx-x +'px'

        if(ondroppable){
          if(Tag.show){
            document.getElementById(tagid+'_action').innerHTML = Tag.action
            document.getElementById(tagid+'_name').innerHTML = Tag.name
            let tagNode = document.getElementById(tagid)
            tagNode.style.visibility = 'visible'
            if(tagNode.offsetLeft+ct.offsetLeft>document.body.clientWidth-2*tagNode.offsetWidth){
              tagNode.style.left = document.body.clientWidth -tagNode.offsetWidth -ct.offsetLeft + 'px'
            }else {
              tagNode.style.left = x+12 +'px'
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
        Events.removeListener(Events.names.being_dragged_items_onenter, onEnterListener)
        Events.removeListener(Events.names.being_dragged_items_ondrop, onDropListener)
        Events.removeListener(Events.names.being_dragged_items_onleave, onLeaveListener)
        //move items
        if(!ondroppable){
          let ux = e.pageX || (e.changedTouches?e.changedTouches[0].pageX:0)
          let uy = e.pageY || (e.changedTouches?e.changedTouches[0].pageY:0)
          let p = this.groupInfo
          let mousePos = []
          mousePos[0] = Math.max(Math.min(Math.floor(ux/p.interval[0]), p.column-1), 0)
          mousePos[1] = Math.max(Math.min(Math.floor(uy/p.interval[1]), p.row-1), 0)

          let dx = mousePos[0] -target.column+1
          let dy = mousePos[1] -target.row+1
          if(dx || dy){
            for (let i = (dx>0? p.column-1 : 0);
            (dx>0?       i>=0 : i<p.column);
            (dx>0?        i-- : i++)) {
              for (let j = (dy>0? p.row-1 : 0);
              (dy>0?    j>=0 : j<p.row);
              (dy>0?     j-- : j++)) {
                let item = p.lattice[i][j]
                if(item&&item.selected){
                  item.insert(item.column+dx,item.row+dy)
                }
              }
            }
          }
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


}

class Item extends Component {
  constructor(props){
    super(props)
    this.state = {
      imgReady: 0
    }
    this.id = props.data.id
    this.hidden = 1
    this.selected = 0
    this.isOutcast = 0
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)
    this.imgOnLoad = this.imgOnLoad.bind(this)
    this.hoverTag = {
      name: this.props.data.name,
      action: "Move to"
    }
  }
  componentDidMount(){
    let t
    if(this.props.data.column&&this.props.data.row)
      t = this.insert(this.props.data.column, this.props.data.row)
    else
      t = this.append()
  }
  render(){
    return (
      <div className={css[this.props.data.className]} ref='element' style={{display:this.hidden?'none':''}}
        onMouseDown = {this.onMouseDown} onTouchStart = {this.onMouseDown}
        onMouseEnter = {this.onMouseEnter} onMouseUp = {this.onMouseUp} onMouseLeave = {this.onMouseLeave}
        onClick = {this.onClick} onDoubleClick = {this.onDoubleClick}
      >
        <div className={css.itemIcon}>
          {
            this.props.data.link?
            <div className={css.iconLink} style={{backgroundImage:'url(static/img/link.jpg)'}}></div> : ''
          }
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
        <input type="radio" name={this.props.groupInfo.name} className={css.itemCheck} ref='input'/>
        <div className={css.itemBackground} ref='bg'></div>
        <div className={css.itemText} data-title={this.props.data.name}></div>
      </div>
    )
  }
  imgOnLoad(){
    this.setState({
      imgReady: 1
    })
  }
  onDoubleClick(){
    System.addTask(this.id)
    System.desktop.deselectItems()
  }
  onMouseEnter(e){
    Events.emit(Events.names.being_dragged_items_onenter, this)
  }
  onMouseLeave(e){
    Events.emit(Events.names.being_dragged_items_onleave, this)
  }
  onMouseUp(e){
    Events.emit(Events.names.being_dragged_items_ondrop, this)
  }
  onMouseDown(e){
    if(!this.selected){
      this.props.groupInfo.parent.deselect()
    }
    this.focus()
    this.select()
    this.props.groupInfo.parent.onDrag(e, this)
  }
  onClick(e){
    if(this.selected&&!this.dragged){
      delete this.dragged
      this.props.groupInfo.parent.deselect()
      this.check()
      this.focus()
    }
  }
  check(){
    let lastChecked = this.props.groupInfo.checked
    if(lastChecked==this) return
    if(lastChecked) lastChecked.uncheck()
    this.refs.input.checked = true
    let p = this.props.groupInfo
    p.checked = this
    this.select()
  }
  uncheck(){
    this.refs.input.checked = false
    let lastChecked = this.props.groupInfo.checked
    if(lastChecked!=this) return
    this.props.groupInfo.checked = null
    this.deselect()
  }
  focus(){
    let lastFocused = this.props.groupInfo.focused
    if(lastFocused==this) return
    if(lastFocused) lastFocused.blur()
    let ele = this.refs.element
    ele.className += ' '+ css.focused
    this.props.groupInfo.focused = this
  }
  blur(){
    let ele = this.refs.element
    if(ele.className.indexOf(css.focused)==-1) return
    ele.className = ele.className.replace(new RegExp(css.focused, 'g'), '')
    this.props.groupInfo.focused = null
    if(ut.browser.indexOf('Edge')!=-1){
      this.refs.bg.style.outline = 'unset'
      setTimeout(()=>{
        this.refs.bg.style.outline = ''
      },10)
    }
  }
  select(){
    if(!this.selected){
      this.refs.element.className += ' '+css.selected
      this.selected = 1
      this.props.groupInfo.selected.add(this)
    }
  }
  deselect(){
    if(this.selected){
      let ele = this.refs.element
      ele.className = ele.className.replace(new RegExp(css.selected, 'g'), '')
      this.selected = 0
      this.props.groupInfo.selected.delete(this)
    }
    this.uncheck()
  }
  hide(){
    this.refs.element.style.display = 'none'
    this.hidden = 1
    this.selected = 0
    let lattice = this.props.groupInfo.lattice
    if(lattice[this.column-1]&&lattice[this.column-1][this.row-1]==this)
      lattice[this.column-1][this.row-1] = undefined
  }
  show(){
    this.refs.element.style.display = ''
    this.hidden = 0
    this.isOutcast = 0
    let lattice = this.props.groupInfo.lattice
    if(lattice[this.column-1]&&lattice[this.column-1][this.row-1]!=this)
      this.append()
  }
  outcast(){
    if(this.props.groupInfo.outcasts.indexOf(this)==-1){
      this.isOutcast = 1
      this.hide()
      this.props.groupInfo.outcasts.push(this)
    }
  }
  append(){
    let p = this.props.groupInfo
    let item_node = this.refs.element
    const put_to = (item, i, j)=>{
      p.lattice[i][j] = item
      item_node.style.left = i *p.interval[0] +'px'
      item_node.style.top = j *p.interval[1] +'px'
      item.column = i+1
      item.row = j+1
      item.show()
    }
    for (let i = 0; i < p.column; i++) {
      if(!p.lattice[i][p.row-1]){
        for (let j = 0; j < p.row; j++) {
          if(!p.lattice[i][j]){
            put_to(this, i, j)
            return true
          }
        }
      }
    }
    for (let i = 0; i < p.column; i++) {
      for (let j = 0; j < p.row-1; j++) {
        if(!p.lattice[i][j]){
          put_to(this, i, j)
          return true
        }
      }
    }
    this.outcast()
    return false
  }
  insert(column, row){
    if(!this.hidden){
      let lattice = this.props.groupInfo.lattice
      if(lattice[this.column-1]&&lattice[this.column-1][this.row-1]==this)
        lattice[this.column-1][this.row-1] = undefined
    }
    let p = this.props.groupInfo
    if(column>p.column) column = p.column
    if(row>p.row) row = p.row
    if(column<1) column = 1
    if(row<1) row = 1
    const put_to = (item, i, j)=>{
      let item_node = item.refs.element
      p.lattice[i][j] = item
      item_node.style.left = i *p.interval[0] +'px'
      item_node.style.top = j *p.interval[1] +'px'
      item.column = i+1
      item.row = j+1
      item.show()
    }
    const next_available = (pos, leftwards) =>{
      let _pos = [pos[0], pos[1]]
      if(leftwards){
        for (let i = _pos[0]; i >= 0; i--) {
          let j
          if(i==_pos[0]) j = _pos[1]
          else j = p.row-1
          for (; j >= 0; j--) {
            if(!p.lattice[i][j]){
              return [i, j]
            }
          }
        }
      }else {
        for (let i = _pos[0]; i < p.column; i++) {
          let j
          if(i == _pos[0]) j = _pos[1]
          else j = 0
          for (; j < p.row; j++) {
            if(!p.lattice[i][j]){
              return [i, j]
            }
          }
        }
      }
      return
    }
    const move_from_to = (from, to)=>{
      let lattice = p.lattice
      let _item = lattice[from[0]][from[1]]
      lattice[from[0]][from[1]] = undefined
      put_to(_item, to[0], to[1])
    }
    let item = this
    if(!p.lattice[column-1][row-1]){
      put_to(item, column-1, row-1)
      return true
    }
    let to = [column -1, row -1]
    let avaPos = next_available(to)
    let safeout = 0
    if(avaPos){ //available on right side
      let prePos = [avaPos[0], avaPos[1]]
      do {
        if(prePos[1]==0){
          prePos[1] = p.row -1
          prePos[0]--
        }else {
          prePos[1]--
        }
        move_from_to(prePos, avaPos)
        avaPos = [prePos[0], prePos[1]]
        if(safeout++>10000)throw new Error("8'")
      } while (!(avaPos[0]==to[0]&&avaPos[1]==to[1]))
      put_to(item, to[0], to[1])
      return true
    }else { //search left
      avaPos = next_available(to, true);
      if(avaPos){
        let prePos = [avaPos[0], avaPos[1]];
        do {
          if(prePos[1]==p.row-1){
            prePos[1] = 0
            prePos[0]++
          }else {
            prePos[1]++
          }
          move_from_to(prePos, avaPos)
          avaPos = [prePos[0], prePos[1]]
          if(safeout++>10000)throw new Error("8'")
        } while (!(avaPos[0]==to[0]&&avaPos[1]==to[1]))
        put_to(item, to[0], to[1])
        return true
      }else {
        this.outcast()
        return false
      }
    }
  }



}

export default Items
