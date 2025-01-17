onload = adjustBoard;
onresize = adjustBoard; 
function adjustBoard(){
    var s_w = window.innerWidth;
    var s_h = window.innerHeight;
    var wh_ratio = s_w/s_h;
    if(wh_ratio<=0.8){
        document.getElementById("board").style.height = "100vw";
        document.getElementById("board").style.width = "100vw";
        document.getElementById("left-side").style.width = (wh_ratio-1)*0+"vh";
        document.getElementById("right-side").style.width = (wh_ratio-1)*0+"vh";
    }
    else{
        document.getElementById("board").style.height = "100vh";
        document.getElementById("board").style.width = "100vh";
        document.getElementById("left-side").style.width = (wh_ratio-1)*50+"vh";
        document.getElementById("right-side").style.width = (wh_ratio-1)*50+"vh";
    }
}
