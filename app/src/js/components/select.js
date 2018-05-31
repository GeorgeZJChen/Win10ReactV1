import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import css from '../../css/components/select.css'

class Select extends Component{

  constructor(props){
    super(props)
    this.state = {
      activated: 0
    }
  }
  componentDidMount(){
    if(this.props.returnSelf)this.props.returnSelf(this)
  }

  activate(){
    this.setState({
      activated: 1
    })
  }


  render(){
    return (
      <div className={css.selectCt}
        style={{
          zIndex: this.state.activated?200:-200,
          display: this.state.activated?"block":"none"
        }}>
        <div className={css.selectArea}></div>
      </div>
    )
  }

}
export default Select
