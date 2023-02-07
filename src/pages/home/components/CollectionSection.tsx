import React, { useEffect, useState } from 'react'
import { history, useIntl, useModel } from 'umi'
import { Spin } from 'antd';
import GoodsItem from '@/components/GoodsItem';
import { getGoodsData, getMyBid } from '@/services/api';

const CollectionSection: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [tab, setTab] = useState(0)
  const [goodsListData, setGoodsListData] = useState<any>(null)
  const [spinning, setSpinning] = useState(false)
  const { getCategoryName, collectionCateData } = useModel('dataModel');

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

  const getGoodsListData = async (category_id: number) => {
    setSpinning(true)
    const response = await getGoodsData({ category_id: `${category_id}`, page: 1, size: 6 });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response
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

  useEffect(() => {
    if (collectionCateData && collectionCateData.length > 0) {
      setTab(0)
      getGoodsListData(collectionCateData[0].category_id)
    }
  }, [collectionCateData]);

  const changeTab = (index: number) => {
    setTab(index)
    getGoodsListData(collectionCateData[index].category_id)
  }

  const renderListItem = () => {
    if (goodsListData && goodsListData.length > 0) {
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

      return goodsListData.map((item: any, index: number) => {
        tempGoodsList[index] = { id: item.id, eventId: item.event_id }
        return (
          <GoodsItem
            key={`goods-${index}`}
            type={2}
            goodsData={item}
            collectionChange={() => { getAllMyBids(goodsListData) }}
            bidSuccess={(type: number, goodsId: number) => {
              if (type === 2 && goodsId === item.id) {
                getAllMyBids(goodsListData)
              }
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
    )
  }

  const renderCategoryData = () => {
    return collectionCateData.map((item: any, index: number) => {
      if (index < 4) {
        return (
          <li
            key={`cate-${index}`}
            className={tab === index ? "active" : null}
            data-check=".time"
            onClick={() => {
              changeTab(index)
            }}>
            <span><i className="flaticon-bag" />{getCategoryName(item.category_id)}</span>
          </li>
        )
      }
    })
  }

  return (
    <>
      {collectionCateData && collectionCateData.length > 0 &&
        <section className="upcoming-auction padding-bottom " style={{ paddingTop: '40px' }}>
          <div className="filter-wrapper no-shadow">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h6 className="title pl-0">{formatMessage({ id: 'project.collection.title', defaultMessage: '关注的分类拍卖品' })}</h6>
              </div>
              <ul className="filter niche-border">
                {renderCategoryData()}
              </ul>
            </div>
          </div>
          <Spin spinning={spinning}>
            <div className="container">
              <div className="auction-wrapper-7 m--15">
                {renderListItem()}
              </div>
              {/* {goodsListData && 'items' in goodsListData && goodsListData.items.length > 0 && ( */}
              <a className="custom-button white"
                style={{ float: 'right', marginTop: '20px' }}
                onClick={() => {
                  history.push({
                    pathname: '/goods',
                    query: {
                      categoryId: collectionCateData[tab].category_id
                    },
                  });
                }}
              >
                {formatMessage({ id: 'project.public.more', defaultMessage: '查看全部' })}
              </a>
              {/* )} */}
            </div>
          </Spin>
        </section>}
    </>
  )
};

export default CollectionSection;
