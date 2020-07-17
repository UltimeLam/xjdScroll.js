interface defultOption {
  height: string
  width: string
}

interface barMap {
  offset: 'offsetWidth' | 'offsetHeight'
  scroll: 'scrollLeft' | 'scrollTop'
  scrollSize: 'scrollWidth' | 'scrollHeight'
  size: 'width' | 'height'
  key: 'horizontal' | 'vertical'
  axis: 'X' | 'Y'
  client: 'clientX' | 'clientY'
  direction: 'left' | 'top'
  wrapperClient: 'clientWidth' | 'clientHeight'
  contentOffset: 'offsetWidth' | 'offsetHeight'
}

interface hasScrollBarType {
  vertical: boolean
  horizontal: boolean
}

export default class xjdScroll {
  public dom: HTMLElement
  public wrapper: HTMLElement
  public content: HTMLElement
  private verticalBar: HTMLElement
  private horizontalBar: HTMLElement
  private dcm: HTMLDocument | any = document

  static version: string = '1.2.0'

  private scrollbarWidth: number

  private cursorDown: boolean = false

  private selectedThumb: string = ''

  private X: number = 0
  private Y: number = 0

  private horizontalMap: barMap = {
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
  }

  private verticalMap: barMap = {
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
  }

  private defultOption: defultOption = {
    height: '100%',
    width: '100%'
  }

