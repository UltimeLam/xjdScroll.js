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
        this.dcm = document;
        this.version = '1.0.1';
        this.cursorDown = false;
        this.selectedThumb = '';
        this.X = 0;
        this.Y = 0;
        this.verticalMap = {
            offset: 'offsetHeight',
            scroll: 'scrollTop',
            scrollSize: 'scrollHeight',
            size: 'height',
            key: 'vertical',
            axis: 'Y',
            client: 'clientY',
            direction: 'top',
            wrapperClient: 'clientHeight',
            contentOffset: 'offsetHeight'
        };
        this.horizontalMap = {
            offset: 'offsetWidth',
            scroll: 'scrollLeft',
            scrollSize: 'scrollWidth',
            size: 'width',
            key: 'horizontal',
            axis: 'X',
            client: 'clientX',
            direction: 'left',
            wrapperClient: 'clientWidth',
            contentOffset: 'offsetWidth'
        };
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
        this.clearSlct = 'getSelection' in window
            ? function () {
                window.getSelection().removeAllRanges();
            }
            : function () {
                this.dcm.selection.empty();
            };
        this.mouseMoveDocumentHandler = function (e) {
            if (_this.cursorDown === false)
                return;
            var map = _this[_this.selectedThumb + "Map"];
            var offset = e[map.client] -
                _this[_this.selectedThumb + "Bar"].getBoundingClientRect()[map.direction];
            var thumbClickPosition = _this[_this.selectedThumb + "Bar"].children[0][map.offset] - _this[map.axis];
            var thumbPositionPercentage = (offset - thumbClickPosition) /
                _this[_this.selectedThumb + "Bar"][map.offset];
            _this.wrapper[map.scroll] =
                thumbPositionPercentage * _this.wrapper[map.scrollSize];
        };
        this.mouseUpDocumentHandler = function () {
            _this.cursorDown = false;
            _this.off(_this.dcm, 'mousemove', _this.mouseMoveDocumentHandler);
            _this.off(_this.dcm, 'mouseup', _this.mouseUpDocumentHandler);
            _this.dcm.onselectstart = null;
        };
        this.dom = this.dcm.getElementById(id);
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
        var scrollDiv = this.dcm.createElement('div');
        scrollDiv.style.cssText =
            'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        this.dcm.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.dcm.body.removeChild(scrollDiv);
        return scrollbarWidth;
    };
    xjdScroll.prototype.hasScrollbar = function () {
        return {
            vertical: this.content.scrollHeight > this.wrapper.clientHeight,
            horizontal: this.content.scrollWidth > this.wrapper.clientWidth
        };
    };
    xjdScroll.prototype.creatBar = function (type) {
        var _this = this;
        if (type !== 'vertical' && type !== 'horizontal') {
            console.log("type must be 'vertical' or 'horizontal'");
            return;
        }
        var map = this[type + "Map"], bar = this.dcm.createElement('div'), thumb = this.dcm.createElement('div');
        bar.setAttribute('class', " myScroll__" + type + "Bar");
        this.on(bar, 'mousedown', function (e) {
            var offset = Math.abs(e.target.getBoundingClientRect()[map.direction] - e[map.client]);
            var thumbHalf = _this[type + "Bar"].children[0][map.offset] / 2;
            var thumbPositionPercentage = (offset - thumbHalf) / _this[type + "Bar"][map.offset];
            _this.wrapper[map.scroll] =
                thumbPositionPercentage * _this.wrapper[map.scrollSize];
        });
        thumb.setAttribute('class', 'myScroll__thumb');
        thumb.style.cssText = this.renderThumbStyle('0', (this.wrapper[map.wrapperClient] / this.content[map.contentOffset]) *
            100 + "%", map);
        this.on(thumb, 'mousedown', function (e) {
            e.stopImmediatePropagation();
            _this.clearSlct();
            _this.selectedThumb = type;
            _this.cursorDown = true;
            _this.on(_this.dcm, 'mousemove', _this.mouseMoveDocumentHandler);
            _this.on(_this.dcm, 'mouseup', _this.mouseUpDocumentHandler);
            _this.dcm.onselectstart = function () { return false; };
            _this[map.axis] =
                e.currentTarget[map.offset] -
                    e[map.client] +
                    e.currentTarget.getBoundingClientRect()[map.direction];
        });
        bar.appendChild(thumb);
        return bar;
    };
    xjdScroll.prototype.deleteBar = function () {
        if (this.dom.children.length === 1)
            return;
        for (var i = 1, l = this.dom.children.length; i < l; i++) {
            this.dom.removeChild(this.dom.children[1]);
        }
        this.verticalBar = null;
        this.horizontalBar = null;
    };
    xjdScroll.prototype.renderThumbStyle = function (move, size, map) {
        var translate = "translate" + map.axis + "(" + move + "%)";
        return [
            map.size
        ] + ": " + size + ";transform: " + translate + ";-webkit-transform: " + translate + ";-ms-transform: " + translate + ";";
    };
    xjdScroll.prototype.init = function () {
        var _this = this;
        this.refresh();
        this.wrapper.scrollTop = 0;
        this.wrapper.scrollLeft = 0;
        this.on(this.dom, 'mouseover', function () {
            if (_this.verticalBar)
                _this.verticalBar.style.opacity = '1';
            if (_this.horizontalBar)
                _this.horizontalBar.style.opacity = '1';
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
            var map;
            if (_this.verticalBar) {
                map = _this.verticalMap;
                var thumb = _this.verticalBar.children[0];
                thumb.style.cssText = _this.renderThumbStyle("" + (e.target[map.scroll] / _this.wrapper[map.wrapperClient]) * 100, (_this.wrapper[map.wrapperClient] /
                    _this.content[map.contentOffset]) *
                    100 + "%", map);
            }
            if (_this.horizontalBar) {
                map = _this.horizontalMap;
                var thumb = _this.horizontalBar.children[0];
                thumb.style.cssText = _this.renderThumbStyle("" + (e.target[map.scroll] / _this.wrapper[map.wrapperClient]) * 100, (_this.wrapper[map.wrapperClient] /
                    _this.content[map.contentOffset]) *
                    100 + "%", map);
            }
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
            this.verticalBar = this.creatBar('vertical');
            this.horizontalBar = this.creatBar('horizontal');
            this.verticalBar.style.cssText = 'bottom: 12px;';
            this.horizontalBar.style.cssText = 'right: 12px;';
            this.dom.appendChild(this.verticalBar);
            this.dom.appendChild(this.horizontalBar);
        }
        else if (hasScrollbar.vertical) {
            this.verticalBar = this.creatBar('vertical');
            this.dom.appendChild(this.verticalBar);
        }
        else if (hasScrollbar.horizontal) {
            this.horizontalBar = this.creatBar('horizontal');
            this.dom.appendChild(this.horizontalBar);
        }
        else {
            this.deleteBar();
        }
    };
    return xjdScroll;
}());
