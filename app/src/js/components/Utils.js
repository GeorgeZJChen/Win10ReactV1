
class Utils{}

const ut = new Utils()

let style = document.getElementById('keyframes')
if(!style){
  style = document.createElement('style')
  style.id = 'keyframes'
}
ut.keyframes = style
document.head.appendChild(style);
ut.addKeyFrames = function(name, frames){
  keyframes.innerHTML += "@keyframes "+name + "{" + frames + "}"
}

let getBrowser = function(){
      var ua= navigator.userAgent, tem,
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
      }
      if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
      return M.join(' ');
    }
ut.browser = getBrowser()
ut.isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i)?1:0

ut.computePosition = function(ele){
  const pos = [0,0]
  do{
    pos[0] += ele.offsetLeft
    pos[1] += ele.offsetTop
    ele = ele.parentNode
  }while(ele!=document.body)
  return pos
}

ut.setCursor = function(cursor){
  let style = document.getElementById('cursor22KFP8V0')
  if(!style){
    style = document.createElement('style')
    style.id = 'cursor22KFP8V0'
    document.head.appendChild(style)
  }
  if(!cursor) style.innerHTML =  ''
  else style.innerHTML = '*{cursor:'+ cursor +'!important}'
}

ut.global = {}

export default ut
