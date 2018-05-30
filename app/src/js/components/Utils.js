
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
// let ss = document.styleSheets[document.styleSheets.length - 1]
// if (CSS && CSS.supports && CSS.supports('animation: name')){
// } else {
//     ut.addKeyFrames = function(name, frames){
//         var str = name + "{" + frames + "}",
//             pos = ss.length;
//         ss.insertRule("@-webkit-keyframes " + str, pos);
//         ss.insertRule("@keyframes " + str, pos+1);
//     }
// }
export default ut
