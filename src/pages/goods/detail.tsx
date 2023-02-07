import React, { useState, useEffect } from 'react';
import { getGoodsData, getMyBid } from '@/services/api';
import ScrollToTopSection from '@/components/ScrollToTopSection'
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useIntl } from 'umi';
import ImagesSection from './components/ImagesSection'
import ContentSection from './components/ContentSection'
import InfoSection from './components/InfoSection'

const GoodsDetail: React.FC<{ props: any }> = (props) => {
  const {
    location: {
      query
    },
  } = props;
  const { index, listData } = query
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<any>(null);
  const [goodsIndex, setGoodsIndex] = useState<number>(index)
  const { formatMessage } = useIntl();

  const getAllMyBid = async (id: number, rspData: any) => {
    const response = await getMyBid({ goods_list: `${id}` });
    if (response.code === 200) {
      const { data } = response
      if (data && data.length > 0) {
        const temp = { ...rspData }
        temp.my_bid.bid = data[0].my_bid
        temp.collected = data[0].collected
        temp.currency = data[0].currency
        setDetailData(temp)
        document.getElementsByTagName('title')[0].innerText = temp?.title;
        setLoading(true)
      }
    }
  }

  const getGoodsDetailData = async (eId: number, id: number) => {
    const response = await getGoodsData({ event_id: eId, goods_id: id });
    if (response.code === 200) {
      getAllMyBid(id, response.data)
    }
  };

  const getIdAndEventID = () => {
    if (goodsIndex > -1 && listData) {
      const tempListData = JSON.parse(listData)
      Object.keys(tempListData).forEach((key: any) => {
        if (Number(key) === Number(goodsIndex)) {
          getGoodsDetailData(tempListData[key].eventId, tempListData[key].id)
        }
      })
    }
  }

  useEffect(() => {
    getIdAndEventID();
  }, [goodsIndex]);

  const gotoContainer = (anchorName: string) => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  const clickNext = (isNext: boolean) => {
    const tempListData = Object.keys(JSON.parse(listData))
    if (isNext) {
      let tempIndex = Number(goodsIndex) + 1
      if (tempIndex === tempListData.length) {
        tempIndex = 0
      }
      setGoodsIndex(tempIndex)
    } else {
      let tempIndex = Number(goodsIndex) - 1
      if (tempIndex === -1) {
        tempIndex = tempListData.length - 1
      }
      setGoodsIndex(tempIndex)
    }
    gotoContainer('pageTop')
  }

  return (
    <>
      <ScrollToTopSection loading={loading} />
      {detailData && <section className="product-details padding-bottom mt--240 mt-lg--440 pos-rel">
        <div id='pageTop' className="container" style={{ marginTop: '120px' }} >
          <PageBreadcrumb routes={[{ name: formatMessage({ id: 'project.goods.pageBreadDetail', defaultMessage: '拍卖品详情' }), path: null }]} />
          <ImagesSection detailData={detailData} />
          <ContentSection
            detailData={detailData}
            bidSuccess={() => {
              getIdAndEventID();
            }}
          />
          <InfoSection
            detailData={detailData}
            nextGoods={(isNext: boolean) => {
              if (goodsIndex > -1 && listData) {
                clickNext(isNext)
              }
            }}
          />
        </div></section>}
    </>
  )
}

export default GoodsDetail
