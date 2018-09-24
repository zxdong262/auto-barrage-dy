import React from 'react'
import {
  Icon, Tabs, List,
  Button, Badge
} from 'antd'
import _ from 'lodash'
import AutoForm from './form'
import {generate} from 'shortid'
import TextHandler from './text-handler'
import copy from 'json-deep-copy'

const {TabPane} = Tabs

export default class App extends React.PureComponent {
  state ={
    tasks: [],
    working: false,
    started: false,
    currentTarget: null,
    hide: false
  }

  toggle = () => {
    this.setState(old => {
      return {
        hide: !old.hide
      }
    })
  }

  pause = () => {
    this.setState({
      curretTarget: null,
      working: false
    })
  }

  resume = () => {
    this.setState({
      working: true,
      curretTarget: this.state.tasks[0]
    })
  }


  onReportId = null
  //this means one phone call finished
  //lets handle the result
  onReport = ({target = {}}) => {
    if (!this.state.working || !target.id) {
      return
    }
    if (this.onReportId === target.id) {
      return
    }
    clearTimeout(this.xtimer)
    this.onReportId = target.id
    let {delay} = target
    this.setState(old => {
      let {id} = target
      let tasks = copy(old.tasks).filter(t => t.id !== id)
      return {
        tasks,
        currentTarget: null
      }
    }, () => {
      this.xtimer = setTimeout(
        () => {
          this.setState(old => {
            return {
              currentTarget: old.tasks[0]
            }
          })
        },
        delay
      )
    })
  }

  queue = async ({text, repeat, sep}) => {
    let ns = text.split(/\n/)
    let tasks = []
    let {length} = ns
    for (let i = 0; i < repeat;i ++) {
      let r = _.random(0, length - 1)
      let tx = ns[r]
      let delay = Math.floor(
        sep * 1000 * (1 + _.random(.1, .2))
      )
      tasks.push({
        id: 'id_' + generate(),
        text: tx,
        delay: delay
      })
    }
    this.setState(old => {
      old.tasks = [
        ...old.tasks,
        ...tasks
      ]
      return old
    }, this.afterQueue)
  }

  afterQueue = () => {
    let {tasks, started} = this.state
    if (!started && tasks.length) {
      this.setState({
        working: true,
        started: true,
        curretTarget: tasks[0] || null
      })
    }
  }

  renderCurrentTarget = () => {
    let {curretTarget} = this.state
    if (!curretTarget) {
      return null
    }
    let {
      text,
      delay
    } = curretTarget
    return (
      <div className="current-target pd1">
        正在发送 {text}, {delay}秒后发送下一条
      </div>
    )
  }

  styleMap = {
    tasks: {
      backgroundColor: '#fff',
      color: '#999',
      boxShadow: '0 0 0 1px #d9d9d9 inset'
    }
  }

  renderPaneTitle = (name, arr) => {
    return (
      <Badge
        count={arr.length}
        style={this.styleMap[name]}
      >
        <span className="iblock pd2x">{name}</span>
      </Badge>
    )
  }

  renderItem = item => {
    let {
      text,
      id
    } = item
    return (
      <div className="fix pd2" key={id}>
        <div className="fleft">
          {text}
        </div>
      </div>
    )
  }

  renderList = arr => {
    return (
      <List
        dataSource={arr}
        bordered
        renderItem={this.renderItem}
      />
    )
  }

  renderPane = (name) => {
    let arr = this.state[name]
    return (
      <TabPane
        key={name}
        tab={this.renderPaneTitle(name, arr)}
      >
        {
          this.renderList(arr)
        }
      </TabPane>
    )
  }

  renderQueueList = () => {
    let {
      working,
      started
    } = this.state
    let extra = started
      ? (
        <Button
          type="primary"
          onClick={
            working
              ? this.pause
              : this.resume
          }
        >
          {
            working
              ? '暂停'
              : '继续'
          }
        </Button>
      )
      : null
    let arrNames = [
      'tasks'
    ]
    return (
      <Tabs
        defaultActiveKey={arrNames[0]}
        tabBarExtraContent={extra}
      >
        {
          arrNames.map(this.renderPane)
        }
      </Tabs>
    )
  }

  renderProgress = () => {
    return (
      <div className="queue-process">
        {this.renderCurrentTarget()}
        {this.renderQueueList()}
      </div>
    )
  }

  render() {
    let {
      hide,
      loading,
      currentTarget
    } = this.state
    let cls = hide
      ? 'ardy-hide'
      : ''
    let type = hide
      ? 'arrow-right'
      : 'arrow-left'
    return (
      <div id="ardy" className={cls}>

        <div className="pd2">
          <Icon
            type={type}
            className="pointer"
            onClick={this.toggle}
          />
        </div>
        <div className="ardy-content">
          <div className="pd2y">
            批城手扶独轮车
          </div>
          <AutoForm
            stop={this.stop}
            queue={this.queue}
            loading={loading}
          />
          {this.renderProgress()}
          <TextHandler
            target={currentTarget}
            report={this.onReport}
          />
        </div>
      </div>
    )
  }
}