  constructor(dom: HTMLElement, options?: Object) {
    this.dom = dom;
    this.wrapper = this.dom.childNodes[0] as HTMLElement
    this.content = this.wrapper.childNodes[0] as HTMLElement

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

  private getScrollbarWidth(): number {
    let scrollDiv: HTMLElement = this.dcm.createElement('div')
    scrollDiv.style.cssText =
      'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
    this.dcm.body.appendChild(scrollDiv)
    let scrollbarWidth: number = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.dcm.body.removeChild(scrollDiv)
    return scrollbarWidth
  }

  private hasScrollbar(): hasScrollBarType {
    return {
      vertical: this.content.scrollHeight > this.wrapper.clientHeight,
      horizontal: this.content.scrollWidth > this.wrapper.clientWidth
    }
  }

  private createBar(type: string): HTMLElement {
    if (type !== 'vertical' && type !== 'horizontal') {
      console.log("type must be 'vertical' or 'horizontal'")
      return
    }

    const map: barMap = this[`${type}Map`],
      bar: HTMLElement = this.dcm.createElement('div'),
      thumb: HTMLElement = this.dcm.createElement('div')

    bar.setAttribute('class', ` myScroll__${type}Bar`)

    bar.addEventListener('mousedown', (e: any) => {
      const offset = Math.abs(
        e.currentTarget.getBoundingClientRect()[map.direction] - e[map.client]
      )
      const thumbHalf = this[`${type}Bar`].children[0][map.offset] / 2
      const thumbPositionPercentage =
        (offset - thumbHalf) / this[`${type}Bar`][map.offset]

      this.wrapper[map.scroll] =
        thumbPositionPercentage * this.wrapper[map.scrollSize]
    })

    thumb.setAttribute('class', 'myScroll__thumb')
    thumb.style.cssText = this.renderThumbStyle(
      '0',
      `${(this.wrapper[map.wrapperClient] / this.content[map.contentOffset]) *
        100}%`,
      map
    )

    thumb.addEventListener('mousedown', (e: any) => {
      e.stopImmediatePropagation()
      window.getSelection().removeAllRanges()
      this.selectedThumb = type
      this.cursorDown = true
      this.dcm.addEventListener('mousemove', this.mouseMoveDocumentHandler)
      this.dcm.addEventListener('mouseup', this.mouseUpDocumentHandler)
      this.dcm.onselectstart = () => false
      this[map.axis] =
        e.currentTarget[map.offset] -
        e[map.client] +
        e.currentTarget.getBoundingClientRect()[map.direction]
    })
    bar.appendChild(thumb)
    return bar
  }

  private mouseMoveDocumentHandler = (e: any) => {
    if (this.cursorDown === false) return
    const map: barMap = this[`${this.selectedThumb}Map`]
    const offset =
      e[map.client] -
      this[`${this.selectedThumb}Bar`].getBoundingClientRect()[map.direction]
    const thumbClickPosition =
      this[`${this.selectedThumb}Bar`].children[0][map.offset] - this[map.axis]
    const thumbPositionPercentage =
      (offset - thumbClickPosition) /
      this[`${this.selectedThumb}Bar`][map.offset]
    this.wrapper[map.scroll] =
      thumbPositionPercentage * this.wrapper[map.scrollSize]
  }

  private mouseUpDocumentHandler = () => {
    this.cursorDown = false
    this.dcm.removeEventListener('mousemove', this.mouseMoveDocumentHandler)
    this.dcm.removeEventListener('mouseup', this.mouseUpDocumentHandler)
    this.dcm.onselectstart = null
  }

  private deleteBar(): void {
    if (this.dom.children.length === 1) return
    for (let i: number = 1, l: number = this.dom.children.length; i < l; i++) {
      this.dom.removeChild(this.dom.children[1])
    }
    this.verticalBar = null
    this.horizontalBar = null
  }

  private renderThumbStyle(move: string, size: string, map: barMap) {
    const translate: string = `translate${map.axis}(${move}%)`

    return `${[
      map.size
    ]}: ${size};transform: ${translate};-webkit-transform: ${translate};-ms-transform: ${translate};`
  }

  private init(): void {
    this.refresh()
    this.wrapper.scrollTop = 0
    this.wrapper.scrollLeft = 0
    this.dom.addEventListener('mouseover', () => {
      if (this.verticalBar) this.verticalBar.style.opacity = '1'
      if (this.horizontalBar) this.horizontalBar.style.opacity = '1'
    })
    this.dom.addEventListener('mouseleave', () => {
      if (this.cursorDown === true) return
      if (this.verticalBar) this.verticalBar.style.opacity = ''
      if (this.horizontalBar) this.horizontalBar.style.opacity = ''
    })
    this.wrapper.addEventListener('scroll', (e: any) => {
      let map: barMap
      if (this.verticalBar) {
        map = this.verticalMap
        const thumb = this.verticalBar.childNodes[0] as HTMLElement
        thumb.style.cssText = this.renderThumbStyle(
          `${(e.currentTarget[map.scroll] / this.wrapper[map.wrapperClient]) * 100}`,
          `${(this.wrapper[map.wrapperClient] /
            this.content[map.contentOffset]) *
            100}%`,
          map
        )
      }
      if (this.horizontalBar) {
        map = this.horizontalMap
        const thumb = this.horizontalBar.childNodes[0] as HTMLElement
        thumb.style.cssText = this.renderThumbStyle(
          `${(e.currentTarget[map.scroll] / this.wrapper[map.wrapperClient]) * 100}`,
          `${(this.wrapper[map.wrapperClient] /
            this.content[map.contentOffset]) *
            100}%`,
          map
        )
      }
    })
  }

  public refresh(): void {
    this.deleteBar()
    this.X = 0
    this.Y = 0
    this.selectedThumb = ''
    this.cursorDown = false
    let hasScrollbar = this.hasScrollbar()
    if (hasScrollbar.vertical && hasScrollbar.horizontal) {
      this.verticalBar = this.createBar('vertical')
      this.horizontalBar = this.createBar('horizontal')
      this.verticalBar.style.cssText = 'bottom: 12px;'
      this.horizontalBar.style.cssText = 'right: 12px;'
      this.dom.appendChild(this.verticalBar)
      this.dom.appendChild(this.horizontalBar)
    } else if (hasScrollbar.vertical) {
      this.verticalBar = this.createBar('vertical')
      this.dom.appendChild(this.verticalBar)
    } else if (hasScrollbar.horizontal) {
      this.horizontalBar = this.createBar('horizontal')
      this.dom.appendChild(this.horizontalBar)
    } else {
      this.deleteBar()
    }
  }
}
