import React, { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi'
import { getEventList } from '@/services/api';
import moment from 'moment';
import { Pagination, Spin, Select, Button, DatePicker } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ScrollToTopSection from '@/components/ScrollToTopSection';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import GoodsImage from '@/components/GoodsImage';

// const { RangePicker } = DatePicker;

const EventList: React.FC<{ props: any }> = (props) => {
  const {
    location: {
      query,
    }
  } = props;
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [eventListData, setEventListData] = useState<any>(null)
  const [searchDate, setSearchDate] = useState('')
  // const [searchByDate, setSearchByDate] = useState(false)
  const [searchTitle, setSearchTitle] = useState('')
  const [orderBy, setOrderBy] = useState('')
  const [pageNo, setPageNo] = useState(9)
  const [orderType, setOrderType] = useState('asc') // asc: 升序, desc:降序
  const { getZoneTime } = useModel('dataModel');

  const gotoContainer = (anchorName: string) => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  const getEventListData = async (parmes: any, page = 1) => {
    setSpinning(true)
    const response = await getEventList({ ...parmes, page });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response;
        setLoading(true)
        setEventListData(data)
        setSpinning(false)
      }
    }
  }

  const setParams = (key: string, value: any) => {
    const params = {
      size: pageNo
    }
    if ('hot' in query) {
      params.is_hot = true
    }
    if (searchTitle) {
      params.name = searchTitle
    }
    if (orderBy) {
      params.order_by = orderBy
    }
    if (orderType) {
      params.order_type = orderType
    }
    if (searchDate) {
      params.start_time = searchDate
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

  useEffect(() => {
    const tempParmes = { size: pageNo }
    if ('hot' in query) {
      tempParmes.is_hot = true
    }
    getEventListData(tempParmes)
  }, [query]);

  const clickSearch = () => {
    const { value } = document.getElementById("searchTtile")
    if (value) {
      setSearchTitle(value)
      getEventListData(setParams('name', value))
    }
  }

  const renderLeftSearchOption = () => {
    return (
      <div className="col-lg-3 mb-50">
        <div className="widget">
          <h5 className="title">{formatMessage({ id: 'project.event.date', defaultMessage: '拍卖日期' })}</h5>
          <div style={{ textAlign: 'center' }}>
            <DatePicker
              value={searchDate ? moment(searchDate) : null}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={(_, dateString) => {
                setSearchDate(dateString)
                getEventListData(setParams('start_time', dateString))
              }}
            />
          </div>
          {/* <div className="text-center mt-20">
            <a
              className="custom-button"
              style={{ color: 'white' }}
              onClick={() => {
                setSearchByDate(true)
                getEventListData(setParams('dateRange', dateRange))
              }}>{formatMessage({
                id: 'project.goods.filter',
                defaultMessage: '确认',
              })}</a>
          </div> */}
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
              getEventListData(setParams('order_by', value))
            }}>
            <Select.Option value="">{formatMessage({ id: 'project.goods.all', defaultMessage: '全部' })}</Select.Option>
            <Select.Option value="name">{formatMessage({ id: 'project.goods.name1', defaultMessage: '名称' })}</Select.Option>
            <Select.Option value="start_time">{formatMessage({ id: 'project.goods.date', defaultMessage: '日期' })}</Select.Option>
          </Select>
        </div>
        <div className="product-header-item">
          <div className="item">{formatMessage({ id: 'project.event.rowNumber', defaultMessage: '显示条数 : ' })}</div>
          <Select
            style={{ width: '80px' }}
            value={pageNo}
            onChange={(value) => {
              setPageNo(value)
              getEventListData(setParams('size', value))
            }}>
            <Select.Option value={9}>9</Select.Option>
            <Select.Option value={18}>18</Select.Option>
            <Select.Option value={36}>36</Select.Option>
            <Select.Option value={54}>54</Select.Option>
          </Select>
        </div>
        {orderType === 'asc' ?
          <ArrowUpOutlined title='升序' onClick={() => {
            setOrderType('desc')
            getEventListData(setParams('order_type', 'desc'))
          }} /> :
          <ArrowDownOutlined title='降序' onClick={() => {
            setOrderType('asc')
            getEventListData(setParams('order_type', 'asc'))
          }} />
        }
        <div className="product-search ml-auto">
          <input
            id='searchTtile'
            type="text"
            placeholder={formatMessage({ id: 'project.event.name', defaultMessage: '活动名' })}
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
          setSearchDate('')
          setSearchTitle('')
          setOrderBy('')
          setPageNo(9)
          getEventListData({ size: 9 })
        }}>{formatMessage({
          id: 'project.public.reset',
          defaultMessage: '重置',
        })}</Button>
      </div>
    )
  }

  const renderEvent = () => {
    if (eventListData && 'items' in eventListData && eventListData.items.length > 0) {
      const { items } = eventListData
      return items.map((item: any) => (
        <div
          key={item.id}
          // className={`col-sm-10 col-md-4 ${'hot' in query ? 'col-md-4' : ''}`}
          className={`col-sm-10 col-md-6 ${'hot' in query ? 'col-xl-3 col-xxl-2' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            history.push({
              pathname: '/eventGoods',
              query: {
                eventId: item.id,
                eventTitle: item.name
              },
            });
          }}
        >
          <div className="auction-item-2">
            <div className="auction-thumb">
              <GoodsImage
                src={('pic_url' in item && item.pic_url && item.pic_url.length > 0) ? item.pic_url[0] : ''}
              />
            </div>
            <div className="auction-content">
              <div title={item.name} style={{ height: '70px' }}>
                <h6 className="title">
                  <a>{item.name}</a>
                </h6>
              </div>
              <div className="item" style={{ marginBottom: 5 }}>
                <p>
                  <span style={{ color: '#43b055' }}>{formatMessage({
                    id: 'project.goods.startTime',
                    defaultMessage: '开始时间',
                  })}: </span> {getZoneTime(item.start_time)}
                </p>
              </div>
              <div className="item">
                <p>
                  <span style={{ color: '#43b055' }}>{formatMessage({
                    id: 'project.goods.endTime',
                    defaultMessage: '结束时间',
                  })}: </span> {getZoneTime(item.end_time)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))
    }
    return (
      <h5 className="title mb-3" style={{ textAlign: 'center', color: 'black' }}>
        {formatMessage({ id: 'project.public.empty', defaultMessage: '暂无拍卖会' })}
      </h5>
    );
  }


  return (
    <>
      <ScrollToTopSection loading={loading} />
      <section className="featured-auction-section padding-bottom mt--240 mt-lg--440 pos-rel">
        <div className="container2" style={{ marginTop: '120px' }}>
          <PageBreadcrumb
            routes={
              [{ name: 'hot' in query ? formatMessage({ id: 'project.event.pageBread', defaultMessage: '热门拍卖会' }) : formatMessage({ id: 'project.menu.auction', defaultMessage: '拍卖日历' }), path: null }]
            }
          />

          {'hot' in query ? (<>
            {renderTopSearch()}
            <div className="row justify-content-center mb-30-none">
              {renderEvent()}
            </div>
          </>) : (<div className="row mb--50">
            {renderLeftSearchOption()}
            <div className="col-lg-9 mb-50">
              {renderTopSearch()}
              <Spin spinning={spinning}>
                <div className="row mb-30-none justify-content-center" >
                  {renderEvent()}
                </div>
              </Spin>
            </div>
          </div>)}
          {eventListData && 'items' in eventListData && eventListData.items.length > 0 &&
            <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
              <Pagination
                className="goodsPag"
                current={eventListData.page}
                pageSize={eventListData.per_page}
                showSizeChanger={false}
                total={eventListData.total}
                showQuickJumper
                onChange={(page) => {
                  getEventListData(setParams('', null), page)
                  gotoContainer('pageTop')
                }}
              />
            </div>}
        </div>
      </section>


    </>
  )
}

export default EventList
