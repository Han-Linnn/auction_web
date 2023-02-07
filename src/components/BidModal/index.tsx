import React, { useState } from 'react';
import { useIntl, useAccess, Access, useModel } from 'umi'
import { Modal, Popconfirm, Image, Spin, InputNumber, message } from 'antd';
import { imageFallback } from '@/utils/constants';
import { postUserBid } from '@/services/api';
import NoAccess from '@/components/NoAccess'

const BidModal: React.FC<{
  props: {
    visible: boolean,
    bidData: {
      event_id: number,
      goods_id: number,
      goods_name: string,
      goods_img: string,
      start_price: number,
      last_price: number,
      minBidPrice: number,
      bidPriceUnit: number
    }
  }
}> = (props) => {
  const { visible, bidData } = props
  const { formatMessage } = useIntl();
  const { getExchangeLabel } = useModel('dataModel');
  const access = useAccess()
  const [bidPrice, setBidPrice] = useState(0)

  // const getLowestBidPrice = () => {
  //   let temp = 0
  //   const { start_price, last_price, minBidPrice } = bidData
  //   if (last_price) {
  //     temp = last_price + minBidPrice
  //   } else {
  //     temp = start_price
  //   }
  //   return temp
  // }

  const sumbitBid = async () => {
    // if (bidPrice > 0 && bidPrice >= bidData.start_price) {
    if (bidPrice > 0) {
      const response = await postUserBid({
        event_id: Number(bidData?.event_id),
        goods_id: bidData?.goods_id,
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
        props.bidModalSuccess()
      }
    } else {
      message.warning(formatMessage({
        id: 'project.message.bid.warning',
        defaultMessage: '请输入竞拍价格',
      }))
    }
  }

  return (
    <Modal
      title={formatMessage({
        id: 'project.goods.bid',
        defaultMessage: '参与竞拍',
      })}
      visible={visible}
      maskClosable={false}
      footer={null}
      onCancel={() => {
        props.bidModalCancel()
      }}
    >
      <div style={{ textAlign: 'center', display: 'block', overflow: 'hidden' }}>
        <div style={{ width: '48%', float: 'left' }}>
          <Image
            src={bidData?.goods_img}
            preview={false}
            fallback={imageFallback}
            placeholder={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Spin size="large" />
              </div>
            }
          />
        </div>
        <div style={{ width: '48%', float: 'right' }}>
          <p>{bidData?.goods_name}</p>
          <div style={{ marginTop: '40px', width: '100%' }}>
            <span style={{ float: 'left', marginTop: '5px' }}>
              {`(${getExchangeLabel()}) `}
            </span>
            <InputNumber
              style={{ width: '80%' }}
              // defaultValue={bidPrice || getLowestBidPrice()}
              // min={getLowestBidPrice()}
              // step={bidData?.bidPriceUnit}
              // min={bidData.start_price}
              min={1}
              precision={0}
              placeholder={formatMessage({ id: 'project.message.bid.warning', defaultMessage: '请输入竞拍价格' })}
              onChange={(value) => {
                setBidPrice(value)
              }}
            />
          </div>
          {/* <p style={{ fontSize: '0.8em', color: 'gray' }}>
            {`${formatMessage({
              id: 'project.goods.lowestBid',
              defaultMessage: '最低出价',
            })}(JYP): ￥${getLowestBidPrice()};
                ${formatMessage({
              id: 'project.goods.bidPrice',
              defaultMessage: '出价单位',
            })}(JYP): +￥${bidData?.bidPriceUnit}`}
          </p> */}
          <div className="text-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
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
                <a className="custom-button" style={{ color: 'white' }}>{formatMessage({
                  id: 'project.goods.bid',
                  defaultMessage: '参与竞拍',
                })}
                </a>
              </Popconfirm>
            </Access>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BidModal
