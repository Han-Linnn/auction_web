import React, { useEffect, useState } from 'react';
import { history, useIntl } from 'umi';
import GoodsItem from '@/components/GoodsItem';
import { getRecommend, getMyBid } from '@/services/api';

const PopularSection: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [recommendData, setRecommendData] = useState<any>(null)

  // const getAllMyBids = async (listData: any) => {
  //   const ids = []
  //   const temp = [...listData]
  //   temp.forEach((item: any) => {
  //     ids.push(item.id)
  //   })
  //   const response = await getMyBid({ goods_list: ids.join(',') });
  //   if (response.code === 200) {
  //     const { data } = response
  //     data.forEach((priceItem: any) => {
  //       temp.forEach((goodsItem: any) => {
  //         if (goodsItem.id === priceItem.id) {
  //           goodsItem.my_bid.bid = priceItem.my_bid
  //         }
  //       })
  //     })
  //     setRecommendData(temp)
  //   }
  // }

  const getRecommendData = async () => {
    const response = await getRecommend({ page: 1, size: 9 });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response;
        if ('items' in data) {
          setRecommendData(data.items)
          // if (data.items && data.items.length > 0) {
          //   getAllMyBids(data.items)
          // }
        }
      }
    }
  }

  useEffect(() => {
    getRecommendData()
  }, []);

  const renderGoods = () => {
    if (recommendData && recommendData.length > 0) {
      const tempGoodsList = {}
      const gotoDetail = (id: number) => {
        let index = -1
        Object.keys(tempGoodsList).forEach((key: any, i: number) => {
          if (id === Number(tempGoodsList[key].id)) {
            index = i
          }
        })
        // history.push({
        //   pathname: '/detail',
        //   query: {
        //     index,
        //     listData: JSON.stringify(tempGoodsList)
        //   },
        // });
        const params = "index=" + index + "&listData=" + encodeURIComponent(JSON.stringify(tempGoodsList));
        const url = '/detail?' + params;
        window.open(url);
      }

      return recommendData.map((item: any, index: number) => {
        const { goods } = item
        tempGoodsList[index] = { id: goods.id, eventId: goods.event_id }
        return (
          <GoodsItem
            key={goods.id}
            type={4}
            goodsData={goods}
            collectionChange={() => { }}
            bidSuccess={(type: number, goodsId: number) => {
              // if (type === 4 && goodsId === goods.id) {
              //   getAllMyBids(recommendData)
              // }
            }}
            onClickDetail={(id: number) => {
              gotoDetail(id)
            }}
          />
        )
      })
    }
    return (
      <h5 className="title mb-3" style={{ textAlign: 'center', color: 'black' }}>
        {formatMessage({ id: 'project.public.null', defaultMessage: '暂无商品' })}
      </h5>
    );
  }

  return (
    <>
      {
        recommendData && recommendData.length > 0 && <section className="popular-auction padding-top padding-bottom pos-rel">
          <div className="popular-bg bg_img"
            style={{ backgroundImage: `url(${require('../../../../public/images/auction/popular/popular-bg.png')})` }}
          />
          <div className="container2">
            <div className="section-header cl-white">
              <span className="cate">{formatMessage({ id: 'project.hotLot.title', defaultMessage: '热门拍卖品推荐' })}</span>
            </div>
            <div className="popular-auction-wrapper">
              <div className="row justify-content-center mb-30-none">
                {renderGoods()}
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default PopularSection
