import React, { useEffect } from 'react';
import { history, useIntl, useModel, getLocale, setLocale } from 'umi';
import { Menu, Dropdown } from 'antd';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { lang } from '@/utils/constants';
import Avatar from '../RightContent/AvatarDropdown';
import styles from './index.less'

const PageHeader: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const { getCategoryName, getCollectionCate, collectionCateData } = useModel('dataModel');

  useEffect(() => {
    getCollectionCate()
  }, [])

  const clickSearch = () => {
    const { value } = document.getElementById("heahderSearch")
    if (value) {
      history.push({
        pathname: '/goods',
        query: {
          title: value
        },
      })
    }
  }

  const renderCollectionCate = () => {
    const children = []
    if (collectionCateData && collectionCateData.length > 0) {
      collectionCateData.forEach((item: any, index: number) => {
        if (index < 3) {
          children.push(<li
            key={item.key}
            onClick={() => {
              history.push({
                pathname: '/goods',
                query: {
                  categoryId: item.category_id
                },
              })
            }}>
            <a>{getCategoryName(item.category_id)}</a>
          </li>)
        }
      })

      if (collectionCateData.length > 3) {
        const subchildren = []
        collectionCateData.forEach((item: any, index: number) => {
          if (index >= 3) {
            subchildren.push(<li
              key={item.key}
              onClick={() => {
                history.push({
                  pathname: '/goods',
                  query: {
                    categoryId: item.category_id
                  },
                })
              }}>
              <a>{getCategoryName(item.category_id)}</a>
            </li>)
          }
        })

        children.push(<li key='li-other'>
          <a>{formatMessage({ id: 'project.menu.other', defaultMessage: '??????' })}</a>
          {subchildren.length > 0 ? <ul className="submenu">
            {subchildren}
          </ul> : null}
        </li>)
      }
    }
    if (children.length > 0) {
      return <>{children}</>
    }
    return null
  }

  const renderMobileCollectionCate = () => {
    const children = []
    if (collectionCateData && collectionCateData.length > 0) {
      collectionCateData.forEach((item: any, index: number) => {
        if (index < 3) {
          children.push(<Menu.Item key={item.key}>
            <a onClick={() => {
              history.push({
                pathname: '/goods',
                query: {
                  categoryId: item.category_id
                },
              })
            }}>
              {getCategoryName(item.category_id)}
            </a>
          </Menu.Item>)
        }
      })

      if (collectionCateData.length > 3) {
        const subchildren = []
        collectionCateData.forEach((item: any, index: number) => {
          if (index >= 3) {
            subchildren.push(<Menu.Item key={item.key}>
              <a onClick={() => {
                history.push({
                  pathname: '/goods',
                  query: {
                    categoryId: item.category_id
                  },
                })
              }}>
                {getCategoryName(item.category_id)}
              </a>
            </Menu.Item>)
          }
        })

        children.push(
          <Menu.SubMenu key='menu_other' title="??????">
            {subchildren}
          </Menu.SubMenu>
        )
      }
    }
    if (children.length > 0) {
      return <>{children}</>
    }
    return null
  }


  const renderMobileMenu = () => (
    <Menu>
      <Menu.Item key='menu_home'>
        <a onClick={() => {
          history.push('/')
        }}>
          {formatMessage({
            id: 'project.menu.home',
            defaultMessage: '??????',
          })}
        </a>
      </Menu.Item>
      <Menu.SubMenu key='menu_auction' title="?????????">
        <Menu.Item>
          <a onClick={() => {
            history.push('/event')
          }}>
            {formatMessage({ id: 'project.menu.auction', defaultMessage: '????????????' })}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={() => {
              history.push({
                pathname: '/event',
                query: {
                  hot: true
                },
              })
            }}>
            {formatMessage({ id: 'project.menu.hot', defaultMessage: '???????????????' })}
          </a>
        </Menu.Item>
      </Menu.SubMenu>
      {renderMobileCollectionCate()}
    </Menu>
  )

  const renderLang = () => {
    const loacle = () => {
      switch (getLocale()) {
        case 'ja-JP':
          return '?????????'
        case 'en-US':
          return 'English'
        case 'zh-CN':
          return '????????????'
        case 'zh-TW':
          return '????????????'
        default:
          return '????????????'
      }
    }

    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => {
            sessionStorage.setItem(lang, 'ja-JP');
            setLocale('ja-JP')
          }}>
            ?????????
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => {
            sessionStorage.setItem(lang, 'en-US');
            setLocale('en-US')
          }}>
            English
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => {
            sessionStorage.setItem(lang, 'zh-CN');
            setLocale('zh-CN')
          }}>
            ????????????
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => {
            sessionStorage.setItem(lang, 'zh-TW');
            setLocale('zh-TW')
          }}>
            ????????????
          </a>
        </Menu.Item>

      </Menu>
    )

    return (
      <Dropdown overlay={menu} trigger={['click', 'hover']}>
        <div className={styles.lang}>
          <GlobalOutlined className={styles.global} />
          <span className={styles.text}>{loacle()}</span>
          <DownOutlined className={styles.down} />
        </div>
      </Dropdown>
    )
  }

  return (
    <header>
      <div className="header-top">
        <div className="container">
          <div className="header-top-wrapper">
            <ul className="customer-support">
              <li>
                <p
                  style={{ color: 'white', fontSize: '1.3em', cursor: 'pointer' }}
                  onClick={() => {
                    history.push('/')
                  }}
                >
                  {formatMessage({
                    id: 'project.name',
                    defaultMessage: '??????????????????',
                  })}
                </p>
              </li>
            </ul>
            <ul className="cart-button-area" style={{ marginTop: '10px' }}>
              <li>
                {renderLang()}
              </li>
              <li>
                <Avatar />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo">
              <a onClick={() => {
                history.push('/')
              }}>
                <img src="./logo.png" alt="logo" />
              </a>
            </div>
            <ul className="menu ml-auto" style={{ marginTop: 15 }}>
              <li>
                <a onClick={() => {
                  history.push('/')
                }}>
                  {formatMessage({
                    id: 'project.menu.home',
                    defaultMessage: '??????',
                  })}
                </a>
              </li>
              <li>
                <a onClick={() => {
                  history.push('/event')
                }}>{formatMessage({ id: 'project.menu.auction', defaultMessage: '?????????' })}</a>
                <ul className="submenu ">
                  <li>
                    <a onClick={() => {
                      history.push('/event')
                    }}>{formatMessage({ id: 'project.menu.auction', defaultMessage: '????????????' })}</a>
                  </li>
                  <li>
                    <a onClick={() => {
                      history.push({
                        pathname: '/event',
                        query: {
                          hot: true
                        },
                      })
                    }}>{formatMessage({ id: 'project.menu.hot', defaultMessage: '???????????????' })}</a>
                  </li>
                </ul>
              </li>
              {renderCollectionCate()}
            </ul>
            <div className="product-search">
              <input
                type="text"
                id='heahderSearch'
                placeholder={formatMessage({
                  id: 'project.banner.search',
                  defaultMessage: '?????????????????????',
                })}
                style={{ width: '100%', backgroundColor: 'white' }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    clickSearch()
                  }
                }}
              />
              <button type="button" onClick={() => {
                clickSearch()
              }}><i className="fas fa-search" /> </button>
            </div>
            <Dropdown trigger={['click']} overlay={renderMobileMenu()}>
              <a className="header-bar d-lg-none" onClick={e => e.preventDefault()}>
                <span />
                <span />
                <span />
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
