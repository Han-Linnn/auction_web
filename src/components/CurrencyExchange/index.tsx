import React from 'react';
import {  useIntl,  useModel } from 'umi'
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const CurrencyExchange: React.FC<{ props: any }> = (props) => {
  const { price } = props
  const { formatMessage } = useIntl();
  const { exchangeData } = useModel('dataModel');

  const exchangePrice = (type: string) => {
    let tempPrice = price
    if (exchangeData && exchangeData.length > 0) {
      exchangeData.forEach((item: any) => {
        if (item.ending_currency_code === type) {
          tempPrice = (price * item.exchange_rate).toFixed(2)
        }
      })
    }
    return tempPrice
  }

  const renderContent = () => {
    return (
      <>
        <p style={{ marginBottom: 0 }}>{formatMessage({ id: 'project.goods.japan', defaultMessage: '日  元(JPY) : ' })}￥{price}</p>
        <p style={{ marginBottom: 0 }}>{formatMessage({ id: 'project.goods.china', defaultMessage: '人民币(CNY) : ' })}￥{exchangePrice('CNY')}</p>
        <p style={{ marginBottom: 0 }}>{formatMessage({ id: 'project.goods.usa', defaultMessage: '美  元(USD) : ' })}${exchangePrice('USD')}</p>
      </>
    )
  }

  return (
    <>
      {price && <Popover content={renderContent()} title={formatMessage({ id: 'project.goods.rateRef', defaultMessage: '汇率参考' })} trigger="click">
        <InfoCircleOutlined />
      </Popover>}
    </>
  )
}

export default CurrencyExchange
