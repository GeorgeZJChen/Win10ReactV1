import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import icon from '../../css/components/icon.css'

const innerHTML = {
  "lock": (<span className={icon.lockRing}></span>),
  "WLAN-signal": (<span className={icon['WLAN-signal-inner']}></span>),
  "teamviewer": (<span className={icon['teamviewer-inner']}></span>),
  'weChat': (<span><span className={icon['weChat-inner1']}></span><span className={icon['weChat-inner2']}></span></span>)
}
let empty = [
  "angle", "resource-manager", "unknown", "operations", "kugou"
]
for (var i = 0; i < empty.length; i++) {
  innerHTML[empty[i]] = ""
}

class Icon extends Component{
  constructor(props){
    super(props)
    this.className = props.className
  }
  getHtml(){
    const classes = this.className.split(/\s+/)
    let full_name = ''
    let first_name = ''
    for (let i = 0; i < classes.length; i++) {
      if(i==0){
        first_name = classes[i]
      }
      let class_s = icon[classes[i]]
      if(class_s){
        full_name += class_s +' '
      }else {
        full_name += classes[i] +' '
      }
    }
    if(first_name.indexOf('weChat')!=-1){
      console.log(full_name);
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
