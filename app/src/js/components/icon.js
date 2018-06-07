import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import icon from '../../css/components/icon.css'

const innerHTML = {
  "lock": (<span className={icon.lockRing}></span>),
  "WLAN-signal": (<span className={icon['WLAN-signal-inner']}></span>),
  "teamviewer": (<span className={icon['teamviewer-inner']}></span>),
  'wechat': (<span><span className={icon['wechat-inner1']}></span><span className={icon['wechat-inner2']}></span></span>),
  "portrait" : (<span className={icon['portrait-inner']}></span>),
  "eclipse-neon": (<span className={icon['eclipse-neon-inner']}></span>),
  "word": <span className={icon['word-inner']}>W</span> ,
  "powerpoint": <span className={icon['powerpoint-inner']}>P<span className={icon['powerpoint-inner-inner']}>L</span></span> ,
  "excel": <span className={icon['excel-inner']}>X</span> ,
  "onenote": <span className={icon['onenote-inner']}>N</span>,
  "qq": <span className={icon['qq-inner']}></span>,
  "atom": (
    <React.Fragment>
      <span className={icon['atom-oval']}></span>
      <span className={icon['atom-oval']+' '+icon['atom-oval-1']}></span>
      <span className={icon['atom-oval']+' '+icon['atom-oval-2']}></span>
    </React.Fragment>
  ),
  "folder": <span className={icon['folder-inner']}></span>
}
let empty = [
  "windows-logo", "angle", "resource-manager", "unknown", "operations", "kugou", "setting",
  "shutdown", "mailbox", "skype"
]
for (var i = 0; i < empty.length; i++) {
  innerHTML[empty[i]] = ""
}

class Icon extends Component{
  constructor(props){
    super(props)
    this.className = props.className

    if(this.className==undefined) return

    const classes = this.className.split(/\s+/)
    let full_name = ''
    let first_name = ''
    for (let i = 0; i < classes.length; i++){
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
    this.full_name = full_name
    this.first_name = first_name
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.className == nextProps.className)
      return false
    return true
  }
  render(){
    if(this.className==undefined) return <span></span>
    return (
      <span className={this.full_name} style={this.props.style}>
        {innerHTML[this.first_name]}
      </span>
    )
  }

}
export default Icon
