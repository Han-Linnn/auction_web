import React, { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import { getGoodsData, getBrand, getMyBid } from '@/services/api';
import { Button, Slider, Select, Checkbox, Row, Col, Pagination, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ScrollToTopSection from '@/components/ScrollToTopSection';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import GoodsItem from '@/components/GoodsItem';
import { defaultPriceRange } from '@/utils/constants';

const GoodsList: React.FC<{ props: any }> = (props) => {
  const {
    location: {
      query,
    }
  } = props;
  const { formatMessage } = useIntl();
  const { getCategoryName, collectionCateData, getExchangeLabel } = useModel('dataModel');
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [goodsListData, setGoodsListData] = useState<any>(null)
  const [brandData, setBrandData] = useState<any>([])

  const [searchTitle, setSearchTitle] = useState('') // 商品名
  const [orderBy, setOrderBy] = useState('') // 排序方法
  const [eventStatus, setEventStatus] = useState('') // 竞拍状态
  const [priceRange, setPriceRange] = useState(defaultPriceRange) // 价格区间
  const [searchByPrice, setSearchByPrice] = useState(false) // 确认价格区间
  const [category, setCategory] = useState('') // 拍卖品类型
  const [brandId, setBrandId] = useState('') // 拍卖品品牌
  const [caseState, setCaseState] = useState('') // 拍卖品等级
  const caseStateData = ['N', 'S', 'SA', 'A', 'AB', 'B', 'BC', 'C']
  const [orderType, setOrderType] = useState('asc') // asc: 升序, desc:降序
  // const [pageNo, setPageNo] = useState(1) // 当前页数

  // const [brandSearchName, setBrandSearchName] = useState('') // 品牌名字搜索

  const [moreSearch, setMoreSearch] = useState(false) // 更多搜索

  const gotoContainer = (anchorName: string) => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  const getAllMyBids = async (listData: any) => {
    const ids = []
    const temp = { ...listData }
    temp.items.forEach((item: any) => {
      ids.push(item.id)
    })
    const response = await getMyBid({ goods_list: ids.join(',') });
    if (response.code === 200) {
      const { data } = response
      data.forEach((priceItem: any) => {
        temp.items.forEach((goodsItem: any) => {
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

  const getGoodsList = async (params: any, page = 1, size = 24) => {
    setSpinning(true)
    const response = await getGoodsData({ ...params, page, size });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response
        setLoading(true)
        setGoodsListData(data)
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
    if (orderBy) {
      params.order_by = orderBy
    }
    if (eventStatus) {
      params.event_status = eventStatus
    }
    if (searchByPrice) {
      params.price_low = priceRange[0]
      params.price_high = priceRange[1]
    }
    if (category) {
      params.category_id = category
    }
    if (brandId) {
      params.brand_id = brandId
    }
    if (caseState) {
      params.case_state = caseState
    }
    if (orderType) {
      params.order_type = orderType
    }
    if (key) {
      if (key === 'priceRange') {
        if (value) {
          params.price_low = value[0]
          params.price_high = value[1]
        }
      } else if (value) {
        params[key] = value
      } else if (key in params) {
        delete params[key]
      }
    }
    // console.log('-setParams-', params)
    return params
  }

  const arrangeBrandId = (listData: any) => {
    if (listData && listData.length > 0) {
      if (brandId) {
        const selectedBrandId = brandId.split(',')
        const newSelected = []
        listData.forEach((item: any) => {
          if (selectedBrandId.includes(`${item.id}`)) {
            newSelected.push(item.id)
          }
        })
        if (brandId !== newSelected.join('')) {
          setBrandId(newSelected.join(''))
          getGoodsList(setParams('brand_id', newSelected.join('')))
        }
      }
    } else if (brandId) {
      setBrandId('')
      getGoodsList(setParams('brand_id', null))
    }
  }

  const getBrandList = async (params: any) => {
    const response = await getBrand(params);
    if (response.code === 200) {
      if ('data' in response) {
        setBrandData(response.data)
        arrangeBrandId(response.data)
      }
    }
  }

  const checkQueryType = () => {
    if ('categoryId' in query) {
      // 关注分类进来
      const { categoryId } = query
      setCategory([`${categoryId}`].join(','))
      getBrandList({ ids: categoryId })
      getGoodsList({ category_id: categoryId })
    }
    if ('title' in query) {
      // 菜单搜索进来
      const { title } = query
      setCategory('')
      setSearchTitle(title)
      document.getElementById("searchTtile").value = title
      getGoodsList({ title })
    }
  }

  useEffect(() => {
    checkQueryType()
  }, [query]);

  const clickSearch = () => {
    const { value } = document.getElementById("searchTtile")
    if (value) {
      setSearchTitle(value)
      getGoodsList(setParams('title', value))
    }
  }

  const searchBrandByCate = (listData: any) => {
    if (listData && listData.length > 0) {
      const params = {
        ids: listData.join(',')
      }
      // if (brandSearchName) {
      //   params.name = brandSearchName
      // }
      getBrandList(params)
    } else {
      setBrandData([])
      if (brandId) {
        setBrandId('')
        getGoodsList(setParams('brand_id', null))
      }
    }
  }


  const renderLeftSearchOption = () => {
    return (
      <div className="col-lg-4 mb-50">
        <div className="widget">
          <h5 className="title">{formatMessage({
            id: 'project.goods.priceRange',
            defaultMessage: '价格区间',
          })}</h5>
          <div className="widget-body">
            <div id="slider-range">
              <Slider
                range
                min={defaultPriceRange[0]}
                max={defaultPriceRange[1]}
                value={priceRange}
                tipFormatter={(value) => (`￥${value}`)}
                onChange={(value) => {
                  setPriceRange(value)
                }}
              />
            </div>
            <div className="price-range">
              <label htmlFor="amount">{`${formatMessage({
                id: 'project.goods.price',
                defaultMessage: '价格',
              })}(${getExchangeLabel()}) :`}</label>
              <span id="amount">{`￥${priceRange[0]} ~ ￥${priceRange[1]}`}</span>
            </div>
          </div>
          <div className="text-center mt-20">
            <a
              className="custom-button"
              style={{ color: 'white' }}
              onClick={() => {
                setSearchByPrice(true)
                setParams('priceRange', priceRange)
                getGoodsList(setParams('priceRange', priceRange))
              }}>{formatMessage({
                id: 'project.goods.filter',
                defaultMessage: '确认',
              })}</a>
          </div>
        </div>
        {collectionCateData && <div className="widget">
          <h5 className="title">{formatMessage({ id: 'project.goods.interest', defaultMessage: '关注的分类' })}</h5>
          <Checkbox.Group
            style={{ width: '100%', maxHeight: '180px', overflowY: 'auto' }}
            value={category ? category.split(',') : []}
            onChange={(value) => {
              searchBrandByCate(value)
              setCategory(value.join(','))
              getGoodsList(setParams('category_id', value.join(',')))
            }}
          >
            <Row>
              {collectionCateData.map((item: any) => (
                <Col span={24} key={item.id}>
                  <Checkbox value={`${item.category_id}`}>{getCategoryName(item.category_id)}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>}
        {brandData && brandData.length > 0 && <div className="widget">
          <h5 className="title">{formatMessage({ id: 'project.goods.brand', defaultMessage: '拍卖品品牌' })}</h5>
          <Checkbox.Group
            style={{ width: '100%', maxHeight: '320px', overflowY: 'auto' }}
            value={brandId.split(',')}
            onChange={(value) => {
              setBrandId(value.join(','))
              getGoodsList(setParams('brand_id', value.join(',')))
            }}
          >
            <Row>
              {brandData.map((item: any) => (
                <Col span={24} key={item.id}>
                  <Checkbox value={`${item.id}`}>{item.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>}
        <div className="widget">
          <h5 className="title">{formatMessage({ id: 'project.goods.level', defaultMessage: '拍卖品等级' })}</h5>
          <Checkbox.Group
            style={{ width: '100%', maxHeight: '180px', overflowY: 'auto' }}
            value={caseState ? caseState.split(',') : []}
            onChange={(value) => {
              setCaseState(value.join(','))
              getGoodsList(setParams('case_state', value.join(',')))
            }}
          >
            <Row>
              {caseStateData.map((item: string) => (
                <Col span={24} key={item}>
                  <Checkbox value={item}>{item}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </div>
    )
  }

  const renderTopSearch = () => {
    return (
      <div id='pageTop' className="product-header mb-40" style={{ backgroundColor: 'white' }}>
        <div className="product-header-item">
          <div className="item">{formatMessage({ id: 'project.goods.searchOrder', defaultMessage: '排序方法 : ' })}</div>
          <Select
            style={{ width: '100px' }}
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value)
              getGoodsList(setParams('order_by', value))
            }}>
            <Select.Option value="">{formatMessage({ id: 'project.goods.all', defaultMessage: '全部' })}</Select.Option>
            <Select.Option value="title">{formatMessage({ id: 'project.goods.name1', defaultMessage: '名称' })}</Select.Option>
            <Select.Option value="start_time">{formatMessage({ id: 'project.goods.date', defaultMessage: '日期' })}</Select.Option>
            <Select.Option value="start_price">{formatMessage({ id: 'project.goods.startPrice', defaultMessage: '起拍价' })}</Select.Option>
          </Select>
        </div>
        <div className="product-header-item">
          <div className="item">{formatMessage({ id: 'project.goods.searchStatus', defaultMessage: '竞拍状况 : ' })}</div>
          <Select
            style={{ width: '100px' }}
            value={eventStatus}
            onChange={(value) => {
              setEventStatus(value)
              getGoodsList(setParams('event_status', value))
            }}>
            <Select.Option value=''>{formatMessage({ id: 'project.goods.all', defaultMessage: '全部' })}</Select.Option>
            <Select.Option value='1'>{formatMessage({ id: 'project.goods.before', defaultMessage: '未开始' })}</Select.Option>
            <Select.Option value='2'>{formatMessage({ id: 'project.goods.going', defaultMessage: '进行中' })}</Select.Option>
            <Select.Option value='3'>{formatMessage({ id: 'project.goods.after', defaultMessage: '已完成' })}</Select.Option>
          </Select>
        </div>
        {orderType === 'asc' ?
          <ArrowUpOutlined title='升序' onClick={() => {
            setOrderType('desc')
            getGoodsList(setParams('order_type', 'desc'))
          }} /> :
          <ArrowDownOutlined title='降序' onClick={() => {
            setOrderType('asc')
            getGoodsList(setParams('order_type', 'asc'))
          }} />
        }

        <div className="product-search ml-auto">
          <input
            id='searchTtile'
            type="text"
            placeholder={formatMessage({
              id: 'project.goods.name',
              defaultMessage: '商品名',
            })}
            // value={searchTitle}
            style={{ width: '100%' }}
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
        <Button shape="round" onClick={() => {
          document.getElementById("searchTtile").value = ''
          setSearchTitle('')
          setOrderBy('')
          setEventStatus('')
          setSearchByPrice(false)
          setPriceRange(defaultPriceRange)
          setCaseState('')
          setBrandId('')
          setOrderType('asc')
          // setPageNo(1)
          checkQueryType()
          // setCategory([`${categoryId}`].join(','))
          // getGoodsList({ category_id: categoryId })
        }}>{formatMessage({
          id: 'project.public.reset',
          defaultMessage: '重置',
        })}</Button>
        <Button style={{ marginLeft: '10px' }} shape="round" onClick={() => {
          setMoreSearch(!moreSearch)
        }}>{moreSearch ? formatMessage({ id: 'project.public.hide', defaultMessage: '收起' }) : formatMessage({ id: 'project.public.more1', defaultMessage: '高级搜索' })}</Button>
      </div >
    )
  }

  const renderGoods = () => {
    if (goodsListData && 'items' in goodsListData && goodsListData.items) {
      const { items } = goodsListData

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
        const params = `index=${  index  }&listData=${  encodeURIComponent(JSON.stringify(tempGoodsList))}`;
        const url = `/detail?${  params}`;
        window.open(url);
      }

      return items.map((item: any, index: number) => {
        tempGoodsList[index] = { id: item.id, eventId: item.event_id }
        return (
          <div
            key={item.id}
            className={`col-sm-10 col-md-6 ${moreSearch ? '' : 'col-xl-3 col-xxl-2'}`}
          >
            <GoodsItem
              type={3}
              goodsData={item}
              collectionChange={() => { getAllMyBids(goodsListData) }}
              bidSuccess={(type: number, goodsId: number) => {
                if (type === 3 && goodsId === item.id) {
                  getAllMyBids(goodsListData)
                }
              }}
              onClickDetail={(id: number) => {
                gotoDetail(id)
              }}
            />
          </div>

        )
      })
    }
    return null
  }

  return (
    <>
      <ScrollToTopSection loading={loading} />
      <div className="featured-auction-section padding-bottom mt--240 mt-lg--440 pos-rel">
        <div className="container2" style={{ marginTop: '120px' }}>
          <PageBreadcrumb routes={[{ name: formatMessage({ id: 'project.interestedGoods.title', defaultMessage: '关注分类商品列表' }), path: null }]} />
          {moreSearch ? <div className="row mb--50">
            {renderLeftSearchOption()}
            <div className="col-lg-8 mb-50">
              {renderTopSearch()}
              <Spin spinning={spinning}>
                <div className="row mb-30-none justify-content-center" >
                  {renderGoods()}
                </div>
              </Spin>
            </div>
          </div> : <>
              {renderTopSearch()}
              <Spin spinning={spinning}>
                <div className="row mb-30-none justify-content-center" >
                  {renderGoods()}
                </div>
              </Spin>
            </>
          }

          {goodsListData &&
            <div style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
              <Pagination
                className="goodsPag"
                current={goodsListData.page}
                pageSize={goodsListData.per_page}
                // showSizeChanger={false}
                defaultPageSize={24}
                pageSizeOptions={['24', '50', '100']}
                total={goodsListData.total}
                showQuickJumper
                onChange={(page, size) => {
                  // setPageNo(page)setPageNo
                  getGoodsList(setParams('', null), page, size)
                  gotoContainer('pageTop')
                }}
              />
            </div>
          }

        </div>
      </div>
    </>
  )
}

export default GoodsList
