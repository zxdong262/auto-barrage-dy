

import React from 'react'
import _ from 'lodash'
import copy from 'json-deep-copy'

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default class TextSender extends React.PureComponent {

  state = {
    inited: false,
    registered: false
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate(prevProps) {
    if (!this.state.inited) {
      this.init()
    }
    if (
      !prevProps.target && this.props.target
    ) {
      this.init()
    } else if (
      prevProps.target && this.props.target &&
      (prevProps.target.id !== this.props.target.id)
    ) {
      this.init()
    }
  }

  init = async () => {
    let input = document.querySelector('textarea.cs-textarea')
    let submit = document.querySelector('div.b-btn')
    let target = copy(
      this.props.target
    )
    if (!target) {
      return
    }
    let {
      text
    } = target
    input.value = text
    submit.click()
    this.setState({
      inited: true
    })
    this.props.report(target)
  }

  render() {
    return null
  }

}

