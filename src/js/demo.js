var step = 300,
  newScroll = null,
  myScroll = document.querySelector('#myScroll');

function contentAddWidth() {
  var myScrollContent = newScroll.content,
    newWidth = myScrollContent.offsetWidth + step;
  myScrollContent.style.width = newWidth + "px";
  newScroll.refresh();
}

function contentReduceWidth() {
  var myScrollContent = newScroll.content,
    newWidth = myScrollContent.offsetWidth - step;
  myScrollContent.style.width = newWidth + "px";
  newScroll.refresh();
}

function contentAddHeight() {
  var myScrollContent = newScroll.content,
    newHeight = myScrollContent.offsetHeight + step;
  myScrollContent.style.height = newHeight + "px";
  newScroll.refresh();
}

function contentReduceHeight() {
  var myScrollContent = newScroll.content,
    newHeight = myScrollContent.offsetHeight - step;
  myScrollContent.style.height = newHeight + "px";
  newScroll.refresh();
}

function refresh() { 
  newScroll = new xjdScroll(myScroll, {
    height: '600px',
    width: '600px'
  })
}

function fullScreen() {
  newScroll = new xjdScroll(myScroll)
}

window.onload = function () {
  refresh();
}

window.onresize = function () {
  newScroll.refresh();
}