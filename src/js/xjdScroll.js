var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var xjdScroll = /** @class */ (function () {
    function xjdScroll(id, options) {
        var _this = this;
        this.version = '1.0.0';
        this.cursorDown = false;
        this.selectedThumb = '';
        this.X = 0;
        this.Y = 0;
        this.defultOption = {
            height: '100%',
            width: '100%'
        };
        this.on = (function () {
            if (document.addEventListener) {
                return function (element, event, handler) {
                    if (element && event && handler) {
                        element.addEventListener(event, handler, false);
                    }
                };
            }
            else {
                return function (element, event, handler) {
                    if (element && event && handler) {
                        element.attachEvent('on' + event, handler);
                    }
                };
            }
        })();
        this.off = (function () {
            if (document.removeEventListener) {
                return function (element, event, handler) {
                    if (element && event) {
                        element.removeEventListener(event, handler, false);
                    }
                };
            }
            else {
                return function (element, event, handler) {
                    if (element && event) {
                        element.detachEvent('on' + event, handler);
                    }
                };
            }
        })();
        this.mousedownVerticalBar = function (e) {
            var offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY);
            var thumbHalf = _this.verticalBar.children[0].offsetHeight / 2;
            var thumbPositionPercentage = (offset - thumbHalf) / _this.verticalBar.offsetHeight;
            _this.wrapper.scrollTop = thumbPositionPercentage * _this.wrapper.scrollHeight;
        };
        this.mousedownVerticalBarThumb = function (e) {
            e.stopImmediatePropagation();
            _this.selectedThumb = 'vertical';
            _this.cursorDown = true;
            _this.on(document, 'mousemove', _this.mouseMoveDocumentHandler);
            _this.on(document, 'mouseup', _this.mouseUpDocumentHandler);
            _this.dom.onselectstart = function () { return false; };
            _this.Y =
                e.currentTarget.offsetHeight -
                    e.clientY +
                    e.currentTarget.getBoundingClientRect().top;
        };
        this.mousedownHorizontalBar = function (e) {
            var offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX);
            var thumbHalf = _this.horizontalBar.children[0].offsetWidth / 2;
            var thumbPositionPercentage = (offset - thumbHalf) / _this.horizontalBar.offsetWidth;
            _this.wrapper.scrollLeft = thumbPositionPercentage * _this.wrapper.scrollWidth;
        };
        this.mousedownHorizontalBarThumb = function (e) {
            e.stopImmediatePropagation();
            _this.selectedThumb = 'horizontal';
            _this.cursorDown = true;
            _this.on(document, 'mousemove', _this.mouseMoveDocumentHandler);
            _this.on(document, 'mouseup', _this.mouseUpDocumentHandler);
            _this.dom.onselectstart = function () { return false; };
            _this.X =
                e.currentTarget.offsetWidth -
                    e.clientX +
                    e.currentTarget.getBoundingClientRect().left;
        };
        this.mouseMoveDocumentHandler = function (e) {
            if (_this.cursorDown === false)
                return;
            if (_this.selectedThumb === 'vertical') {
                var offset = e.clientY - _this.verticalBar.getBoundingClientRect().top;
                var thumbClickPosition = _this.verticalBar.children[0].offsetHeight - _this.Y;
                var thumbPositionPercentage = (offset - thumbClickPosition) / _this.verticalBar.offsetHeight;
                _this.wrapper.scrollTop =
                    thumbPositionPercentage * _this.wrapper.scrollHeight;
            }
            else if (_this.selectedThumb === 'horizontal') {
                var offset = e.clientX - _this.horizontalBar.getBoundingClientRect().left;
                var thumbClickPosition = _this.horizontalBar.children[0].offsetWidth - _this.X;
                var thumbPositionPercentage = (offset - thumbClickPosition) / _this.horizontalBar.offsetWidth;
                _this.wrapper.scrollLeft =
                    thumbPositionPercentage * _this.wrapper.scrollWidth;
            }
        };
        this.mouseUpDocumentHandler = function (e) {
            _this.cursorDown = false;
            _this.off(document, 'mousemove', _this.mouseMoveDocumentHandler);
            _this.off(document, 'mouseup', _this.mouseUpDocumentHandler);
            _this.dom.onselectstart = null;
        };
        this.dom = document.getElementById(id);
        this.wrapper = this.dom.children[0];
        this.content = this.wrapper.children[0];
        this.scrollbarWidth = this.getScrollbarWidth();
        if (options)
            this.defultOption = __assign({}, this.defultOption, options);
        this.dom.style.cssText = "height: " + this.defultOption.height + ";width: " + this.defultOption.width + ";";
        this.wrapper.style.cssText = "height: calc(100% + " + this.scrollbarWidth + "px);margin-right: -" + this.scrollbarWidth + "px;margin-bottom: -" + this.scrollbarWidth + "px";
        this.init();
    }
    xjdScroll.prototype.getScrollbarWidth = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.style.cssText =
            'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    };
    xjdScroll.prototype.hasScrollbar = function () {
        return {
            vertical: this.content.scrollHeight > this.wrapper.clientHeight,
            horizontal: this.content.scrollWidth > this.wrapper.clientWidth
        };
    };
    xjdScroll.prototype.creatVerticalBar = function () {
        var verticalBar = document.createElement('div');
        verticalBar.setAttribute('class', 'myScroll__verticalBar');
        this.on(verticalBar, 'mousedown', this.mousedownVerticalBar);
        var thumb = document.createElement('div');
        thumb.setAttribute('class', 'myScroll__thumb');
        thumb.style.height = (this.wrapper.clientHeight /
            this.content.offsetHeight) *
            100 + "%";
        this.on(thumb, 'mousedown', this.mousedownVerticalBarThumb);
        verticalBar.appendChild(thumb);
        return verticalBar;
    };
    xjdScroll.prototype.creatHorizontalBar = function () {
        var horizontalBar = document.createElement('div');
        horizontalBar.setAttribute('class', 'myScroll__horizontalBar');
        this.on(horizontalBar, 'mousedown', this.mousedownHorizontalBar);
        var thumb = document.createElement('div');
        thumb.setAttribute('class', 'myScroll__thumb');
        thumb.style.width = (this.wrapper.clientWidth /
            this.content.offsetWidth) *
            100 + "%";
        this.on(thumb, 'mousedown', this.mousedownHorizontalBarThumb);
        horizontalBar.appendChild(thumb);
        return horizontalBar;
    };
    xjdScroll.prototype.deleteBar = function () {
        if (this.dom.children.length === 1)
            return;
        for (var i = 1, l = this.dom.children.length; i < l; i++) {
            this.dom.removeChild(this.dom.children[1]);
        }
        this.verticalBar = void 0;
        this.horizontalBar = void 0;
    };
    xjdScroll.prototype.init = function () {
        var _this = this;
        this.refresh();
        this.wrapper.scrollTop = 0;
        this.wrapper.scrollLeft = 0;
        this.on(this.dom, 'mouseover', function () {
            if (_this.verticalBar)
                _this.verticalBar.style.opacity = 1;
            if (_this.horizontalBar)
                _this.horizontalBar.style.opacity = 1;
        });
        this.on(this.dom, 'mouseleave', function () {
            if (_this.cursorDown === true)
                return;
            if (_this.verticalBar)
                _this.verticalBar.style.opacity = '';
            if (_this.horizontalBar)
                _this.horizontalBar.style.opacity = '';
        });
        this.on(this.wrapper, 'scroll', function (e) {
            if (_this.verticalBar)
                _this.verticalBar.children[0].style.transform = "translateY(" + (e.target
                    .scrollTop /
                    _this.wrapper.clientHeight) *
                    100 + "%)";
            if (_this.horizontalBar)
                _this.horizontalBar.children[0].style.transform = "translateX(" + (e.target
                    .scrollLeft /
                    _this.wrapper.clientWidth) *
                    100 + "%)";
        });
    };
    xjdScroll.prototype.refresh = function () {
        this.deleteBar();
        this.X = 0;
        this.Y = 0;
        this.selectedThumb = '';
        this.cursorDown = false;
        var hasScrollbar = this.hasScrollbar();
        if (hasScrollbar.vertical && hasScrollbar.horizontal) {
            this.verticalBar = this.creatVerticalBar();
            this.horizontalBar = this.creatHorizontalBar();
            this.verticalBar.style.cssText = 'bottom: 12px;';
            this.horizontalBar.style.cssText = 'right: 12px;';
            this.dom.appendChild(this.verticalBar);
            this.dom.appendChild(this.horizontalBar);
        }
        else if (hasScrollbar.vertical) {
            this.verticalBar = this.creatVerticalBar();
            this.dom.appendChild(this.verticalBar);
        }
        else if (hasScrollbar.horizontal) {
            this.horizontalBar = this.creatHorizontalBar();
            this.dom.appendChild(this.horizontalBar);
        }
        else {
            this.deleteBar();
        }
    };
    return xjdScroll;
}());
