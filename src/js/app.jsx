import React from 'react'
import {
  Tabs, List,
  Button, Badge, Icon
} from 'antd'
import _ from 'lodash'
import AutoForm from './form'
import {generate} from 'shortid'
import copy from 'json-deep-copy'

const ListItem = List.Item
const {TabPane} = Tabs
const hosts2 = [
  '雪雪', '佩佩', '菲菲', '今今', '❄️❄️'
]
const hosts1 = [
  '雪', '佩', '菲', '今', '妮', '❄️'
]
const names = '秋准,SPACE销售冠军,SPACE酒吧销售部,SPACE酒吧气氛部佩组,相约98,麻辣香佩,宁波小佩佩,武田华佩,不死佩,暴佩1安排土豪1,🍓🍓🍓,佩佩三号,这个佩佩不太冷,不二不叫王小佩,佩佩宝宝,高冷女神王小佩,小佩佩儿,呆佩儿小霸王,软妹小佩佩,小佩佩佩,王佩,91佩女士,🍓🍓,妹中妹,大树苗,乙肝病友协会,转子哥,儒雅随和的艾文,艾文,永远的老公粉625,平安牛皮糖,佩的男孩,冰箱周礼,🍓'.split(',')
function replace2 (n) {
  let len = hosts2.length
  let r = Math.floor(Math.random() * len)
  let m = hosts2[r]
  return n.replace('佩佩', m)
}
function replace1 (n) {
  let len = hosts1.length
  let r = Math.floor(Math.random() * len)
  let m = hosts1[r]
  return n.replace('佩', m)
}
function randName() {
  let len = names.length
  let r = Math.floor(Math.random() * len)
  let n = names[r]
  if (n.includes('佩佩')) {
    n = replace2(n)
  } else if (n.includes('佩')) {
    n = replace1(n)
  }
  return n
}
function seedName() {
  let d = new Date()
  let y = d.getFullYear()
  let m = d.getMonth()
  let dt = d.getDate()
  let seed = y * 365 + m * 30 + dt - 9
  if (true) {
    return randName()
  }
  let n = Math.floor( seed / 2)
  let len = names.length
  let r = n % len
  return names[r]
}

function randTail() {
  let pool = '1234567890abcdefghijklmnwuvxyzrstopq;'.split('')
  return pool[Math.floor(Math.random() * pool.length)]
}

export default class App extends React.PureComponent {
  state ={
    tasks: [],
    working: false,
    started: false,
    currentTarget: null,
    prefix: false,
    topHref: 'g'
  }

  componentDidMount() {
    window.addEventListener('message', (e) => {
      if (!e.data) {
        return
      }
      if (e.data.type !== 'url') {
        return
      }
      this.setState({
        topHref: e.data.href
      })
    })
  }

  changePrefix = prefix => {
    this.setState({
      prefix
    })
  }

  pause = () => {
    clearTimeout(this.xtimer)
    this.setState({
      working: false,
      currentTarget: null
    })
  }

  resume = () => {
    this.setState({
      working: true
    }, this.next)
  }

  getRandomTarget = (tasks) => {
    let n = _.random(0, tasks.length - 1)
    return tasks[n]
  }

  onReportId = null
  //this means one phone call finished
  //lets handle the result
  onReport = (target = {}) => {
    let {prefix} = this.state
    if (!this.state.working || !target.id) {
      return
    }
    if (this.onReportId === target.id) {
      return
    }
    clearTimeout(this.xtimer)
    this.onReportId = target.id
    let {delay, text} = target
    let top = window.top || window
    let pre = prefix ? `[${seedName()}]` : ''
    let msg = `${pre}${text.replace(/母狗|卖批女/g, '我爱王佩')}`
    console.log(msg)
    top.postMessage({
      type: 'ab-msg',
      text: msg
    }, '*')
    this.setState(old => {
      let {id} = target
      let tasks = copy(old.tasks).filter(t => t.id !== id)
      return {
        tasks,
        currentTarget: this.getRandomTarget(tasks)
      }
    }, () => {
      this.xtimer = setTimeout(
        this.next,
        delay
      )
    })
  }

