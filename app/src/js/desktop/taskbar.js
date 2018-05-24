import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import css from '../../css/desktop/taskbar.css'
import Icon from '../components/icon.js'
import DateSpan from '../components/date.js'
import '../../css/system.css'

class Taskbar extends Component{
  constructor(props){
    super(props)
    this.state = {
      test: 1,
      date: '2018/12/30',
      time: '00:00'
    }
  }
  componentDidMount() {
    // let updateDate = ()=>{
    //   let date = new Date()
    //   let dateStr = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()
    //   this.setState({
    //     date: dateStr,
    //     time: (date.getHours()>9?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes())
    //   })
    // }
    // updateDate()
    //   this.dateIntvId = setInterval(updateDate, 1000)
  }
  componentWillUnmount(){
    // clearInterval(this.dateIntvId)
  }
  renderTasks(){
    return(
      <div className={css.tbTasks}>
        <div className={css.item+' '+css.itemTask}><span className={css.iconCt}>
          <Icon className="resource-manager"/>
        </span></div>
        <div className={css.item+' '+css.itemTask}><span className={css.iconCt}>
          <Icon className="unknown"/>
        </span></div>
        {/*<div className='item item-task' onclick='desktop.createWindow(this)' data-url='DOM/windows/Kugou.json'><span className='item-task-icon-ct'><span className='icon-kugou' id='item-task-kugou-span'></span></span></div>
        <div className='item item-task' onclick='desktop.createWindow(this)' data-url='DOM/windows/Atom.json'>
        <span className='item-task-icon-ct'>
        <span className='icon-atom' id='item-task-atom-span'>
        <span className='icon-atom-oval'></span>
        <span className='icon-atom-oval icon-atom-oval-1'></span>
        <span className='icon-atom-oval icon-atom-oval-2'></span>
        </span>
        </span>
        </div>
        <div className='item item-task' onclick='desktop.createWindow(this)' data-url='DOM/windows/WeChat.json'><span className='item-task-icon-ct'><span className='icon-task icon-WeChat coloured-WeChat'><span className='icon-WeChat-sub1'></span><span className='icon-WeChat-sub2'></span></span></span></div>
        */}
      </div>
    )
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
      <div className={css.taskbar}>
          <div className={css.tbLeft}>
            <div className={css.tbSys}>
              <div className={css.item+' '+css.itemMenu}>
                <Icon className={'start-menu '+css.iconStartMenu}/>
              </div>
              <div className={css.item+' '+css.itemCortana}>
                <Icon className={'cortana'}/>
              </div>
            </div>
            <div className={css.hiddenTasksCt}>
              <input type='checkbox' className={css.item+' '+css.taskSwitch} defaultChecked/>
              <div className={css.item+' '+css.switchResponser}>
                <Icon className={'angle up '+css.switchAU}/>
              </div>
              {this.renderTasks()}
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
                <span className={css.iconCtBg}><Icon className='angle up'/></span>
                <div className={css.itemsBgHidden}>
                  <div className={css.itemBg+' '+css.itemBgH+' '+css.item}><Icon className='teamviewer bg'/></div>
                  <div className={css.itemBg+' '+css.itemBgH+' '+css.item}><Icon className='weChat bg coloured'/></div>
                  {/*duplicates of displaying items*/}
                  <div className={css.itemBgH+' '+css.item+' '+css.itemBg+' '+css.shrink} onClick={()=>{this.changeLanguage()}}><span className={css.iconCtBg}><Icon className='kugou bg'/></span></div>
                  <div className={css.itemBgH+' '+css.item+' '+css.itemBg+' '+css.shrink}><span className={css.iconCtBg}><Icon className='weChat bg'/></span></div>
                  <div className={css.itemBgH+' '+css.item+' '+css.itemBg+' '+css.shrink}><span className={css.iconCtBg}><Icon className='WLAN-signal'/></span></div>
                  <div className={css.itemBgH+' '+css.item+' '+css.itemBg+' '+css.shrink} onClick={()=>{this.changeLanguage()}}><span className={css.iconCtBg}><span className={css.itemBgLang} ref='item_lang'>英</span></span></div>
                </div>
              </div>
              <div className={css.itemsBgCt} >
                <div className={css.item+' '+css.itemBg+' '+css.shrink} onClick={()=>{this.changeLanguage()}}><span className={css.iconCtBg}><span className={css.itemBgLang} ref='item_lang'>英</span></span></div>
                <div className={css.item+' '+css.itemBg+' '+css.shrink}><span className={css.iconCtBg}><Icon className='WLAN-signal'/></span></div>
                <div className={css.item+' '+css.itemBg+' '+css.shrink}><span className={css.iconCtBg}><Icon className='weChat bg'/></span></div>
                <div className={css.item+' '+css.itemBg+' '+css.shrink}><span className={css.iconCtBg}><Icon className='kugou bg'/></span></div>

              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Taskbar
