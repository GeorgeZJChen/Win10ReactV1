import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import System from '../system/system.js'

import {WindowItems,BackgroundItems} from './task-items.js'
import Events from '../components/event.js'
import Icon from '../components/icon.js'
import DateSpan from '../components/date.js'

import css from '../../css/desktop/taskbar.css'

class Taskbar extends Component{
  constructor(props){
    super(props)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)

    this.windowTaskMaps = new Map()
    this.backgroundTaskMaps = new Map()

    this.hoverTag = {
      name: "taskbar",
      action: "Attach to"
    }
    this.selected = null
  }
  init(){
    System.tasks.forEach((taskMap)=>{
      taskMap.forEach((task)=>{
        if(task.taskbarIcon){
          if(!this.windowTaskMaps.get(task.id)){
            this.windowTaskMaps.set(task.id, new Map())
          }
          this.windowTaskMaps.get(task.id).set(task.query, task)
        }
        if(task.backgroundIcon){
          if(!this.backgroundTaskMaps.get(task.id)){
            this.backgroundTaskMaps.set(task.id, new Map())
          }
          this.backgroundTaskMaps.get(task.id).set(task.query, task)
        }
      })
    })
    this.refs.windowItems.update()
    this.refs.backgroundTasksHidden.update()
    this.refs.backgroundTasksDisplay.update()
    this.refs.backgroundTasksDisplayDup.update()
  }
  getTaskbarItem(id){
    let map = this.windowTaskMaps.get(id)
    if(map) return map.taskbarItem
  }
  deselect(){
    if(this.selected) {
      this.selected.deselect()
    }
  }
  selectTask(id){
    let item = this.getTaskbarItem(id)
    if(item) item.select()
  }
  deselectTask(id){
    let item = this.getTaskbarItem(id)
    if(item) item.deselect()
  }
  add(task){
    if(task.taskbarIcon){
      if(!this.windowTaskMaps.get(task.id)){
        this.windowTaskMaps.set(task.id, new Map())
      }
      this.windowTaskMaps.get(task.id).set(task.query, task)
      this.refs.windowItems.update()
    }
    if(task.backgroundIcon){
      if(!this.backgroundTaskMaps.get(task.id)){
        this.backgroundTaskMaps.set(task.id, new Map())
      }
      this.backgroundTaskMaps.get(task.id).set(task.query, task)
      if(task.backgroundIcon.hidden){
        this.refs.backgroundTasksHidden.update()
      }else{
        this.refs.backgroundTasksDisplay.update()
        this.refs.backgroundTasksDisplayDup.update()
      }
    }
  }
  delete(task){
    if(task.taskbarIcon){
      let taskMap = this.windowTaskMaps.get(task.id)
      if(taskMap && taskMap.size == 1){
        this.windowTaskMaps.delete(task.id)
      }else if(taskMap){
        taskMap.delete(task.query)
      }
      this.refs.windowItems.update()
    }
    if(task.backgroundIcon){
      let taskMap2 = this.backgroundTaskMaps.get(task.id)
      if(taskMap2 && taskMap2.size == 1){
        this.windowTaskMaps.delete(task.id)
      }else if(taskMap2){
        taskMap2.delete(task.query)
      }
      if(task.backgroundIcon.hidden){
        this.refs.backgroundTasksHidden.update()
      }else{
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
  onMouseDown(e){
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
      <div className={css.taskbar} onMouseDown = {this.onMouseDown}
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
                <WindowItems ref='windowItems'/>
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
                  <BackgroundItems type={1} ref='backgroundTasksHidden'/>
                  {/*duplicates of displaying items*/}
                  <BackgroundItems type={2} ref='backgroundTasksDisplayDup'/>
                </div>
              </div>
              <div className={css.itemsBgCt} >
                <div className={css.item+' '+css.itemBg} onClick={()=>{this.changeLanguage()}}><span className={css.iconCtBg}><span className={css.itemBgLang} ref='item_lang'>英</span></span></div>
                <BackgroundItems type={3} ref='backgroundTasksDisplay'/>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Taskbar
