import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import css from '../../css/desktop/taskbar.css'

import TaskItems from './task-items.js'
import Events from '../components/event.js'
import Icon from '../components/icon.js'
import DateSpan from '../components/date.js'

class Taskbar extends Component{
  constructor(props){
    super(props)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.hoverTag = {
      name: "taskbar",
      action: "Attach to"
    }
  }
  update(task){
    if(task.taskbarIcon){
      this.refs.taskbarTasks.update()
    }
    if(task.backgroundIcon){
      if(task.backgroundIcon.hidden){
        this.refs.backgroundTasksHidden.update()
      }else {
        this.refs.backgroundTasksDisplay.update()
        this.refs.backgroundTasksDisplayDup.update()
      }
    }
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

  changeLanguage(){
    const item = this.refs['item_lang']
    if(item.innerHTML=='英')
      item.innerHTML='中'
    else
      item.innerHTML='英'
  }
  render(){
    return(
      <div className={css.taskbar}
        onTouchStart = {this.onMouseDown} onMouseEnter = {this.onMouseEnter}
        onMouseUp = {this.onMouseUp} onMouseLeave = {this.onMouseLeave}
        >
          <div className={css.tbLeft} ref='tb'>
            <div className={css.tbSys}>
              <div className={css.item+' '+css.itemMenu}>
                <Icon className={'windows-logo '+css.iconStartMenu}/>
              </div>
              <div className={css.item+' '+css.itemCortana}>
                <Icon className='cortana'/>
              </div>
            </div>
            <div className={css.tasksCt} ref='ct'>
              <input type='checkbox' className={css.item+' '+css.taskSwitch} defaultChecked/>
              <div className={css.item+' '+css.switchResponser}>
                <Icon className={'angle up '+css.switchAU}/>
              </div>
              <div className={css.tbTasks}>
                <TaskItems type={0} ref='taskbarTasks'/>
              </div>
            </div>
          </div>
          <div className={css.tbRight}>
            <div className={css.item+' '+css.showDesktop}></div>
            <div className={css.item+' '+css.operations}>
              <Icon className='operations'/>
            </div>
            <div className={css.item+' '+css.dtp}>
              <div className={css.dateTime}><DateSpan format='hh:mm'/></div>
              <div className={css.dateTime}><DateSpan format='yyyy/M/d'/></div>
            </div>
            <div className={css.tbBg}>
              <div className={css.itemsBgHiddenCt}>
                <input className={css.itemBgHiddenSwitch} type='checkbox'/>
                <div className={css.bgSwitchResponse} id='act-hover-more-bg-switch'></div>
                <span className={css.iconCtBg} style={{position:'absolute'}}><Icon className='angle up'/></span>
                <div className={css.itemsBgHidden}>
                  <TaskItems type={1} ref='backgroundTasksHidden'/>
                  {/*duplicates of displaying items*/}
                  <TaskItems type={2} ref='backgroundTasksDisplayDup'/>
                </div>
              </div>
              <div className={css.itemsBgCt} >
                <div className={css.item+' '+css.itemBg} onClick={()=>{this.changeLanguage()}}><span className={css.iconCtBg}><span className={css.itemBgLang} ref='item_lang'>英</span></span></div>
                <TaskItems type={3} ref='backgroundTasksDisplay'/>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Taskbar
