
class Utils{}

const ut = new Utils()

let style = document.getElementById('global_style')
if(!style){
  style = document.createElement('style')
  style.id = 'global_style'
}
ut.global_style = style
document.head.appendChild(style);
ut.addKeyFrames = function(name, frames){
  global_style.innerHTML += "@keyframes "+name + "{" + frames + "}"
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

ut.global = {}

export default ut
