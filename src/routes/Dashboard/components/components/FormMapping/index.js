import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;

import styles from './style.sass'

export default class C extends React.Component {
  state = {
    size: 'haier',
    size2: 'qd',
    checkedList: [],
  }

  render() {
    const {onChange, item, onRemove} = this.props
    const { size, size2 } = this.state;
    const formItemLayout4 = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        pull: 0,
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        push: 0
      },
      style: {
        marginBottom: '10px'
      }
    }

    return (
      <div>
        <section className={`${styles["card-form"]} ${styles["width-260"]}`}>
          <div className={styles["card-header"]}>MYSQL</div>
          <Form className={styles["card-body"]}>
            <FormItem
              {...formItemLayout4}
              label="地点"
              hasFeedback
            >
             <Radio.Group value={size}>
              <Radio.Button value="haier">青岛</Radio.Button>
              <Radio.Button value="nohaier">北京</Radio.Button>
            </Radio.Group>
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="资源"
              hasFeedback
            >
             <Radio.Group value={size}>
              <Radio.Button value="haier">高</Radio.Button>
              <Radio.Button value="nohaier">中</Radio.Button>
              <Radio.Button value="nohaier">低</Radio.Button>
            </Radio.Group>
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="分片"
              hasFeedback
            >
             1024G
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="备份"
              hasFeedback
            >
              <Radio.Group value={size} onChange={e => this.setState({size: e.target.value})}>
                <Radio.Button value="haier">是</Radio.Button>
                <Radio.Button value="nohaier">否</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Form>
        </section>
        <br/>
        <section className={`${styles["card-form"]} ${styles["width-260"]}`}
                 style={{marginTop: '2px', marginBottom: '20px'}}
        >
          <Button style={{width: '100%'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
        </section>
      </div>
    )
  }
}
