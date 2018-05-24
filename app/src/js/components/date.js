import React, {Component} from 'react'
import ReactDOM from 'react-dom'

const Week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const Month = ["January","February","March","April","May","June","July","August","September","October", "November","December"]
class DateSpan extends Component{
  constructor(props){
    super(props)
    this.format = props.format
    this.state = {
      date: [2018,12,1,0],
      time: [18,30,59]
    }
  }
  componentDidMount() {
    let updateDate = ()=>{
      const date = new window.Date()
      this.setState({
        date: [date.getFullYear(), date.getMonth()+1, date.getDate(),date.getDay()],
        time: [date.getHours(), date.getMinutes(), date.getSeconds()]
      })
    }
    updateDate()
      this.dateIntvId = setInterval(updateDate, 1000)
    }
  componentWillUnmount(){
    clearInterval(this.dateIntvId)
  }
  getFormated(){
    let str = this.format
    let y = this.state.date[0]
    str=str.replace(/yyyy|YYYY/,y)
    str=str.replace(/yy|YY/,(y % 100)>9?(y % 100).toString():'0' + (y % 100))
    let m = this.state.date[1]
    str=str.replace(/MM/,this.m>9?m.toString():'0' + m)
    str=str.replace(/M/g,m)
    let d = this.state.date[2]
    str=str.replace(/dd|DD/,d>9?d.toString():'0' + d)
    str=str.replace(/d|D/g,d)
    let h =this.state.time[0]
    str=str.replace(/hh|HH/,h>9?h.toString():'0' + h)
    str=str.replace(/h|H/g,h)
    let mt = this.state.time[1]
    str=str.replace(/mm/,mt>9?mt.toString():'0' + mt)
    str=str.replace(/m/g,mt)
    let s = this.state.time[2]
    str=str.replace(/ss|SS/,s>9?s.toString():'0' + s)
    str=str.replace(/s|S/g,s)

    str=str.replace(/w|W/g,Week[this.state.date[3]])
    str=str.replace(/~/g,Month[m])
    return str
  }
  render(){
    return(
      <span>{this.getFormated()}</span>
    )
  }
}

export default DateSpan
