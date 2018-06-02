import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Icon from '../components/icon.js'

import css from '../../css/desktop/desktop-container.css'


class Items extends Component {

  constructor(props){
    super(props)

    this.state = {
      initiated : 0
    }

  }
  init(){
    this.groupInfo = {
      interval: [0, 0],
      column: -1,
      row: -1,
      selectedColumns: [-1, -1], //[left column number, right column number] selectedColumns are from left No. to the number before right No.
      itemWidth: 0,
      lattice: [] //lattice[column][row] two dimension array
    }
    if(this.props.container.constructor.name == 'DesktopContainer'){
      this.groupInfo.itemWidth = 72
      this.groupInfo.interval = [76, 110]
    }
    this.lattice_init()
    this.setState({
      initiated : 1
    })
  }
  componentDidMount(){

  }
  render(){
    let data = {
      icon: {className:"folder"},
      name: "Test Folder 1",
      className: "item-desktop"
    }
    let data2 = {
      icon: {className:"folder"},
      name: "Test Folder 2",
      className: "item-desktop"
    }

    // (()=>{
    //   let items = []
    //   for (let i = 0; i < array.length; i++) {
    //     for (let j = 0; j < array.length; j++) {
    //       let item = this.groupInfo[i][j]
    //       items.push(
    //         <Item data
    //       )
    //     }
    //   }
    // })()
    console.log(this.state.initiated);
    return (

      <div className={css.itemsCt} ref='element'>
        {
          this.state.initiated?
          [
            <Item data={data} groupName={'test'} key={1} column={1} row={1} groupInfo={this.groupInfo}/>,
            <Item data={data} groupName={'test'} key={2} column={1} row={2} groupInfo={this.groupInfo}/>,
            <Item data={data} groupName={'test'} key={3} column={4} row={4} groupInfo={this.groupInfo}/>,
            <Item data={data2} groupName={'test'} key={4} column={1} row={2} groupInfo={this.groupInfo}/>,
          ]
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
    let p = this.groupInfo
    let container = this.props.container.refs.element
    let containerHeight = container.offsetHeight
    let containerWidth = container.offsetWidth
    let row = Math.floor(containerHeight/p.interval[1])
    let column = Math.floor(containerWidth/p.interval[0])
    if(row == p.row && column == p.column) return  //nothing changes
    if(column>p.column){ //adds columns
      for (let i = p.column; i < column; i++) {
        p.lattice[i] = new Array(row)
      }
    } else if(column < p.column){ //reduces columns
      let outcasts = []
      for(let i=p.column-1; i>=column; i--){
        for (let j = 0; j<=p.row; j++) {
          let item = p.lattice[i][j]
          if(item)
            outcasts.push(item)
        }
      }
      outcasts.reverse()
      p.lattice.splice(column, p.column - column)
      let round = outcasts.length
      for (let i = 0; i < round; i++){  //puts outcast items from reduced columns on the right side
        let found = false;                            //find next available stall,
        for (let j = column-1; j >0 && !found; j--) {   // from top to bottom, right to left
          for (let k = 0; k < row && !found; k++) {
            if(this.check_availablePosition(j, k, false)){ //could be false
              let item = outcasts.pop()
              this.putDesktopItemTo(item, j, k)
              found = true
            }
          }
        }
        if(!found){
          for (let i = 0; i < outcasts.length; i++) {
            outcasts[i].style.display = "none";
          }
          console.warn(outcasts.length+" column outcasts remain");
          break;
        }
      }
    }
    let minCol = Math.min(column, p.column);
    if(row > p.row){
      for (let i = 0; i < minCol; i++) { //adds rows
        for (let j = p.row+1; j <= row; j++) {
          p.lattice[i][j] = undefined;
        }
      }
    }
    else if(row < p.row){
      let outcasts = [];
      for(let i=0; i<=minCol; i++){
        for (let j = row+1; j<=p.row; j++) {
          let item = p.lattice[i][j];
          if(item){
            outcasts.push(item);
          }
        }
        p.lattice[i].splice(row+1, p.row-row);
      }
      outcasts.reverse();
      let round = outcasts.length;
      for (let i = 0; i < round; i++){  //puts outcast items from reduced rows to the left side
        let found = false                            //find next available stall,
        for (let j = 0; j <=column && !found; j++) {   // from top to bottom, left to right
          for (let k = 0; k <= row && !found; k++) {
            if(this.check_availablePosition(j, k, false)){ //could be false
              let item = outcasts.pop()
              this.putDesktopItemTo(item, j, k)
              found = true
            }
          }
        }
        if(!found){
          for (let i = 0; i < outcasts.length; i++) {
            outcasts[i].hide()
          }
          console.warn(outcasts.length+" row outcasts remain")
          break
        }
      }
    }
    p.column = column
    p.row = row
  }
  putDesktopItemTo(item, column, row){
    let p = this.groupInfo
    p.lattice[column][row] = item
    // TODO:
    // item.style.left = column *p.interval[0] +'px';
    // item.style.top = row *p.interval[1] +'px';
    // item.column = column;
    // item.row = row;
  }
  check_availablePosition(column, row, assert){
    let p = this.groupInfo
    if (column>p.column||row>p.row||column<1||row<1) {
      if(assert) console.warn("Failed to add item, Column or row out of range");
      return false
    }
    if (p.lattice[column-1][row-1]) {
      if(assert) console.warn("Failed to put item into position ("+column+', '+row+'),  stall occupied');
      return false
    }
    return true
  }

  select(x, y, sx, sy){
    const p = this.groupInfo
    let left_n = Math.floor(Math.max(Math.min(x, sx)-0.75*p.itemWidth, -1)/p.interval[0]) +1
    let right_n = Math.floor(Math.max(x, sx) +0.75*p.itemWidth/p.interval[0])-1
    if(p.selectedColumns[0] == left_n && p.selectedColumns[1] == right_n) return

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
        // this.removeClass(item, "desktop-item-selected") // TODO:
        item.selected = false
      }
    }
    p.selectedColumns[0] = left_n
    p.selectedColumns[1] = right_n
  }


}

