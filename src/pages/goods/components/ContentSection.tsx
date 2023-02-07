import React, { useEffect, useState } from 'react';
import { useIntl, useModel, useAccess, Access } from 'umi'
import { InputNumber, Popconfirm, message } from 'antd';
import { postUserBid } from '@/services/api';
// import CurrencyExchange from '@/components/CurrencyExchange'
import NoAccess from '@/components/NoAccess'

const ContentSection: React.FC<{
  props: {
    detailData: any
  }
}> = (props) => {
  const { detailData } = props;
  const { formatMessage } = useIntl();
  const access = useAccess()
  const { getCategoryName,/* getBidRuleByKey, */ getExchangeLabel, getExchangePrice, getZoneTime } = useModel('dataModel');
  const [countDownTime, setCountDownTime] = useState('')
  let timer: any
  const [bidPrice, setBidPrice] = useState(0)

  const countDownEndTime = (end: string) => {
    if (end) {
      const now_time = Date.parse(getZoneTime(new Date()).replace(/-/g, '/'));
      const end_time = Date.parse(getZoneTime(end).replace(/-/g, '/'))
      let remaining = end_time - now_time;
      timer = setInterval(() => {
        if (remaining > 1000) {
          remaining -= 1000;
          const day = Math.floor((remaining / 1000 / 3600) / 24);
          const hour = Math.floor((remaining / 1000 / 3600) % 24);
          const minute = Math.floor((remaining / 1000 / 60) % 60);
          const second = Math.floor(remaining / 1000 % 60);
          setCountDownTime(`${day}d : ${hour}h : ${minute}m : ${second}s`)
        } else {
          clearInterval(timer);
          setCountDownTime('')
        }
      }, 1000);
    } else {
      clearInterval(timer);
      setCountDownTime('')
    }
  }

  useEffect(() => {
    countDownEndTime(detailData?.events?.end_time)
    return () => {
      clearInterval(timer);
      setCountDownTime('')
    }
  }, [])


  // const getLowestBidPrice = () => {
  //   let temp = 0
  //   const start_price = detailData?.start_price
  //   const last_price = detailData?.last_price
  //   const minBidPrice = getBidRuleByKey(detailData.start_price, 'min_bid')
  //   if (last_price) {
  //     temp = last_price + minBidPrice
  //   } else {
  //     temp = start_price
  //   }
  //   return temp
  // }

  const sumbitBid = async () => {
    // if (bidPrice > 0 && bidPrice >= detailData?.start_price) {
    if (bidPrice > 0) {
      const response = await postUserBid({
        event_id: detailData?.event_id,
        goods_id: detailData?.id,
        // bid: bidPrice || getLowestBidPrice(),
        bid: bidPrice,
        currency: getExchangeLabel(),
      });
      if (response.code === 201) {
        message.success(formatMessage({
          id: 'project.message.bid.success',
          defaultMessage: '竞价成功',
        }));
        setBidPrice(0)
        props.bidSuccess()
      }
    } else {
      message.warning(formatMessage({
        id: 'project.message.bid.warning',
        defaultMessage: '请输入竞拍价格',
      }))
    }
  }

  const renderAttributes = (data: any) => {
    const temp = []
    data.forEach((item: any) => {
      temp.push(item.name)
    })
    return temp.join(', ')
  }

  return (
    <div className="row mt-40-60-80">
      <div className="col-lg-8">
        <div className="product-details-content">
          <div className="product-details-header">
            <h2 className="title">{detailData.title}</h2>
            <ul>
              <li>{detailData?.lot_number || '-'}</li>
            </ul>
            <ul>
              <li>{`${getCategoryName(detailData?.category_id)}
              | ${detailData?.brand || '-'}
              | ${detailData?.series || '-'}
              | ${renderAttributes(detailData.attributes)}
              `}</li>
            </ul>
          </div>
          <ul className="price-table mb-30">
            {detailData?.events?.show_price && <li className="header">
              <h5 className="current">{`${formatMessage({
                id: 'project.goods.startPrice',
                defaultMessage: '起拍价',
              })}(${getExchangeLabel()})`}: </h5>
              <h3 className="price">{getExchangePrice(detailData?.start_price)}</h3>
            </li>}
            <li className="header">
              <h5 className="current">{`${formatMessage({
                id: 'project.goods.myPrice',
                defaultMessage: '我的出价',
              })}(${detailData?.currency || getExchangeLabel()})`}: </h5>
              <h3 className="price">{detailData?.my_bid?.bid || '-'}</h3>
            </li>
          </ul>
          {countDownTime && <div className="product-bid-area">
            <div className="product-bid-form">
              <div className="search-icon">
                <img src="/images/product/search-icon.png" alt="product" />
              </div>
              {`(${getExchangeLabel()}) `}
              <InputNumber
                style={{
                  flexGrow: 1,
                  padding: '0 30px 0 0',
                  borderRadius: '10px',
                  border: '1px solid #e0e0f1',
                  background: 'transparent'
                }}
                // defaultValue={bidPrice || getLowestBidPrice()}
                // min={getLowestBidPrice()}
                // step={getBidRuleByKey(detailData.start_price, 'bid_unit')}
                // min={detailData?.start_price}
                min={1}
                precision={0}
                placeholder={formatMessage({ id: 'project.message.bid.warning', defaultMessage: '请输入竞拍价格' })}
                onChange={(value) => {
                  setBidPrice(value)
                }}
              />
              <Access
                accessible={access.canBid}
                fallback={<NoAccess />}
              >
                <Popconfirm
                  key="delete"
                  // title={`${formatMessage({ id: 'project.goods.hint', defaultMessage: '确认出价' })} ${bidPrice || getLowestBidPrice()}?`}
                  title={`${formatMessage({ id: 'project.goods.hint', defaultMessage: '确认出价' })} (${getExchangeLabel()}) ${bidPrice} ?`}
                  placement="topRight"
                  onConfirm={() => {
                    sumbitBid()
                  }}
                >
                  <button type="button" className="custom-button">{formatMessage({
                    id: 'project.goods.bid',
                    defaultMessage: '参与竞拍',
                  })}</button>
                </Popconfirm>
              </Access>
            </div>
            {/* <p style={{
              textAlign: 'center',
              fontSize: '0.8em',
              color: 'gray',
              marginTop: '5px',
              marginBottom: 0
            }}>
              {`${formatMessage({
                id: 'project.goods.lowestBid',
                defaultMessage: '最低出价',
              })}(JYP): ￥${getLowestBidPrice()};
                ${formatMessage({
                id: 'project.goods.bidPrice',
                defaultMessage: '出价单位',
              })}(JYP): +￥${getBidRuleByKey(detailData.start_price, 'bid_unit')}`}
            </p> */}
          </div>}
        </div>
      </div>
      <div className="col-lg-4">
        <div className="product-sidebar-area">
          <div className="product-single-sidebar mb-3">
            <h6 className="title">
              {(Date.parse(getZoneTime(detailData?.events?.end_time).replace(/-/g, '/')) - Date.parse(getZoneTime(new Date()).replace(/-/g, '/'))) > 1000 ?
                formatMessage({
                  id: 'project.goods.countDown',
                  defaultMessage: '截止倒计时',
                }) : formatMessage({
                  id: 'project.goods.end',
                  defaultMessage: '活动已结束',
                })}
            </h6>
            <div className="countdown">
              <div id="bid_counter1" >{countDownTime}</div>
            </div>
            <div className="side-counter-area">
              <div className="side-counter-item">
                <div className="search-icon">
                  <img src="/images/product/icon1.png" alt="product" />
                </div>
                <div className="content">
                  <h6 className="count-title"><span className="counter">{getZoneTime(detailData?.events?.start_time)}</span></h6>
                  <p style={{ color: 'gray' }}>{formatMessage({
                    id: 'project.goods.startTime',
                    defaultMessage: '开始时间',
                  })}</p>
                </div>
              </div>
              <div className="side-counter-item">
                <div className="search-icon">
                  <img src="/images/product/icon3.png" alt="product" />
                </div>
                <div className="content">
                  <h6 className="count-title"><span className="counter">{getZoneTime(detailData?.events?.end_time)}</span></h6>
                  <p style={{ color: 'gray' }}>{formatMessage({
                    id: 'project.goods.endTime',
                    defaultMessage: '结束时间',
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentSection
