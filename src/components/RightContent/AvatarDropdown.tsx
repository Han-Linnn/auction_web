import React, { useCallback, useState } from 'react';
import { useIntl, history, useModel } from 'umi'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { localRemove } from '@/utils/store';
import { postLogout } from '@/services/api';
// import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import ModifyPassWord from '../ModifyPassWord'

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

const AvatarDropdown: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [visible, setVisible] = useState<boolean>(false)

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'center' && initialState) {
        history.push('/account')
      }
      if (key === 'settings' && initialState) {
        setVisible(true)
      }
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
      }
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="center">
        <UserOutlined />
        {formatMessage({
          id: 'project.user.personal',
          defaultMessage: '个人中心',
        })}
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined />
        {formatMessage({
          id: 'project.user.modify',
          defaultMessage: '修改密码',
        })}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        {formatMessage({
          id: 'project.user.logout',
          defaultMessage: '退出登录',
        })}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <div className={`${styles.action} ${styles.account}`} style={{ cursor: 'pointer', height:'30px', width:'100px' }}>
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          <UserOutlined style={{ color: 'white', fontSize: '20px' }} />
          <span style={{ color: 'white', marginLeft: '5px', fontSize: '15px' }}>{currentUser.username}</span>
        </div>
      </HeaderDropdown>
      <ModifyPassWord
        visible={visible}
        onCancel={() => { setVisible(false) }}
      />
    </>
  );
};

export default AvatarDropdown;
