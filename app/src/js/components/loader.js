import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import css from '../../css/components/loader.css'

class Loader extends Component{
  constructor(props){
    super(props)
    this.class2 = ''
    if(props.size=='small'){
      this.class2 = css.w30
    }else if(props.size=='medium'){
      this.class2 = css.w40
    }
  }
  render (){
    return (
      <div className={css.loader+' '+this.class2}>
        <div className={css.loaderCircle}></div>
        <div className={css.loaderCircle}></div>
        <div className={css.loaderCircle}></div>
        <div className={css.loaderCircle}></div>
        <div className={css.loaderCircle}></div>
      </div>
    )
  }
}
export default Loader