class Item extends Component {
  constructor(props){
    super(props)
    this.groupInfo = this.props.groupInfo
    this.hidden = 1
  }
  componentDidMount(){
    if(this.insert(this.props.column, this.props.row)){
      this.refs.element.style.display = ''
      this.hidden = 0
    }else {
      console.warn('Failed when inserting item.');
    }
  }
  render(){
    return (
      <div className={css[this.props.data.className]} ref='element' style={{display:this.hidden?'none':''}}>
        <div className={css.itemIcon}>
          <Icon className={this.props.data.icon.className}/>
        </div>
        <input type="radio" name={this.props.groupName+"_items_2RHBpnMd"} className={css.itemCheck}/>
          {/*  ondblclick="desktop.createWindow(this);this.checked=false"
          onblur="this.parentNode.style.zIndex=auto;"
          onfocus="this.parentNode.style.zIndex=1;"*/}
        <div className={css.itemBackground}></div>
        <div className={css.itemText} data-title={this.props.data.name}></div>
      </div>
    )
  }
  hide(){
    this.refs.element.style.display = 'none'
    this.hidden = 1
  }
  outcast(){
    // TODO:
  }
  insert(column, row){
    let p = this.groupInfo
    const put_to = (item, i, j)=>{
      p.lattice[i][j] = item
      item.style.left = i *p.interval[0] +'px'
      item.style.top = j *p.interval[1] +'px'
      item.column = i+1
      item.row = j+1
    }
    const check_available = (column, row)=>{
      if (column>p.column||row>p.row||column<1||row<1) {
        return false;
      }
      if (p.lattice[column-1][row-1]) {
        return false;
      }
      return true;
    }
    const next_available = (pos, leftwards) =>{
      let _pos = [pos[0], pos[1]];
      let safeout = 0
      if(leftwards){
        while(!check_available(_pos[0]+1, _pos[1]+1)) {
          _pos[1]--;
          if(_pos[1]<0&&_pos[0]>0){
            _pos[0]--;
            _pos[1] = p.row-1;
          }else if (_pos[1]<0&&_pos[0]==0) {
            return false;
          }
          safeout++
          if(safeout++>10000)throw new Error("8'")
        }
      }else {
        while(!check_available(_pos[0]+1, _pos[1]+1)){
          _pos[1]++;
          if(_pos[1]>p.row-1&&_pos[0]<p.column-1){
            _pos[0]++;
            _pos[1] = 0;
          }else if (_pos[1]>p.row-1&&_pos[0]==p.column-1) {
            return false;
          }
        }
        if(safeout++>10000)throw new Error("8'")
      }
      return _pos
    }
    const move_from_to = (from, to)=>{
      let lattice = p.lattice
      let _item = lattice[from[0]][from[1]]
      lattice[from[0]][from[1]] = undefined
      put_to(_item, to[0], to[1])
    }

    let item = this.refs.element
    if(check_available(column, row)){
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
      let prePos = [avaPos[0], avaPos[1]];
      if(avaPos){
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
