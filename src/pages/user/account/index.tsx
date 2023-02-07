import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import BidsAndFavorites from './components/BidsAndFavorites';

const MyAccount: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [tabIndex, setTabIndex] = useState(0)
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;

  const renderLeftDiv = () => {
    return (
      <div className="col-sm-10 col-lg-3">
        <div className="dashboard-widget mb-30 mb-lg-0 sticky-menu">
          <div className="user">
            <div className="thumb-area">
              <div className="thumb">
                <img src={currentUser?.avatar || "/images/dashboard/user.png"} alt="user" />
              </div>
              {/* <label htmlFor="profile-pic" className="profile-pic-edit"><i className="flaticon-pencil" /></label> */}
              <input type="file" id="profile-pic" className="d-none" />
            </div>
            <div className="content">
              <h5 className="title"><a>{currentUser?.username}</a></h5>
              <span className="username">{currentUser?.email}</span>
            </div>
          </div>
          <ul className="dashboard-menu">
            <li>
              <a className={tabIndex === 0 ? "active" : ''} onClick={() => {
                setTabIndex(0)
              }}><i className="flaticon-dashboard" />{formatMessage({ id: 'project.user.record', defaultMessage: '我的记录' })}</a>
            </li>
            <li>
              <a className={tabIndex === 1 ? "active" : ''} onClick={() => {
                setTabIndex(1)
              }}><i className="flaticon-settings" />{formatMessage({ id: 'project.user.info', defaultMessage: '个人资料' })}</a>
            </li>
            <li>
              <a className={tabIndex === 2 ? "active" : ''}
                onClick={() => {
                  setTabIndex(2)
                }}
              ><i className="flaticon-star" />{formatMessage({
                id: 'project.user.collection',
                defaultMessage: '我的收藏',
              })}</a>
            </li>
            <li>
              <a className={tabIndex === 3 ? "active" : ''} onClick={() => {
                setTabIndex(3)
              }}><i className="flaticon-auction" />{formatMessage({
                id: 'project.user.bids',
                defaultMessage: '竞价历史',
              })}</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  const renderSubPage = () => {
    const lstPage = [
      <Dashboard />, // 我的记录
      <Profile />, // 个人资料
      <BidsAndFavorites type="collection" />, // 我的收藏
      <BidsAndFavorites type="bid" />, // 竞价历史
    ]
    return lstPage[tabIndex]
  }

  return (
    <>
      <section className="dashboard-section padding-bottom mt--240 mt-lg--440 pos-rel">
        <div className="container2" style={{ marginTop: '120px' }}>
          <PageBreadcrumb routes={[{ name: formatMessage({ id: 'project.user.pageBread', defaultMessage: '个人中心' }), path: null }]} />
          <div className="row justify-content-center">
            {renderLeftDiv()}
            {renderSubPage()}
          </div>
        </div>
      </section>
    </>
  )
}

export default MyAccount
