import {Component} from 'react'
import {
  Form, Button,
  InputNumber
} from 'antd'
import {validateFieldsAndScroll} from './common/dec-validate-and-scroll'
import InputAutoFocus from './common/input-auto-focus'
import {formItemLayout, tailFormItemLayout} from './common/form-layout'

const FormItem = Form.Item
const in562590 = false

@Form.create()
@validateFieldsAndScroll
class AutoForm extends Component {

  handleSubmit = async (e) => {
    e.preventDefault()
    let res = await this.validateFieldsAndScroll()
    if (!res) return
    localStorage.setItem('auto_sep', res.sep)
    //localStorage.setItem('auto_text', res.text)
    this.props.queue(res)
    this.reset()
  }

  reset = () => {
    this.props.form.resetFields()
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const in562590 = this.props.topHref.includes('562590')
    const initRepeat = in562590 ? 10 : 100
    const repeatMax = in562590 ? 20 : 10000
    const {
      text,
      sep = localStorage.getItem('auto_sep') || 8
    } = this.props
    return (
      <Form
        onSubmit={this.handleSubmit}
        className="form-wrap"
        layout="vertical"
      >
        <FormItem
          {...formItemLayout}
          label="请输入弹幕"
          hasFeedback
        >
          {getFieldDecorator('text', {
            rules: [{
              max: 200, message: '不超过200字'
            }, {
              required: true, message: '请输入弹幕'
            }],
            initialValue: text
          })(
            <InputAutoFocus
              inputType="textarea"
              rows={4}
              placeholder="每行一条弹幕，随机发送"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="重复次数"
        >
          {getFieldDecorator('repeat', {
            rules: [
              // {
              //   max: 1000, message: '1000 max'
              // },
              // {
              //   min: 1, message: '1 min'
              // }
            ],
            initialValue: initRepeat
          })(
            <InputNumber
              min={1} max={repeatMax} step={1}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="发送间隔(秒)"
        >
          {getFieldDecorator('sep', {
            rules: [
              // {
              //   max: 5000, message: '5000 max'
              // },
              // {
              //   min: 20, message: '20 min'
              // }
            ],
            initialValue: sep
          })(
            <InputNumber min={1} max={5000} step={1} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <p>
            <Button
              type="primary"
              htmlType="submit"
              className="mg1r"
              loading={this.props.loading}
            >加入发送队列</Button>
            <Button
              type="ghost"
              className="mg1l"
              onClick={this.reset}
            >重置</Button>
          </p>
        </FormItem>
      </Form>
    )
  }

}

export default AutoForm
