import React from 'react';
import { message } from 'antd';
import { useIntl, history, useModel } from 'umi';
import { postLogin, getUserInfo } from '@/services/api';
import { localSave } from '@/utils/store';
/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    history.push('/')
    // const { query } = history.location;
    // const { redirect } = query as { redirect: string };
    // history.push(redirect || '/goods');
  }, 10);
};

const Login: React.FC<{}> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { formatMessage } = useIntl();

  const fetchUserInfo = async () => {
    const response = await getUserInfo();
    if (response.code === 200) {
      const { data } = response;
      if (data) {
        setInitialState({
          ...initialState,
          currentUser: data,
        });
      }
    }
  };

  const handleSubmit = async (values: {
    username: string,
    password: string
  }) => {
    const response = await postLogin(values);
    if (response.code === 200) {
      const { data: { token } } = response;
      localSave('auctionWebToken', token);
      /* 保持1天
      const expire = 3600 * 24;
          localSave('auctionWebToken', token, expire);
      */
      await fetchUserInfo();
      goto();

    }
    // message.error(formatMessage({
    //   id: 'project.message.login.error',
    //   defaultMessage: '登录失败，请重试',
    // }));
  };

  const checkData = () => {
    const username = document.getElementById("login-account").value
    const password = document.getElementById("login-pass").value
    if (username && password) {
      handleSubmit({ username, password })
    } else {
      message.warning(formatMessage({
        id: 'project.message.login.warning',
        defaultMessage: '请输入正确的账号,密码',
      }))
    }
  }

  return (
    <>
      <div className="hero-section">
        <div className="bg_img hero-bg bottom_center"
          style={{ backgroundImage: `url(${require('../../../../public/images/banner/hero-bg.png')})` }}
        />
      </div>

      <section className="account-section padding-bottom">
        <div className="container">
          <div className="account-wrapper mt--100 mt-lg--440">
            <div className="left-side">
              <div className="section-header">
                <h2 className="title">{formatMessage({
                  id: 'project.name',
                  defaultMessage: '在线拍卖系统',
                })}</h2>
                <p>{formatMessage({ id: 'project.banner.title5', defaultMessage: '随时随地 买您想买' })}</p>
              </div>
              <div className="login-form">
                <div className="form-group mb-30">
                  <label><i className="far fa-envelope" /></label>
                  <input
                    type="text"
                    id="login-account"
                    placeholder={formatMessage({
                      id: 'project.user.account',
                      defaultMessage: '请输入账号',
                    })}
                    style={{ width: '100%' }}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        checkData()
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-lock" /></label>
                  <input
                    type="password"
                    id="login-pass"
                    placeholder={formatMessage({
                      id: 'project.user.password',
                      defaultMessage: '请输入密码',
                    })}
                    style={{ width: '100%' }}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        checkData()
                      }
                    }}
                  />
                  {/* <span className="pass-type"><i className="fas fa-eye" /></span> */}
                </div>
                <div className="form-group">
                  {/* <a>{formatMessage({
                    id: 'project.user.forget',
                    defaultMessage: '忘记密码',
                  })}</a> */}
                </div>
                <div className="form-group mb-0">
                  <button type="button" className="custom-button" onClick={() => {
                    checkData()
                  }
                  }>{formatMessage({
                    id: 'project.user.login',
                    defaultMessage: '登录',
                  })}</button>
                </div>
              </div>
            </div>
            <div className="right-side cl-white">
              <div className="section-header mb-0">
                {/* <h3 className="title mt-0">马上体验</h3>
                <p>注册并创建您的帐户</p>
                <a className="custom-button transparent">{formatMessage({
                  id: 'project.user.register',
                  defaultMessage: '注册',
                })}</a> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
};

export default Login;
