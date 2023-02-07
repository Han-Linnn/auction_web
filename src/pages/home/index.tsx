import React, { useEffect, useState } from 'react';
import { getEventList, getGoodsData, getMyBid } from '@/services/api';
import ScrollToTopSection from '@/components/ScrollToTopSection'
import PageHeader from '@/components/PageHeader';
import BannerSection from './components/BannerSection'
import EventSection from './components/EventSection'
import CategorySection from './components/CategorySection'
import GoodsSection from './components/GoodsSection'
import CollectionSection from './components/CollectionSection'
import PopularSection from './components/PopularSection'

const Home: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false)
  const [eventListData, setEventListData] = useState<any>(null)
  const [eventId, setEventId] = useState<number>(-1)
  const [eventTitle, setEventTitle] = useState<string>('')
  const [goodsListData, setGoodsListData] = useState<any>(null)
  const [spinning, setSpinning] = useState(false)

  const getEventTitle = (eventid: number) => {
    if (eventListData && eventListData.length > 0) {
      eventListData.forEach((item: any) => {
        if (item.id === eventid) {
          setEventTitle(item.name)
        }
      })
    }
  }

  const getAllMyBids = async (listData: any) => {
    const ids = []
    const temp = [...listData]
    temp.forEach((item: any) => {
      ids.push(item.id)
    })
    const response = await getMyBid({ goods_list: ids.join(',') });
    if (response.code === 200) {
      const { data } = response
      data.forEach((priceItem: any) => {
        temp.forEach((goodsItem: any) => {
          if (goodsItem.id === priceItem.id) {
            goodsItem.my_bid.bid = priceItem.my_bid
            goodsItem.collected = priceItem.collected
            goodsItem.currency = priceItem.currency
          }
        })
      })
      setGoodsListData(temp)
    }
  }

  const getEventGoods = async (params: any, page = 1, size = 15) => {
    setSpinning(true)
    setEventId(params.event_id)
    const response = await getGoodsData({ ...params, page, size });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response
        getEventTitle(params.event_id)
        if ('items' in data) {
          setGoodsListData(data.items)
          if (data.items && data.items.length > 0) {
            getAllMyBids(data.items)
          }
        }
        setSpinning(false)
      }
    }
  }

  const getEventListData = async () => {
    const response = await getEventList({ page: 1, size: 24, is_hot: true });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response;
        if ('items' in data) {
          const { items } = data
          setLoading(true)
          setEventListData(items)

          if (items && items.length > 0) {
            setEventTitle(items[0].name)
            getEventGoods({ event_id: items[0].id })
          }
        }
      }
    }
  }

  useEffect(() => {
    getEventListData()
  }, []);

  const gotoContainer = (anchorName: string) => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  return (
    <>
      <ScrollToTopSection loading={loading} />
      <PageHeader />
      <BannerSection
        gotoContainer={(anchorName) => gotoContainer(anchorName)}
      />
      <EventSection
        eventListData={eventListData}
        eventChange={(event_id: any) => getEventGoods({ event_id })}
      />
      <CategorySection />
      <GoodsSection
        spinning={spinning}
        eventId={eventId}
        eventTitle={eventTitle}
        goodsListData={goodsListData}
        reLoadGoodslist={() => getAllMyBids(goodsListData)}
      />
      <CollectionSection />
      <PopularSection />
    </>
  )
}

export default Home
