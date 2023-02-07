import React from 'react';
import { history, useIntl, useModel } from 'umi'
import { Modal, Form, Input, message } from 'antd';
import { postLogout, modifyPassWord } from '@/services/api';
import { localRemove } from '@/utils/store';

const ModifyPassWord: React.FC<{ props: any }> = (props) => {
  const { visible } = props
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  /**
 * 退出登录，并且将当前的 url 保存
 */
  const loginOut = async () => {
    const response = await postLogout();
    if (response.code === 200) {
      localRemove('auctionWebToken')
      history.push('/user/login');
    }
    // const { query, pathname } = history.location;
    // const { redirect } = query;
    // // Note: There may be security issues, please note
    // if (window.location.pathname !== '/user/login' && !redirect) {
    //   history.replace({
    //     pathname: '/user/login',
    //     search: stringify({
    //       redirect: pathname,
    //     }),
    //   });
    // }
  };

  const submitForm = async () => {
    const fieldsValue = await form.validateFields();
    const response = await modifyPassWord({
      password: fieldsValue.password,
      old_password: fieldsValue.old_password,
    })
    if (response.code === 201) {
      message.success(formatMessage({
        id: 'project.message.password.success',
        defaultMessage: '修改成功',
      }))
      setInitialState({ ...initialState, currentUser: undefined });
      props.onCancel()
      loginOut()
    }
  };

  return (
    <Modal
      title={formatMessage({
        id: 'project.user.modify',
        defaultMessage: '修改密码',
      })}
      visible={visible}
      destroyOnClose
      closable={false}
      maskClosable={false}
      onCancel={() => {
        props.onCancel()
      }}
      onOk={() => {
        submitForm();
      }}
    // style={{ position: 'absolute', zIndex: 99 }}
    >
      <Form {...layout} form={form}>
        <Form.Item
          label={formatMessage({
            id: 'project.user.oldPassword',
            defaultMessage: '原密码',
          })}
          name="old_password"
          rules={[{ required: true, message: formatMessage({ id: 'project.user.hintOldPsw', defaultMessage: '请输入原密码' }) }]}
        >
          <Input type='password' />
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'project.user.newPassword',
            defaultMessage: '新密码',
          })}
          name="password"
          rules={[{ required: true, message: formatMessage({ id: 'project.user.hintNewPsw', defaultMessage: '请输入新密码' }) }]}
        >
          <Input type='password' />
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'project.user.newPassword2',
            defaultMessage: '确认密码',
          })}
          name="password2"
          rules={[{
            required: true,
            validator: (_, value, callback) => {
              if (value) {
                if (value !== form.getFieldValue('password')) {
                  callback(
                    formatMessage({ id: 'project.user.hintCompare', defaultMessage: '两次密码输入不一致' })
                  )
                } else {
                  callback()
                }
              } else {
                callback(formatMessage({ id: 'project.user.hintNewPsw', defaultMessage: '请输入新密码' }))
              }
            }
          }]}
        >
          <Input type='password' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModifyPassWord
