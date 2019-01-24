interface defultOption {
  height: string
  width: string
}

class xjdScroll {
  public dom: any
  public wrapper: any
  public content: any

  public version: string = '1.0.0'

  private scrollbarWidth: number

  private cursorDown: boolean = false

  private selectedThumb: string = ''

  private X: number = 0
  private Y: number = 0

  private defultOption: defultOption = {
    height: '100%',
    width: '100%'
  }

  private verticalBar: any
  private horizontalBar: any

  constructor(id: string, options?: Object) {
    this.dom = document.getElementById(id)
    this.wrapper = this.dom.children[0]
    this.content = this.wrapper.children[0]

    this.scrollbarWidth = this.getScrollbarWidth()
    if (options) this.defultOption = { ...this.defultOption, ...options }

    this.dom.style.cssText = `height: ${this.defultOption.height};width: ${
      this.defultOption.width
    };`

    this.wrapper.style.cssText = `height: calc(100% + ${
      this.scrollbarWidth
    }px);margin-right: -${this.scrollbarWidth}px;margin-bottom: -${
      this.scrollbarWidth
    }px`

    this.init()
  }

  private on = (function() {
    if (document.addEventListener) {
      return function(element: any, event: string, handler: any) {
        if (element && event && handler) {
          element.addEventListener(event, handler, false)
        }
      }
    } else {
      return function(element: any, event: string, handler: any) {
        if (element && event && handler) {
          element.attachEvent('on' + event, handler)
        }
      }
    }
  })()

  private off = (function() {
    if (document.removeEventListener) {
      return function(element, event, handler) {
        if (element && event) {
          element.removeEventListener(event, handler, false)
        }
      }
    } else {
      return function(element, event, handler) {
        if (element && event) {
          element.detachEvent('on' + event, handler)
        }
      }
    }
  })()

  private getScrollbarWidth() {
    let scrollDiv = document.createElement('div')
    scrollDiv.style.cssText =
      'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
    document.body.appendChild(scrollDiv)
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
  }

  private hasScrollbar() {
    return {
      vertical: this.content.scrollHeight > this.wrapper.clientHeight,
      horizontal: this.content.scrollWidth > this.wrapper.clientWidth
    }
  }

  private creatVerticalBar() {
    const verticalBar = document.createElement('div')
    verticalBar.setAttribute('class', 'myScroll__verticalBar')
    this.on(verticalBar, 'mousedown', this.mousedownVerticalBar)
    const thumb = document.createElement('div')
    thumb.setAttribute('class', 'myScroll__thumb')
    thumb.style.height = `${(this.wrapper.clientHeight /
      this.content.offsetHeight) *
      100}%`
    this.on(thumb, 'mousedown', this.mousedownVerticalBarThumb)
    verticalBar.appendChild(thumb)
    return verticalBar
  }

  private mousedownVerticalBar = (e: any) => {
    const offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY)
    const thumbHalf = this.verticalBar.children[0].offsetHeight / 2
    const thumbPositionPercentage =
      (offset - thumbHalf) / this.verticalBar.offsetHeight

