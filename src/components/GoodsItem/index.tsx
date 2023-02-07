import React, { useEffect, useState } from 'react';
import { useIntl, useModel, useAccess } from 'umi'
import { Popconfirm, message } from 'antd';
import { postCollection, deleteCollection } from '@/services/api';
import BidModal from '@/components/BidModal'
import NoAccess from '@/components/NoAccess'
import GoodsImage from '@/components/GoodsImage'

const bidData = {
  event_id: -1,
  goods_id: -1,
  goods_name: '',
  goods_img: '',
  start_price: -1,
  last_price: -1,
  minBidPrice: -1,
  bidPriceUnit: -1
}

const goodsItem: React.FC<{
  props: {
    type: number,
    goodsData: any
  }
}> = (props) => {
  const { type, goodsData } = props
  const { formatMessage } = useIntl();
  const access = useAccess()
  const { getCategoryName, getBidRuleByKey, getExchangeLabel, getExchangePrice, getZoneTime } = useModel('dataModel');
  const [bidModalData, setBidModalData] = useState({ visible: false, bidData })
  const [countDownTime, setCountDownTime] = useState('')
  let timer: any

  const checkNotEnd = () => {
    if (goodsData && goodsData.events && goodsData.events.end_time) {
      const endTime = getZoneTime(goodsData?.events?.end_time).replace(/-/g, '/')
      return (Date.parse(endTime) - Date.parse(getZoneTime(new Date()).replace(/-/g, '/'))) > 1000
    }
    return false
  }

  const clickStar = async (goods_id: number, collected: boolean) => {
    const tempFun = collected ? deleteCollection : postCollection
    const response = await tempFun({ goods_id });
    if (response.code === (collected ? 202 : 201)) {
      message.success(collected ? formatMessage({
        id: 'project.message.collection.cancel',
        defaultMessage: '取消成功',
      }) : formatMessage({
        id: 'project.message.collection.success',
        defaultMessage: '收藏成功',
      }))
      props.collectionChange()
    }
  }

  const setBidData = (visible: boolean, data: any) => {
    const tempBidData = visible ? {
      event_id: data.event_id,
      goods_id: data.id,
      goods_name: data.title,
      goods_img: (data.pic_small_url && data.pic_small_url.length > 0) ? data.pic_small_url[0] : '',
      start_price: data.start_price,
      last_price: data.last_price,
      minBidPrice: getBidRuleByKey(data.start_price, 'min_bid'),
      bidPriceUnit: getBidRuleByKey(data.start_price, 'bid_unit')
    } : bidData
    setBidModalData({
      visible,
      bidData: tempBidData
    })
  }

  const gotoDetail = (eId: Number, id: Number) => {
    props.onClickDetail(id)
  }

  const countDownEndTime = () => {
    if (goodsData && goodsData.events && goodsData.events.end_time) {
      const now_time = Date.parse(getZoneTime(new Date()).replace(/-/g, '/'));
      const end_time = Date.parse(getZoneTime(goodsData?.events?.end_time).replace(/-/g, '/'))
      let remaining = end_time - now_time;
      timer = setInterval(() => {
        if (remaining > 1000) {
          remaining -= 1000;
          const day = Math.floor((remaining / 1000 / 3600) / 24);
          const hour = Math.floor((remaining / 1000 / 3600) % 24);
          const minute = Math.floor((remaining / 1000 / 60) % 60);
          // const second = Math.floor(remaining / 1000 % 60);
          setCountDownTime(`${day}d ${hour}h ${minute}m`)
        } else {
          clearInterval(timer);
          setCountDownTime('0d 0h 0m')
        }
      }, 1000);
    } else {
      clearInterval(timer);
      setCountDownTime('0d 0h 0m')
    }
  }

  useEffect(() => {
    countDownEndTime()
    return () => {
      clearInterval(timer);
      timer = null
      setCountDownTime('')
    }
  }, [goodsData])

  const renderStarBtn = (id: number, collected: boolean) => {
    if (access.canCollection) {
      if (collected) {
        return (
          <Popconfirm
            title={formatMessage({
              id: 'project.message.collection.confirm',
              defaultMessage: '确认取消收藏?',
            })}
            onConfirm={() => {
              clickStar(id, collected)
            }}
          >
            <a className="rating"><i className="fas fa-star" /></a>
          </Popconfirm>
        )
      }
      return (<a className="rating"><i className="far fa-star" onClick={() => {
        clickStar(id, collected)
      }} /></a>)
    }
    return <a className="rating"><NoAccess /></a>
  }

  const renderCategoryName = () => (
    <span>{`${getCategoryName(goodsData?.category_id)} | ${goodsData?.brand || '-'} | ${goodsData?.series || '-'}`}</span>
  )

  const renderBidBtn = () => {
    if (checkNotEnd()) {
      return (
        <a
          className="custom-button"
          style={{
            color: 'white',
            cursor: checkNotEnd() ? 'pointer' : 'not-allowed'
          }}
          onClick={() => {
            setBidData(true, goodsData)
          }}>{formatMessage({
            id: 'project.goods.bid',
            defaultMessage: '参与竞拍',
          })}</a>
      )
    }
    return <a className="custom-button transparent"
      style={{ cursor: 'not-allowed' }}>{formatMessage({ id: 'project.goods.over', defaultMessage: '拍卖已结束' })}</a>
  }

  // 首页-活动商品
  const rennderTypeOne = () => {
    return (
      <div className="col-sm-10 col-md-6 col-lg-4 col-xl-3 col-xxl-2">
        <div className="auction-item-8">
          <div className="auction-thumb">
            <div className="countdown-area">
              <div className="countdown">
                <div id="min_counter_1" className="count-item">{countDownTime || '0d 0h 0m'}</div>
              </div>
              {renderStarBtn(goodsData.id, goodsData?.collected)}
            </div>
            <span
              className="thumb-area bg_img"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                gotoDetail(goodsData.event_id, goodsData.id)
              }}
            >
              <GoodsImage
                src={`${(goodsData && goodsData.pic_small_url && goodsData.pic_small_url.length > 0) ? goodsData.pic_small_url[0] : null}`}
              />
            </span>
            {/* <img className="thumb-area bg_img"
            src={`${(goodsData && goodsData.pic_small_url && goodsData.pic_small_url.length > 0) ? goodsData.pic_small_url[0] : null}`}
            alt="auction"
            style={{ cursor: 'pointer', maxWidth: '330px', maxHeight: '330px' }}
            onClick={() => {
              gotoDetail(goodsData.event_id, goodsData.id)
            }} /> */}
          </div>
          <div className="auction-content">
            <div className="title-area">
              <div style={{ height: '70px' }}>
                <h6 className="title">
                  <a title={goodsData.title} onClick={() => {
                    gotoDetail(goodsData.event_id, goodsData.id)
                  }}>{goodsData?.title}</a>
                </h6>
              </div>
              <div className="item-feature">
                <p style={{ marginBottom: 0 }}><span>{goodsData?.lot_number || '-'}</span></p>
                <p style={{ marginBottom: 0 }}>{renderCategoryName()}</p>
              </div>
            </div>
            <div className="bid-area">
              {goodsData?.events?.show_price &&
                <div className="bid-amount" style={{ width: '50%', borderRight: '1px solid #bfbee8' }}>
                  <div className="icon">
                    <i className="flaticon-auction" />
                  </div>
                  <div className="amount-content">
                    <div className="current">{`${formatMessage({
                      id: 'project.goods.startPrice',
                      defaultMessage: '起拍价',
                    })}(${getExchangeLabel()})`}</div>
                    <div className="amount">{getExchangePrice(goodsData?.start_price)}</div>
                  </div>
                </div>
              }
              <div className="bid-amount" style={{ width: goodsData?.events?.show_price ? '50%' : '100%' }}>
                <div className="icon">
                  <i className="flaticon-money" />
                </div>
                <div className="amount-content">
                  <div className="current">{`${formatMessage({
                    id: 'project.goods.myPrice',
                    defaultMessage: '我的出价',
                  })}(${goodsData?.currency || getExchangeLabel()})`}</div>
                  <div className="amount">{goodsData?.my_bid?.bid || '-'}</div>
                </div>
              </div>
            </div>
            <div className="bid-count-area">
              <span className="item">
                <p style={{ marginBottom: 5 }}>{`${formatMessage({
                  id: 'project.goods.startTime',
                  defaultMessage: '开始时间',
                })} : `}</p>
                <p style={{ color: 'black' }}>{getZoneTime(goodsData?.events?.start_time)}</p>
              </span>
              <span className="item">
                <p style={{ marginBottom: 5 }}>{`${formatMessage({
                  id: 'project.goods.endTime',
                  defaultMessage: '结束时间',
                })} : `}</p>
                <p style={{ color: 'black' }}>{getZoneTime(goodsData?.events?.end_time)}</p>
              </span>
            </div>
            <div className="text-center">
              {renderBidBtn()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 首页-关注商品
  const rennderTypeTwo = () => (
    <div className="auction-item-7 time">
      <div className="auction-inner">
        <div className="auction-thumb">
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              gotoDetail(goodsData.event_id, goodsData.id)
            }}
          >
            <GoodsImage
              src={`${(goodsData.pic_small_url && goodsData.pic_small_url.length > 0) ? goodsData.pic_small_url[0] : null}`}
            />
          </span>
          {renderStarBtn(goodsData.id, goodsData?.collected)}
        </div>
        <div className="auction-content">
          <div className="title-area">
            <h6 className="title">
              <a title={goodsData.title} onClick={() => {
                gotoDetail(goodsData.event_id, goodsData.id)
              }}>{goodsData.title}</a>
            </h6>
            <div className="item-feature">
              <p style={{ marginBottom: 0 }}><span>{goodsData?.lot_number || '-'}</span></p>
              <p style={{ marginBottom: 0 }}>{renderCategoryName()}</p>
            </div>
          </div>
          <div className="bid-area">
            <div className="bid-inner">
              {goodsData?.events?.show_price && <div className="bid-amount">
                <div className="icon">
                  <i className="flaticon-auction" />
                </div>
                <div className="amount-content">
                  <div className="current">{`${formatMessage({
                    id: 'project.goods.startPrice',
                    defaultMessage: '起拍价',
                  })}(${getExchangeLabel()})`}</div>
                  <div className="amount">{getExchangePrice(goodsData?.start_price)}</div>
                </div>
              </div>}
              <div className="bid-amount">
                <div className="icon">
                  <i className="flaticon-money" />
                </div>
                <div className="amount-content">
                  <div className="current">{`${formatMessage({
                    id: 'project.goods.myPrice',
                    defaultMessage: '我的出价',
                  })}(${goodsData?.currency || getExchangeLabel()})`}</div>
                  <div className="amount">{goodsData?.my_bid?.bid || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bid-count-area">
            <span className="item">
              <p style={{ marginBottom: 5 }}>{`${formatMessage({
                id: 'project.goods.startTime',
                defaultMessage: '开始时间',
              })} : `}</p>
              <p style={{ color: 'black' }}>{getZoneTime(goodsData?.events?.start_time)}</p>
            </span>
            <span className="item">
              <p style={{ marginBottom: 5 }}>{`${formatMessage({
                id: 'project.goods.endTime',
                defaultMessage: '结束时间',
              })} : `}</p>
              <p style={{ color: 'black' }}>{getZoneTime(goodsData?.events?.end_time)}</p>
            </span>
          </div>
        </div>
        <div className="auction-bidding"
          style={{ display: 'grid', placeItems: 'center' }}>
          <>
            <span className="bid-title">{checkNotEnd() ?
              formatMessage({
                id: 'project.goods.countDown',
                defaultMessage: '截止倒计时',
              }) : formatMessage({
                id: 'project.goods.end',
                defaultMessage: '活动已结束',
              })}</span>
            <div className="countdown">
              <div id="bid_counter3">{countDownTime}</div>
            </div>
          </>
          {renderBidBtn()}
        </div>
      </div>
    </div>
  )

  // 商品列表页-商品, 收藏,竞价历史
  const rennderTypeThree = () => {

    const getPriceWidth = () => {
      if (goodsData?.events?.show_price) {
        return '50%'
      }
      if (goodsData?.final_price) {
        return '50%'
      }
      return '100%'
    }

    return (
      <div className="auction-item-2">
        <div className="auction-thumb">
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              gotoDetail(goodsData.event_id, goodsData.id)
            }}
          >
            <GoodsImage
              src={`${(goodsData.pic_small_url && goodsData.pic_small_url.length > 0) ? goodsData.pic_small_url[0] : null}`}
            />
          </span>
          {renderStarBtn(goodsData.id, goodsData?.collected)}
        </div>
        <div className="auction-content">
          <div className="title-area">
            <div style={{ height: '70px' }}>
              <h6 className="title">
                <a title={goodsData.title} onClick={() => {
                  gotoDetail(goodsData.event_id, goodsData.id)
                }}>{goodsData.title}</a>
              </h6>
            </div>
            <div className="item-feature">
              <p style={{ marginBottom: 0 }}><span>{goodsData?.lot_number || '-'}</span></p>
              <p style={{ paddingBottom: 10 }}>{renderCategoryName()}</p>
            </div>
          </div>
          <div className="bid-area">
            {goodsData?.events?.show_price &&
              <div className="bid-amount" style={{ width: '50%', borderRight: '1px solid #bfbee8' }}>
                <div className="icon">
                  <i className="flaticon-auction" />
                </div>
                <div className="amount-content">
                  <div className="current">{`${formatMessage({
                    id: 'project.goods.startPrice',
                    defaultMessage: '起拍价',
                  })}(${getExchangeLabel()})`}</div>
                  <div className="amount">{getExchangePrice(goodsData?.start_price)}</div>
                </div>
              </div>}
            <div className="bid-amount" style={{ width: getPriceWidth() }}>
              <div className="icon">
                <i className="flaticon-money" />
              </div>
              <div className="amount-content">
                <div className="current">{`${formatMessage({
                  id: 'project.goods.myPrice',
                  defaultMessage: '我的出价',
                })}(${goodsData?.currency || getExchangeLabel()})`}</div>
                <div className="amount">{goodsData?.my_bid?.bid || '-'}</div>
              </div>
            </div>
            {goodsData?.final_price &&
              <div className="bid-amount"
                style={{
                  width: goodsData?.events?.show_price ? '100%' : '50%',
                  borderLeft: goodsData?.events?.show_price ? '' : '1px solid #bfbee8'
                }}>
                <div className="icon">
                  <i className="flaticon-money" />
                </div>
                <div className="amount-content">
                  <div className="current">{`${formatMessage({
                    id: 'project.goods.finalPrice',
                    defaultMessage: '最终拍卖价',
                  })}(JPY)`}</div>
                  <div className="amount">{goodsData?.final_price}</div>
                </div>
              </div>}
          </div>
          <div className="bid-count-area" style={{ marginTop: '10px' }} >
            <div className="item" style={{ marginBottom: 5 }}>
              <p>
                <span style={{ color: '#43b055' }}>{`${formatMessage({
                  id: 'project.goods.startTime',
                  defaultMessage: '开始时间',
                })} : `}</span> {getZoneTime(goodsData?.events?.start_time)}
              </p>
            </div>
            <div className="item">
              <p>
                <span style={{ color: '#43b055' }}>{`${formatMessage({
                  id: 'project.goods.endTime',
                  defaultMessage: '结束时间',
                })} : `}</span> {getZoneTime(goodsData?.events?.end_time)}
              </p>
            </div>
          </div>
          <div className="countdown-area" />
          <div className="text-center">
            {renderBidBtn()}
          </div>
        </div>
      </div>
    )
  }

  // 首页-热门商品
  const rennderTypeFour = () => {
    return (
      <div className="col-sm-10 col-md-6 col-lg-4">
        <div className="auction-item-3" style={{ borderRadius: '10px', boxShadow: '0.487px 3.97px 10px 0px rgba(40, 58, 140, 0.3)' }}>
          <div className="auction-thumb">
            <a onClick={() => {
              gotoDetail(goodsData.event_id, goodsData.id)
            }}>
              <GoodsImage
                src={`${(goodsData.pic_small_url && goodsData.pic_small_url.length > 0) ? goodsData.pic_small_url[0] : null}`}
              />
            </a>
            {checkNotEnd() && <a
              className="bid"
              onClick={() => {
                setBidData(true, goodsData)
              }}><i className="flaticon-auction" />
            </a>}
          </div>
          <div className="auction-content">
            <h6 className="title">
              <a title={goodsData.title} onClick={() => {
                gotoDetail(goodsData.event_id, goodsData.id)
              }}>{goodsData.title}</a>
            </h6>
            <div className="bid-amount">
              <div className="icon">
                <i className="flaticon-auction" />
              </div>
              <div className="amount-content">
                <div className="current">
                  {formatMessage({
                    id: 'project.goods.myPrice',
                    defaultMessage: '我的出价',
                  })}
                  ({goodsData?.currency || getExchangeLabel()})
                </div>
                <div className="amount">{goodsData?.my_bid?.bid || '-'}</div>
              </div>
            </div>
            <div className="bids-area">
              {/* 访问次数 : <span className="total-bids">{('assess_num' in goodsData && goodsData.assess_num) ? goodsData.assess_num : 0}</span> */}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const chooseGoodsItem = () => {
    const lstType = [rennderTypeOne(), rennderTypeTwo(), rennderTypeThree(), rennderTypeFour()]
    return lstType[type - 1]
  }

  return (
    <>
      {chooseGoodsItem()}
      <BidModal
        visible={bidModalData.visible}
        bidData={bidModalData.bidData}
        bidModalCancel={() => setBidData(false, null)}
        bidModalSuccess={() => {
          setBidData(false, null)
          props.bidSuccess(type, goodsData.id)
        }}
      />
    </>
  )
}

export default goodsItem
