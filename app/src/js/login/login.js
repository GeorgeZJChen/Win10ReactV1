import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Loader from '../components/loader.js'
import Events from '../components/event.js'
import Desktop from '../desktop/desktop.js'
import css from '../../css/login/login.css'
import icon from '../../css/icon.css'

class Login extends Component{
  constructor(props){
    super(props)
    this.parentId = props.parentId
    this.state = {
      pageReady: 0,
      opacity: 1,
      imgURL: 'static/img/login_default_2.png',
      imgReady: 0,
      usernameWidth: 0
    }
    this.userInfo = {
      username: '',
      portraitURL: null
    }
  }
  componentDidMount() {
    setTimeout(() =>{
      this.setState({
        pageReady : 1,
      })
    }, 2000)
    this.dateIntvId = setInterval(()=>{
      let date = new Date()
      let dateStr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()]+ ', '
      + ["January","February","March","April","May","June","July","August"
        ,"September","October", "November","December"][date.getMonth()] + ', '
      + date.getDate()
      this.setState({
        date: dateStr,
        time: (date.getHours()>9?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes())
      })
    }, 2000)
    this.loadUserInformation()
  }
  componentWillUnmount(){
    clearInterval(this.dateIntvId)
  }
  loadUserInformation(){
    //shall get data from cookies or back end server
    axios({
      method: 'get',
      url: 'static/data/user.json',
      responseType: 'json'
    }).then((res)=>{
      try {
        this.userInfo = res.data
        this.refs.username.innerHTML = res.data.username
        this.refs.greetings.style.maxWidth = this.refs.username.offsetWidth +'px'
      } catch (e) {
        console.error('Data format error');
      }
    }).catch((err)=>{
      console.warn(err);
    })
  }
  toLogin() {
    if(!(this.state.imgReady&&this.state.pageReady)) return
    this.setState({
      removeDateCover : 1
    })
  }
  login() {
    this.refs.greetings.innerHTML = 'Welcome!'
    this.refs.greetings.style.fontSize = '24px'
    this.refs.btnLogin.style.position = "relative"
    this.refs.btnLogin.style.height = '24px'
    this.refs.btnLogin.style.cursor = 'default'
    ReactDOM.render(<Loader size='medium'/>, this.refs.btnLogin)

    ReactDOM.render(<Desktop/>, document.getElementById('win10_main'))

    Events.once(Events.names.desktopReady, (message)=>{
      setTimeout(()=>{
        this.setState({
          opacity: 0
        })
        setTimeout(()=>{
          ReactDOM.unmountComponentAtNode(document.getElementById(this.parentId))
        }, 500)
      }, 1000)
    })
  }
  imgReady(){
    this.setState({
      imgReady: 1
    })
  }
  getPortrait(){
    if(this.userInfo.portraitURL){
      return (<img style={{width:'100%', height:'100%'}} src={this.userInfo.portraitURL}/>)
    }
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
        <div className={css.blocker+' '+css.fullScreen} style={{opacity:(this.state.imgReady&&this.state.pageReady?0:1)}}></div>
        <div className={css.loginCover+' '+css.fullScreen} onDoubleClick={()=>this.setState({removeDateCover:0})}
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
        <div className={css.dateCover+' '+css.fullScreen} onClick={()=>this.toLogin()}
          style={{top: (this.state.removeDateCover&&(this.state.imgReady&&this.state.pageReady))?'-50%':0, opacity: (this.state.removeDateCover&&(this.state.imgReady&&this.state.pageReady))?0:1,zIndex:this.state.removeDateCover?0:2}}>
          <div className={css.date}>
            <div className={css.dateTime}>{this.state.time}</div>
            <div className={css.dateDate}>{this.state.date}</div>
          </div>
        </div>
        <div style={{visibility:(this.state.imgReady&&this.state.pageReady?'hidden':'visible'), marginTop: 50}}>
          <Loader/>
        </div>
      </div>
    );
  }
}

export default Login
