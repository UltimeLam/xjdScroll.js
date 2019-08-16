import xjdScroll from "./xjdScroll";

const step = 300,
  myScroll = document.querySelector("#myScroll");

let newScroll = null;

function contentAddWidth() {
  const myScrollContent = newScroll.content,
    newWidth = myScrollContent.offsetWidth + step;
  myScrollContent.style.width = newWidth + "px";
  newScroll.refresh();
}

function contentReduceWidth() {
  const myScrollContent = newScroll.content,
    newWidth = myScrollContent.offsetWidth - step;
  myScrollContent.style.width = newWidth + "px";
  newScroll.refresh();
}

function contentAddHeight() {
  const myScrollContent = newScroll.content,
    newHeight = myScrollContent.offsetHeight + step;
  myScrollContent.style.height = newHeight + "px";
  newScroll.refresh();
}

function contentReduceHeight() {
  const myScrollContent = newScroll.content,
    newHeight = myScrollContent.offsetHeight - step;
  myScrollContent.style.height = newHeight + "px";
  newScroll.refresh();
}

function refresh() {
  newScroll = new xjdScroll(myScroll, {
    height: "600px",
    width: "600px"
  });
}

function fullScreen() {
  newScroll = new xjdScroll(myScroll);
}

window.onload = function() {
  refresh();
};

window.onresize = function() {
  newScroll.refresh();
};
