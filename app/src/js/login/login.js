import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Loader from '../components/loader.js'
import DateSpan from '../components/date.js'
import css from '../../css/login/login.css'
import icon from '../../css/components/icon.css'

import System from '../system/system.js'

class Login extends Component{
  constructor(props){
    super(props)
    this.parentId = props.parentId
    this.state = {
      pageReady: 0,
      opacity: 1,
      imgURL: 'static/img/login_default.jpg',
      imgReady: 0,
      usernameWidth: 0,
      renderFlag: true
    }
  }
  componentDidMount() {

    this.loadUserInformation(()=>{
      setTimeout(() =>{
        this.setState({
          pageReady : 1,
        })
      }, this.props.lock?0:2000)
    })
  }
  loadUserInformation(cb){

    if(System.userInfo){
      this.refs.username.innerHTML = System.userInfo.username
      setTimeout(()=>{
        this.refs.greetings.style.maxWidth = this.refs.username.offsetWidth +'px'
      },10)
      cb()
    }else{
      axios({
        method: 'get',
        url: 'static/data/user.json',
        responseType: 'json'
      }).then((res)=>{
        try {
          System.userInfo = res.data
          this.refs.username.innerHTML = System.userInfo.username
          setTimeout(()=>{
            this.refs.greetings.style.maxWidth = this.refs.username.offsetWidth +'px'
          },10)

          cb()
        } catch (e) {
          console.error('Data format error');
        }
      }).catch((err)=>{
        console.warn(err);
      })
    }
  }
  toLogin() {
    if(!(this.state.imgReady&&this.state.pageReady)) return
    this.setState({
      removeDateCover : 1
    })
  }
  login() {
    this.loading = 1
    this.refs.greetings.innerHTML = 'Welcome!'
    this.refs.greetings.style.fontSize = '24px'
    this.refs.btnLogin.style.position = "relative"
    this.refs.btnLogin.style.height = '24px'
    this.refs.btnLogin.style.cursor = 'default'
    ReactDOM.render(<Loader size='medium'/>, this.refs.btnLogin)

    if(!this.props.lock)
      System.start(this.unmount.bind(this))
    else
      this.unmount()
  }
  unmount(){
    setTimeout(()=>{
      // To speed up render: when user opens startmenu, it will not be the first time of rendering
      let smsw = document.getElementById('start_menu_switch_X7VIV')
      if(!smsw) return
      smsw.click()
      setTimeout(()=>{
        smsw.click()
        setTimeout(()=>{
          this.setState({
            opacity: 0
          })
          setTimeout(()=>{
            ReactDOM.unmountComponentAtNode(document.getElementById(this.parentId))
          }, 500)
        }, 1000)
      },300)
    },200)

  }
  imgReady(){
    this.setState({
      imgReady: 1
    })
  }
  getPortrait(){
    /// TODO:
    if(System.userInfo&&System.userInfo.portraitURL){
      return (<img style={{width:'100%', height:'100%'}} src={System.userInfo.portraitURL}/>)
    }else
      return (
        <div className={css.portraitDefault}>
         <div className={css.portraitDefaultB}></div>
        </div>
      )
  }
  render() {
    return (
      <div className={css.container+' '+css.fullScreen+' '+ (this.state.pageReady?css.transition:'')} style={{opacity: this.state.opacity}}>
        <img className={css.backgroundImg+' '+css.fullScreen} src={this.state.imgURL} onLoad={()=>this.imgReady()}/>
        <div className={css.blocker+' '+css.fullScreen}
          style={{
            opacity:this.state.imgReady&&this.state.pageReady?0:1,
            backgroundColor: this.props.lock?'#000':''
          }}></div>
        <div className={css.loginCover+' '+css.fullScreen} onDoubleClick={()=>{if(!this.loading)this.setState({removeDateCover:0})}}
              style={{opacity:this.state.removeDateCover?1:0}}>
          <div className={css.loginCoverContainer}>
            <div className={css.portrait}>{this.getPortrait()}</div>
            <div></div>{/*empty divs are to make sure other elements occupy the hole inline while don't span the width*/}
            <div className={css.username} ref='username'></div>
            <div></div>
            <div className={css.greetings} ref='greetings'>Welcome! If you are to login, please click the button below.</div>
            <div></div>
            <div className={css.btnLogin} ref='btnLogin' onClick={()=>this.login()}>Log in</div>
          </div>
          <div className={css.btn+' '+css.lock} onClick={()=>this.setState({removeDateCover:0})}>
            <span className={icon.lock}><span className={icon.lockRing}></span></span>
          </div>
        </div>
        {
          <div className={css.dateCover+' '+css.fullScreen} onClick={()=>this.toLogin()}
            style={{top: (this.state.removeDateCover&&(this.state.imgReady&&this.state.pageReady))?'-50%':0,
            opacity: ((this.state.removeDateCover&&(this.state.imgReady&&this.state.pageReady))||!(this.state.imgReady&&this.state.pageReady))?0:1,
            zIndex:this.state.removeDateCover?0:2}}>
            <div className={css.prompt}>Click to continue</div>
            <div className={css.date}>
              <div className={css.dateTime}><DateSpan format='hh:mm'/></div>
              <div className={css.dateDate}><DateSpan format='W, ~, d'/></div>
            </div>
          </div>
        }
        <div className={css.fullScreen}
          style={{visibility:(this.state.imgReady&&this.state.pageReady?'hidden':'visible')}}>
          <Loader/>
        </div>
      </div>
    )
  }
}

export default Login