  next = () => {
    let currentTarget = this.state.tasks[0]
    if (!currentTarget) {
      return this.setState({
        started: false
      })
    }
    this.setState(old => {
      return {
        currentTarget: this.getRandomTarget(old.tasks)
      }
    }, this.startQueue)
  }

  queue = async ({text, repeat, sep}) => {
    let ns = text.split(/\n/).filter(f => f)
    let tasks = []
    let {length} = ns
    for (let i = 0; i < repeat;i ++) {
      let r = _.random(0, length - 1)
      let tx = ns[r]
      let delay = Math.floor(
        sep * 1000 * (1 + _.random(.1, .2))
      )
      let tail = randTail()
      tasks.push({
        id: 'id_' + generate(),
        text: tx + tail,
        coreText: tx,
        delay
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
        currentTarget: this.getRandomTarget(tasks) || null
      }, this.startQueue)
    }
  }

  startQueue = () => {
    this.onReport(this.state.currentTarget)
  }

  onFilter = coreText => {
    this.setState({
      tasks: this.state.tasks.filter(t => t.coreText !== coreText)
    })
  }

  clear = () => {
    clearTimeout(this.xtimer)
    this.setState({
      working: false,
      started: false,
      currentTarget: null,
      tasks: []
    })
  }

  renderCurrentTarget = () => {
    let {currentTarget} = this.state
    if (!currentTarget) {
      return null
    }
    let {
      text,
      delay
    } = currentTarget
    return (
      <div className="current-target pd1">
        正在发送 <code>{text}</code>, {Math.floor(delay/1000)}秒后发送下一条
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
      id,
      coreText
    } = item
    return (
      <ListItem>
        <div className="fix pd2x pd1y autobb-item-wrap" key={id}>
          <div className="fleft">
            {text}
          </div>
          <div className="fright">
            <Icon
              type="close"
              className="autobb-on-filter"
              onClick={() => this.onFilter(coreText)}
              title="去掉所有同样的弹幕"
            />
          </div>
        </div>
      </ListItem>
    )
  }

  renderList = arr => {
    return (
      <List
        dataSource={arr}
        bordered
        renderItem={this.renderItem}
        pagination={{
          total: arr.length
        }}
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
      started,
      tasks
    } = this.state
    let extra = started
      ? (
        <Button
          type="primary"
          key="pauser"
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
    let clearBtn = tasks.length
      ? (
        <Button
          type="primary"
          key="clearbtn"
          className="mg1r"
          onClick={this.clear}
        >
          清空所有队列
        </Button>
      )
      : null
    let arrNames = [
      'tasks'
    ]
    return (
      <Tabs
        defaultActiveKey={arrNames[0]}
        tabBarExtraContent={[clearBtn, extra]}
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
      loading,
      topHref,
      prefix
    } = this.state
    return (
      <div id="ardy">
        <div className="ardy-content pd2">
          <h1 className="pd2y" className="iblock mg1r" target="_blank">
            <a href="https://www.douyu.com/t/HHW">
              <img
                src={require('../../dist/icons/rc32.png')}
              />
            </a>
            <span className="iblock">批城手扶弹幕独轮车</span>
          </h1>
          {
            topHref
              ? (
                <AutoForm
                  stop={this.stop}
                  queue={this.queue}
                  loading={loading}
                  prefix={prefix}
                  changePrefix={this.changePrefix}
                  topHref={topHref}
                />
              )
              : (
                <div>
                  <b>加载中...已经升级,如果一直无法加载,请到</b>
                  <a href="https://github.com/zxdong262/auto-barrage-dy/releases">https://github.com/zxdong262/auto-barrage-dy/releases</a>
                  <b>下载新版插件,文件名 dist.zip</b>
                </div>
              )
          }
          {this.renderProgress()}
          <p>如果因为斗鱼改版无法正常工作请联系zxdong@gmail.com更新</p>
        </div>
      </div>
    )
  }
}
