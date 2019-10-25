import xjdScroll from "./xjdScroll";

const step = 300,
  myScroll = document.querySelector("#myScroll");

let newScroll = null;

const contentAddWidth = document.getElementById("contentAddWidth");
contentAddWidth.onclick = function() {
  const myScrollContent = newScroll.content,
    newWidth = myScrollContent.offsetWidth + step;
  myScrollContent.style.width = newWidth + "px";
  newScroll.refresh();
};

const contentReduceWidth = document.getElementById("contentReduceWidth");
contentReduceWidth.onclick = function() {
  const myScrollContent = newScroll.content,
    newWidth = myScrollContent.offsetWidth - step;
  if (newWidth >= 400) {
    myScrollContent.style.width = newWidth + "px";
    newScroll.refresh();
  }
};

const contentAddHeight = document.getElementById("contentAddHeight");
contentAddHeight.onclick = function() {
  const myScrollContent = newScroll.content,
    newHeight = myScrollContent.offsetHeight + step;
  myScrollContent.style.height = newHeight + "px";
  newScroll.refresh();
};

const contentReduceHeight = document.getElementById("contentReduceHeight");
contentReduceHeight.onclick = function() {
  const myScrollContent = newScroll.content,
    newHeight = myScrollContent.offsetHeight - step;
  if (newHeight >= 400) {
    myScrollContent.style.height = newHeight + "px";
    newScroll.refresh();
  }
};

const refresh = document.getElementById("refresh");
refresh.onclick = function() {
  newScroll = new xjdScroll(myScroll, {
    height: "600px",
    width: "600px"
  });
};

const fullScreen = document.getElementById("fullScreen");
fullScreen.onclick = function() {
  newScroll = new xjdScroll(myScroll);
};

window.onload = function() {
  refresh.click();
};

window.onresize = function() {
  newScroll.refresh();
};
