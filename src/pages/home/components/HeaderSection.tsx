import React from 'react';
import { useIntl } from 'umi';
import PageHeader from '@/components/PageHeader';

const HeaderSection: React.FC<{}> = () => {
  const { formatMessage } = useIntl();

  return (
    <header>
      {/* <PageHeader />

      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <ul className="menu ml-auto" style={{ marginTop: 15 }}>
              <li>
                <a>
                  {formatMessage({
                    id: 'project.menu.home',
                    defaultMessage: '首页',
                  })}
                </a>
              </li>
              <li>
                <a>{formatMessage({
                  id: 'project.menu.auction',
                  defaultMessage: '拍卖日历',
                })}</a>
                <ul className="submenu">
                  <li>
                    <a>Starbuyer</a>
                  </li>
                  <li>
                    <a>Komehyo</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>{formatMessage({
                  id: 'project.menu.contact',
                  defaultMessage: '联系我们',
                })}</a>
              </li>
            </ul>
            <form className="search-form white">
              <input type="text" placeholder={formatMessage({
                id: 'project.banner.search',
                defaultMessage: '请输入搜索条件',
              })} style={{ width: '100%' }} />
              <button type="button"><i className="fas fa-search" /> </button>
            </form>
            <div className="search-bar d-md-none">
              <a><i className="fas fa-search" /></a>
            </div>
            <div className="header-bar d-lg-none">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div> */}
    </header >
  )
}

export default HeaderSection
