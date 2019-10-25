export default class xjdScroll {
    constructor(dom, options) {
        this.dcm = document;
        this.version = '1.1.1';
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
        this.mouseMoveDocumentHandler = (e) => {
            if (this.cursorDown === false)
                return;
            const map = this[`${this.selectedThumb}Map`];
            const offset = e[map.client] -
                this[`${this.selectedThumb}Bar`].getBoundingClientRect()[map.direction];
            const thumbClickPosition = this[`${this.selectedThumb}Bar`].children[0][map.offset] - this[map.axis];
            const thumbPositionPercentage = (offset - thumbClickPosition) /
                this[`${this.selectedThumb}Bar`][map.offset];
            this.wrapper[map.scroll] =
                thumbPositionPercentage * this.wrapper[map.scrollSize];
        };
        this.mouseUpDocumentHandler = () => {
            this.cursorDown = false;
            this.off(this.dcm, 'mousemove', this.mouseMoveDocumentHandler);
            this.off(this.dcm, 'mouseup', this.mouseUpDocumentHandler);
            this.dcm.onselectstart = null;
        };
        this.dom = dom;
        this.wrapper = this.dom.childNodes[0];
        this.content = this.wrapper.childNodes[0];
        this.scrollbarWidth = this.getScrollbarWidth();
        if (options)
            this.defultOption = Object.assign(Object.assign({}, this.defultOption), options);
        this.dom.style.cssText = `height: ${this.defultOption.height};width: ${this.defultOption.width};`;
        this.wrapper.style.cssText = `height: calc(100% + ${this.scrollbarWidth}px);margin-right: -${this.scrollbarWidth}px;margin-bottom: -${this.scrollbarWidth}px`;
        this.init();
    }
    getScrollbarWidth() {
        let scrollDiv = this.dcm.createElement('div');
        scrollDiv.style.cssText =
            'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        this.dcm.body.appendChild(scrollDiv);
        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.dcm.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }
    hasScrollbar() {
        return {
            vertical: this.content.scrollHeight > this.wrapper.clientHeight,
            horizontal: this.content.scrollWidth > this.wrapper.clientWidth
        };
    }
    creatBar(type) {
        if (type !== 'vertical' && type !== 'horizontal') {
            console.log("type must be 'vertical' or 'horizontal'");
            return;
        }
        const map = this[`${type}Map`], bar = this.dcm.createElement('div'), thumb = this.dcm.createElement('div');
        bar.setAttribute('class', ` myScroll__${type}Bar`);
        this.on(bar, 'mousedown', (e) => {
            const offset = Math.abs(e.target.getBoundingClientRect()[map.direction] - e[map.client]);
            const thumbHalf = this[`${type}Bar`].children[0][map.offset] / 2;
            const thumbPositionPercentage = (offset - thumbHalf) / this[`${type}Bar`][map.offset];
            this.wrapper[map.scroll] =
                thumbPositionPercentage * this.wrapper[map.scrollSize];
        });
        thumb.setAttribute('class', 'myScroll__thumb');
        thumb.style.cssText = this.renderThumbStyle('0', `${(this.wrapper[map.wrapperClient] / this.content[map.contentOffset]) *
            100}%`, map);
        this.on(thumb, 'mousedown', (e) => {
            e.stopImmediatePropagation();
            this.clearSlct();
            this.selectedThumb = type;
            this.cursorDown = true;
            this.on(this.dcm, 'mousemove', this.mouseMoveDocumentHandler);
            this.on(this.dcm, 'mouseup', this.mouseUpDocumentHandler);
            this.dcm.onselectstart = () => false;
            this[map.axis] =
                e.currentTarget[map.offset] -
                    e[map.client] +
                    e.currentTarget.getBoundingClientRect()[map.direction];
        });
        bar.appendChild(thumb);
        return bar;
    }
    deleteBar() {
        if (this.dom.children.length === 1)
            return;
        for (let i = 1, l = this.dom.children.length; i < l; i++) {
            this.dom.removeChild(this.dom.children[1]);
        }
        this.verticalBar = null;
        this.horizontalBar = null;
    }
    renderThumbStyle(move, size, map) {
        const translate = `translate${map.axis}(${move}%)`;
        return `${[
            map.size
        ]}: ${size};transform: ${translate};-webkit-transform: ${translate};-ms-transform: ${translate};`;
    }
    init() {
        this.refresh();
        this.wrapper.scrollTop = 0;
        this.wrapper.scrollLeft = 0;
        this.on(this.dom, 'mouseover', () => {
            if (this.verticalBar)
                this.verticalBar.style.opacity = '1';
            if (this.horizontalBar)
                this.horizontalBar.style.opacity = '1';
        });
        this.on(this.dom, 'mouseleave', () => {
            if (this.cursorDown === true)
                return;
            if (this.verticalBar)
                this.verticalBar.style.opacity = '';
            if (this.horizontalBar)
                this.horizontalBar.style.opacity = '';
        });
        this.on(this.wrapper, 'scroll', (e) => {
            let map;
            if (this.verticalBar) {
                map = this.verticalMap;
                const thumb = this.verticalBar.childNodes[0];
                thumb.style.cssText = this.renderThumbStyle(`${(e.target[map.scroll] / this.wrapper[map.wrapperClient]) * 100}`, `${(this.wrapper[map.wrapperClient] /
                    this.content[map.contentOffset]) *
                    100}%`, map);
            }
            if (this.horizontalBar) {
                map = this.horizontalMap;
                const thumb = this.horizontalBar.childNodes[0];
                thumb.style.cssText = this.renderThumbStyle(`${(e.target[map.scroll] / this.wrapper[map.wrapperClient]) * 100}`, `${(this.wrapper[map.wrapperClient] /
                    this.content[map.contentOffset]) *
                    100}%`, map);
            }
        });
    }
    refresh() {
        this.deleteBar();
        this.X = 0;
        this.Y = 0;
        this.selectedThumb = '';
        this.cursorDown = false;
        let hasScrollbar = this.hasScrollbar();
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
    }
}
