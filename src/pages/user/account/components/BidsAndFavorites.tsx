import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi'
import { Button, Select, Pagination, Spin } from 'antd';
import { getCollectionList, getUserBidList, getMyBid } from '@/services/api';
import ScrollToTopSection from '@/components/ScrollToTopSection'
import GoodsItem from '@/components/GoodsItem';
import AutoCompleteInput from '@/components/AutoCompleteInput'

const BidsAndFavorites: React.FC<{ props: any }> = (props) => {
  const { type } = props
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false)
  const [searchTitle, setSearchTitle] = useState('')
  const [searchCate, setSearchCate] = useState(0)
  const [searchState, setSearchState] = useState(0)
  const [listData, setListData] = useState<any>(null)
  const [spinning, setSpinning] = useState(false)
  const { cateData } = useModel('dataModel');
  // const [pageNo, setPageNo] = useState(1)
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;

  const gotoContainer = (anchorName: string) => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  const getAllMyBids = async (goodLlistData: any) => {
    const ids = []
    const temp = { ...goodLlistData }
    temp.items.forEach((item: any) => {
      ids.push(item.goods.id)
    })
    const response = await getMyBid({ goods_list: ids.join(',') });
    if (response.code === 200) {
      const { data } = response
      data.forEach((priceItem: any) => {
        temp.items.forEach((goodsItem: any) => {
          if (goodsItem.goods.id === priceItem.id) {
            goodsItem.goods.my_bid.bid = priceItem.my_bid
            goodsItem.goods.collected = priceItem.collected
            goodsItem.currency = priceItem.currency
          }
        })
      })
      setListData(temp)
    }
  }

  const getCollectionSectionData = async (parmes: any, page = 1, size = 12) => {
    setSpinning(true)
    const tempFun = type === 'collection' ? getCollectionList : getUserBidList
    const tempParmes = { ...parmes, page, size }
    if (type === 'bid') {
      tempParmes.user_id = currentUser?.id
    }
    const response = await tempFun(tempParmes);
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response
        setLoading(true)
        setListData(data)
        if ('items' in data && data.items && data.items.length > 0) {
          getAllMyBids(data)
        }
        setSpinning(false)
      }
    }
  }

  const setParams = (key: string, value: any) => {
    const params = {}
    if (searchTitle) {
      params.title = searchTitle
    }
    if (searchCate) { // category_id
      params.category_id = searchCate
    }
    if (searchState) { // event_on_line
      params.event_on_line = searchState
    }
    if (key) {
      if (value) {
        params[key] = value
      } else if (key in params) {
        delete params[key]
      }
    }
    // console.log('-setParams-', params)
    return params
  }

  const resetData = () => {
    document.getElementById("searchTitle").value = ''
    setSearchTitle('')
    setSearchCate(0)
    setSearchState(0)
    // setPageNo(1)
  }

  useEffect(() => {
    resetData()
    getCollectionSectionData({})
  }, [type]);

  const clickSearch = () => {
    const { value } = document.getElementById("searchTitle")
    if (value) {
      setSearchTitle(value)
      getCollectionSectionData(setParams('title', value))
    }
  }

  const renderSearch = () => {
    return (
      <div id='pageTop' className="dash-bid-item dashboard-widget mb-40-60">
        <div className="header">
          <h4 className="title">{type === 'collection' ?
            formatMessage({
              id: 'project.user.collection',
              defaultMessage: '我的收藏',
            })
            :
            formatMessage({
              id: 'project.user.bids',
              defaultMessage: '竞价历史',
            })
          }</h4>
        </div>

        <div className="button-area align-items-center">
          <div className="sort-winning-bid">
            <div className="item">{formatMessage({ id: 'project.user.cate', defaultMessage: '分类: ' })}</div>
            <Select
              style={{ width: '100px' }}
              value={searchCate}
              onChange={(value) => {
                setSearchCate(value)
                getCollectionSectionData(setParams('category_id', value))
              }}>
              <Select.Option value={0}>{formatMessage({ id: 'project.user.all', defaultMessage: '全部' })}</Select.Option>
              {cateData.map((item: any) => (
                <Select.Option
                  key={item.key}
                  value={item.id}
                >
                  {item.category_name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="sort-winning-bid">
            <div className="item">{formatMessage({ id: 'project.user.status', defaultMessage: '状态: ' })}</div>
            <Select
              style={{ width: '135px' }}
              value={searchState}
              onChange={(value) => {
                setSearchState(value)
                getCollectionSectionData(setParams('event_on_line', value))
              }}>
              <Select.Option value={0}>{formatMessage({ id: 'project.user.all', defaultMessage: '全部' })}</Select.Option>
              <Select.Option value={2}>{formatMessage({ id: 'project.user.ing', defaultMessage: '正在拍卖' })}</Select.Option>
              <Select.Option value={3}>{formatMessage({ id: 'project.user.history', defaultMessage: '历史拍卖' })}</Select.Option>
            </Select>
          </div>
          <div className="product-search ml-auto">
            <AutoCompleteInput
              search={() => clickSearch()}
              select={(value: any) => {
                setSearchTitle(value)
                getCollectionSectionData(setParams('title', value))
              }}
            />
            <button type="button" style={{ height: '30px' }} onClick={() => {
              clickSearch()
            }}><i className="fas fa-search" /> </button>
          </div>
          <Button shape="round" style={{ marginLeft: '10px' }} onClick={() => {
            resetData()
            getCollectionSectionData({})
          }}>{formatMessage({
            id: 'project.public.reset',
            defaultMessage: '重置',
          })}</Button>
        </div>
      </div >
    )
  }

  const renderListItem = () => {
    if (listData && 'items' in listData && listData.items.length > 0) {
      const { items } = listData

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
        const params = `index=${index}&listData=${encodeURIComponent(JSON.stringify(tempGoodsList))}`;
        const url = `/detail?${params}`;
        window.open(url);
      }

      return items.map((item: any, index: number) => {
        const { goods } = item
        tempGoodsList[index] = { id: goods.id, eventId: goods.event_id }
        return (
          <div
            key={`key-${index}`}
            className='col-sm-10 col-md-6 col-xl-4'
          >
            <GoodsItem
              type={3}
              goodsData={item?.goods}
              collectionChange={() => {
                if (type === 'collection') {
                  getCollectionSectionData(setParams('', null))
                } else {
                  getAllMyBids(listData)
                }
              }}
              bidSuccess={(type: number, goodsId: number) => {
                if (type === 3 && goodsId === goods.id) {
                  getAllMyBids(listData)
                  // getCollectionSectionData(setParams('', null), pageNo)
                }
              }}
              onClickDetail={(id: number) => {
                gotoDetail(id)
              }}
            /></div>
        )
      })
    }
    return null
  }

  return (
    <>
      <ScrollToTopSection loading={loading} />

      <div className="col-lg-9">
        {renderSearch()}
        <Spin spinning={spinning}>
          <div className="row mb-30-none justify-content-center">
            {listData &&
              <>
                {renderListItem()}
                <div style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                  <Pagination
                    className="goodsPag"
                    current={listData.page}
                    pageSize={listData.per_page}
                    // showSizeChanger={false}
                    total={listData.total}
                    showQuickJumper
                    onChange={(page, size) => {
                      // setPageNo(page)
                      getCollectionSectionData(setParams('', null), page, size)
                      gotoContainer('pageTop')
                    }}
                  />
                </div>
              </>
            }
          </div>
        </Spin>
      </div>
    </>
  )
}

export default BidsAndFavorites
