import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { modifyUserInfo } from '@/services/api';
import ScrollToTopSection from '@/components/ScrollToTopSection'
import ModifyPassWord from '@/components/ModifyPassWord'
import CategoryModal from '@/components/CategoryModal';
import { localGet } from '@/utils/store';
import { uploadURL } from '@/utils/constants';

const Profile: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const [infoVisible, setInfoVisible] = useState<boolean>(false)
  const [mpVisible, setMpVisible] = useState<boolean>(false)
  const [cateVisible, setCateVisible] = useState<boolean>(false)
  const { getCategoryName, collectionCateData } = useModel('dataModel');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const { formatMessage } = useIntl();

  const showInfoModal = () => {
    form.setFieldsValue(currentUser)
    setInfoVisible(true)
  }

  const onCancel = () => {
    form.resetFields();
    setInfoVisible(false);
  };

  const uploadChange = (info: any) => {
    if (info.file.status === 'done') {
      const { response } = info.file;
      if (response.code === 201) {
        if ('data' in response) {
          const { data } = response;
          const tempData = { ...currentUser }
          tempData.avatar = data.avatar
          setInitialState({ ...initialState, currentUser: tempData });
          message.success(
            formatMessage({ id: 'project.user.hintUpload', defaultMessage: '更新头像成功' })
          )
        }
      }
    }
  }
  const submitForm = async () => {
    const fieldsValue = await form.validateFields();
    const params = {
      username: fieldsValue.username,
      email: fieldsValue.email,
      extend: fieldsValue.extend,
    };
    const response = await modifyUserInfo(params)
    if (response.code === 201) {
      message.success(
        formatMessage({ id: 'project.user.hintEdit', defaultMessage: '编辑成功' })
      );
      const tempData = { ...currentUser }
      tempData.username = params.username
      tempData.email = params.email
      tempData.extend = params.extend
      setInitialState({ ...initialState, currentUser: tempData });
      setInfoVisible(false)
    }
  };

  const renderInfoModal = () => {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        title={formatMessage({ id: 'project.user.modalTitle', defaultMessage: '编辑用户信息' })}
        visible={infoVisible}
        destroyOnClose
        onCancel={() => {
          onCancel();
        }}
        onOk={() => {
          submitForm();
        }}
      >
        <Form {...layout} form={form}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'project.user.email', defaultMessage: '邮箱' })}
            name="email"
            rules={[{ required: true, message: formatMessage({ id: 'project.user.hintEmail', defaultMessage: '请输入邮箱' }) }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'project.user.remark', defaultMessage: '备注' })}
            name="extend"
          >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  const renderCollectionData = () => {
    const temp = []
    if (collectionCateData && collectionCateData.length > 0) {
      collectionCateData.forEach((item: any) => {
        temp.push(getCategoryName(item.category_id))
      })
    }
    return temp.join(', ')
  }

  return (
    <>
      <ScrollToTopSection loading={currentUser && currentUser.username} />

      <div className="col-lg-9" >
        <div className="row">
          <div className="col-12">
            <div className="dash-pro-item mb-30 dashboard-widget">
              <div className="header">
                <h4 className="title">{formatMessage({ id: 'project.user.info', defaultMessage: '个人信息' })}</h4>
                <span className="edit" onClick={() => {
                  showInfoModal()
                }}><i className="flaticon-edit" /> {formatMessage({ id: 'project.user.edit', defaultMessage: '编辑' })}</span>
              </div>
              <ul className="dash-pro-body">
                <li>
                  <div className="info-name">{formatMessage({ id: 'project.user.userName', defaultMessage: '用户名' })}</div>
                  <div className="info-value">{currentUser?.username}</div>
                </li>
                {/* <li>
                  <div className="info-name">Email</div>
                  <div className="info-value">{currentUser?.email}</div>
                </li> */}
                <li>
                  <div className="info-name">{formatMessage({ id: 'project.user.remark', defaultMessage: '备注' })}</div>
                  <div className="info-value">{currentUser?.extend}</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12">
            <div className="dash-pro-item mb-30 dashboard-widget">
              <div className="header">
                <h4 className="title">{formatMessage({ id: 'project.user.email', defaultMessage: '邮箱' })}</h4>
                <span className="edit" onClick={() => {
                  showInfoModal()
                }}><i className="flaticon-edit" /> {formatMessage({ id: 'project.user.edit', defaultMessage: '编辑' })}</span>
              </div>
              <ul className="dash-pro-body">
                <li>
                  <div className="info-name">Email</div>
                  <div className="info-value">{currentUser?.email}</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12">
            <div className="dash-pro-item mb-30 dashboard-widget">
              <div className="header">
                <h4 className="title">{formatMessage({ id: 'project.user.avatar', defaultMessage: '头像' })}</h4>
                {/* <span className="edit" onClick={() => {
                  showInfoModal()
                }}><i className="flaticon-edit" /> 编辑</span> */}
              </div>
              <ul className="dash-pro-body">
                <li>
                  <div className="info-name">{formatMessage({ id: 'project.user.avatar', defaultMessage: '头像' })}</div>
                  <div className="info-value">
                    <Upload
                      accept=".png, .jpg, .jpeg"
                      action={uploadURL}
                      onChange={uploadChange}
                      headers={{
                        authorization: `Bearer ${localGet('auctionWebToken')}`
                      }}
                      data={{
                        module_name: 'user'
                      }}
                      showUploadList={false}
                    >
                      <div style={{ width: '100px', height: '100px', display: 'grid', placeItems: 'center' }}>
                        <PlusOutlined />{formatMessage({ id: 'project.user.upload', defaultMessage: '上传头像' })}
                      </div>
                    </Upload>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12">
            <div className="dash-pro-item mb-30 dashboard-widget">
              <div className="header">
                <h4 className="title">{formatMessage({ id: 'project.user.save', defaultMessage: '安全' })}</h4>
                <span className="edit" onClick={() => {
                  setMpVisible(true)
                }}><i className="flaticon-edit" /> {formatMessage({ id: 'project.user.edit', defaultMessage: '编辑' })}</span>
              </div>
              <ul className="dash-pro-body">
                <li>
                  <div className="info-name">{formatMessage({ id: 'project.user.psw', defaultMessage: '密码' })}</div>
                  <div className="info-value">xxxxxxxxxxxxxxxx</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12">
            <div className="dash-pro-item dashboard-widget">
              <div className="header">
                <h4 className="title">{formatMessage({ id: 'project.user.interest', defaultMessage: '关注的拍品分类' })}</h4>
                <span className="edit" onClick={() => {
                  setCateVisible(true)
                }}><i className="flaticon-edit" /> {formatMessage({ id: 'project.user.edit', defaultMessage: '编辑' })}</span>
              </div>
              <ul className="dash-pro-body">
                <li>
                  {/* <div className="info-name">密码</div> */}
                  <div className="info-value">{renderCollectionData()}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {renderInfoModal()}

      <ModifyPassWord
        visible={mpVisible}
        onCancel={() => { setMpVisible(false) }}
      />

      <CategoryModal
        visible={cateVisible}
        modalCancel={() => {
          setCateVisible(false)
        }}
        onSucc={() => {
          setCateVisible(false)
        }}
      />
    </>
  )
}
export default Profile