    this.wrapper.scrollTop = thumbPositionPercentage * this.wrapper.scrollHeight
  }

  private mousedownVerticalBarThumb = (e: any) => {
    e.stopImmediatePropagation()
    this.selectedThumb = 'vertical'
    this.cursorDown = true
    this.on(document, 'mousemove', this.mouseMoveDocumentHandler)
    this.on(document, 'mouseup', this.mouseUpDocumentHandler)
    this.dom.onselectstart = () => false
    this.Y =
      e.currentTarget.offsetHeight -
      e.clientY +
      e.currentTarget.getBoundingClientRect().top
  }

  private creatHorizontalBar() {
    const horizontalBar = document.createElement('div')
    horizontalBar.setAttribute('class', 'myScroll__horizontalBar')
    this.on(horizontalBar, 'mousedown', this.mousedownHorizontalBar)
    const thumb = document.createElement('div')
    thumb.setAttribute('class', 'myScroll__thumb')
    thumb.style.width = `${(this.wrapper.clientWidth /
      this.content.offsetWidth) *
      100}%`
    this.on(thumb, 'mousedown', this.mousedownHorizontalBarThumb)
    horizontalBar.appendChild(thumb)
    return horizontalBar
  }

  private mousedownHorizontalBar = (e: any) => {
    const offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX)
    const thumbHalf = this.horizontalBar.children[0].offsetWidth / 2
    const thumbPositionPercentage =
      (offset - thumbHalf) / this.horizontalBar.offsetWidth

    this.wrapper.scrollLeft = thumbPositionPercentage * this.wrapper.scrollWidth
  }

  private mousedownHorizontalBarThumb = (e: any) => {
    e.stopImmediatePropagation()
    this.selectedThumb = 'horizontal'
    this.cursorDown = true
    this.on(document, 'mousemove', this.mouseMoveDocumentHandler)
    this.on(document, 'mouseup', this.mouseUpDocumentHandler)
    this.dom.onselectstart = () => false
    this.X =
      e.currentTarget.offsetWidth -
      e.clientX +
      e.currentTarget.getBoundingClientRect().left
  }

  private mouseMoveDocumentHandler = (e: any) => {
    if (this.cursorDown === false) return
    if (this.selectedThumb === 'vertical') {
      const offset = e.clientY - this.verticalBar.getBoundingClientRect().top
      const thumbClickPosition =
        this.verticalBar.children[0].offsetHeight - this.Y
      const thumbPositionPercentage =
        (offset - thumbClickPosition) / this.verticalBar.offsetHeight
      this.wrapper.scrollTop =
        thumbPositionPercentage * this.wrapper.scrollHeight
    } else if (this.selectedThumb === 'horizontal') {
      const offset = e.clientX - this.horizontalBar.getBoundingClientRect().left
      const thumbClickPosition =
        this.horizontalBar.children[0].offsetWidth - this.X
      const thumbPositionPercentage =
        (offset - thumbClickPosition) / this.horizontalBar.offsetWidth
      this.wrapper.scrollLeft =
        thumbPositionPercentage * this.wrapper.scrollWidth
    }
  }

  private mouseUpDocumentHandler = (e: any) => {
    this.cursorDown = false
    this.off(document, 'mousemove', this.mouseMoveDocumentHandler)
    this.off(document, 'mouseup', this.mouseUpDocumentHandler)
    this.dom.onselectstart = null
  }

  private deleteBar() {
    if (this.dom.children.length === 1) return
    for (let i = 1, l = this.dom.children.length; i < l; i++) {
      this.dom.removeChild(this.dom.children[1])
    }
    this.verticalBar = void 0
    this.horizontalBar = void 0
  }

  private init() {
    this.refresh()
    this.wrapper.scrollTop = 0
    this.wrapper.scrollLeft = 0
    this.on(this.dom, 'mouseover', () => {
      if (this.verticalBar) this.verticalBar.style.opacity = 1
      if (this.horizontalBar) this.horizontalBar.style.opacity = 1
    })
    this.on(this.dom, 'mouseleave', () => {
      if (this.cursorDown === true) return
      if (this.verticalBar) this.verticalBar.style.opacity = ''
      if (this.horizontalBar) this.horizontalBar.style.opacity = ''
    })
    this.on(this.wrapper, 'scroll', (e: any) => {
      if (this.verticalBar)
        this.verticalBar.children[0].style.transform = `translateY(${(e.target
          .scrollTop /
          this.wrapper.clientHeight) *
          100}%)`
      if (this.horizontalBar)
        this.horizontalBar.children[0].style.transform = `translateX(${(e.target
          .scrollLeft /
          this.wrapper.clientWidth) *
          100}%)`
    })
  }

  public refresh() {
    this.deleteBar()
    this.X = 0
    this.Y = 0
    this.selectedThumb = ''
    this.cursorDown = false
    let hasScrollbar = this.hasScrollbar()
    if (hasScrollbar.vertical && hasScrollbar.horizontal) {
      this.verticalBar = this.creatVerticalBar()
      this.horizontalBar = this.creatHorizontalBar()
      this.verticalBar.style.cssText = 'bottom: 12px;'
      this.horizontalBar.style.cssText = 'right: 12px;'
      this.dom.appendChild(this.verticalBar)
      this.dom.appendChild(this.horizontalBar)
    } else if (hasScrollbar.vertical) {
      this.verticalBar = this.creatVerticalBar()
      this.dom.appendChild(this.verticalBar)
    } else if (hasScrollbar.horizontal) {
      this.horizontalBar = this.creatHorizontalBar()
      this.dom.appendChild(this.horizontalBar)
    } else {
      this.deleteBar()
    }
  }
}
