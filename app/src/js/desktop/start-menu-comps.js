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
      return a.name > b.name
    })
    this.alphabeticItems = alphabeticItems
  }
  render(){
    return (
      <div className={css.column2}>
        <Scrollbar/>
        <div className={css.contentC2}>
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
              return <Item key={index} app={app} index={index} last={this.alphabeticItems[index-1]}/>
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
              if(!this.props.last) return
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
  render(){
    return <div className={css.scrollbar}></div>
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
