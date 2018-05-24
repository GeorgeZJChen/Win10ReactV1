import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import icon from '../../css/components/icon.css'

const innerHTML = {
  "lock": (<span className={icon.lockRing}></span>),
  "angle": "",
  "resource-manager": "",
  "unknown": ""
}

class Icon extends Component{
  constructor(props){
    super(props)
    this.state ={
      className: props.className
    }
  }
  getHtml(){
    const classes = this.state.className.split(/\s+/)
    let full_name = ''
    let first_name = ''
    for (let i = 0; i < classes.length; i++) {
      let temp = classes[i]
      if(temp.indexOf('-')!=-1){
        let temp_arr = temp.split('-')
        for (let j = 0; j < temp_arr.length; j++) {
          if(j!=0){
            temp_arr[j] = temp_arr[j][0].toUpperCase() + temp_arr[j].slice(1)
          }
        }
        temp = temp_arr.join('')
      }
      if(i==0){
        first_name = temp
      }
      full_name += icon[classes[i]] +' '
    }
    return (
      <span className={full_name}>
        {innerHTML[first_name]}
      </span>
    )
  }
  render(){
      return this.getHtml()
  }

}
export default Icon
