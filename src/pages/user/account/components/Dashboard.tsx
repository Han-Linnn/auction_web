import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi'
import { Table, Image, Spin, Button, Select } from 'antd';
import ScrollToTopSection from '@/components/ScrollToTopSection';
import { getAllEvent, getRecord, getUserBidList } from '@/services/api';
import { imageFallback } from '@/utils/constants';
import AutoCompleteInput from '@/components/AutoCompleteInput'

const Dashboard: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(0)
  const [recordData, setRecordData] = useState(null)
  const [allEventData, setAllEventData] = useState(null)
  const [bidListData, setBidListData] = useState(null)
  const [spinLoading, setSpinLoading] = useState(false)
  const [searchTitle, setSearchTitle] = useState('')
  const [searchCate, setSearchCate] = useState(0)
  const [searchEvent, setSearchEvent] = useState(0)
  const { cateData, getZoneTime, getExchangeLabel, getExchangePrice } = useModel('dataModel');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const { formatMessage } = useIntl();

  const gotoContainer = (anchorName: string) => {
    const pageTable = document.getElementById('pageTable')
    if (pageTable) {
      pageTable.scrollTop = 0
    }
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  const getRecordData = async () => {
    const response = await getRecord();
    if (response.code === 200) {
      if ('data' in response) {
        setLoading(true)
        setRecordData(response.data)
      }
    }
  }

  const getAllEventData = async () => {
    const response = await getAllEvent()
    if (response.code === 200) {
      if ('data' in response) {
        setLoading(true)
        setAllEventData(response.data)
      }
    }
  }

  const getBidListData = async (parmes: any, page = 1) => {
    setSpinLoading(true)
    const response = await getUserBidList({ ...parmes, page, size: 10 });
    if (response.code === 200) {
      if ('data' in response) {
        if ('items' in response.data) {
          for (let i = 0; i < response.data.items.length; i += 1) {
            response.data.items[i].key = `item-${i}`
          }
        }
        setBidListData(response.data)
        setSpinLoading(false)
      }
    }
  }

  const setParams = (key: string, value: any) => {
    const params = {
      user_id: currentUser?.id
    }
    if (searchTitle) {
      params.title = searchTitle
    }
    if (searchCate) {
      params.category_id = searchCate
    }
    if (searchEvent) {
      params.event_id = searchEvent
    }
    if (tab) {
      params.event_on_line = tab
    }
    if (key) {
      if (value) {
        params[key] = value
      } else if (key in params) {
        delete params[key]
      }
    }
    return params
  }

  const resetData = () => {
    document.getElementById("searchTitle").value = ''
    setSearchTitle('')
    setSearchCate(0)
    setSearchEvent(0)
  }

  const clickSearch = () => {
    const { value } = document.getElementById("searchTitle")
    if (value) {
      setSearchTitle(value)
      getBidListData(setParams('title', value))
    }
  }

  useEffect(() => {
    getRecordData()
    getAllEventData()
    getBidListData(setParams('', null))
  }, []);

  const gotoDetail = (eventId: number, id: number) => {
    if (bidListData && 'items' in bidListData && bidListData.items) {
      const tempGoodsList = {}
      let index = -1
      bidListData.items.map((item: any, i: number) => {
        const { goods } = item
        if (goods.id === id) {
          index = i
        }
        tempGoodsList[i] = { id: goods.id, eventId: goods.event_id }
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
  }

  const renderImage = (data: any) => {
    if (data?.goods?.pic_small_url && data?.goods?.pic_small_url.length > 0) {
      return (
        <div style={{ cursor: 'pointer' }}
          onClick={() => {
            gotoDetail(data?.goods?.event_id, data?.goods?.id)
          }}>
          <Image
            width={40}
            height={40}
            src={data?.goods?.pic_small_url[0]}
            preview={false}
            fallback={imageFallback}
            placeholder={<Spin />}
          />
        </div>
      );
    }
    return <img src={imageFallback} alt="img" style={{ width: 50, height: 50 }} />;
  };

  const renderTopDiv = () => {
    return (
      <div className="dashboard-widget mb-40">
        <div className="dashboard-title mb-30">
          <h5 className="title">{formatMessage({ id: 'project.user.record', defaultMessage: '我的记录' })}</h5>
        </div>
        <div className="row justify-content-center mb-30-none">
          <div className="col-md-6 col-sm-8">
            <div className="dashboard-item">
              <div className="thumb">
                <img src="./images/dashboard/01.png" alt="dashboard" />
              </div>
              <div className="content">
                <h2 className="title"><span className="counter">{recordData?.bid_count}</span></h2>
                <h6 className="info">{formatMessage({ id: 'project.user.valid', defaultMessage: '有效出价' })}</h6>
              </div>
            </div>
          </div>
          {/* <div className="col-md-4 col-sm-8">
            <div className="dashboard-item">
              <div className="thumb">
                <img src="./images/dashboard/02.png" alt="dashboard" />
              </div>
              <div className="content">
                <h2 className="title"><span className="counter">{recordData?.success_bid}</span></h2>
                <h6 className="info">{formatMessage({ id: 'project.user.success', defaultMessage: '竞拍成功' })}</h6>
              </div>
            </div>
          </div> */}
          <div className="col-md-6 col-sm-8">
            <div className="dashboard-item">
              <div className="thumb">
                <img src="./images/dashboard/03.png" alt="dashboard" />
              </div>
              <div className="content">
                <h2 className="title"><span className="counter">{recordData?.collection_count}</span></h2>
                <h6 className="info">{formatMessage({ id: 'project.user.favorites', defaultMessage: '收藏' })}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTableData = () => {
    const columns = [
      {
        title: formatMessage({ id: 'project.user.image', defaultMessage: '图片' }),
        key: 'image',
        width: 70,
        render: (_, record: any) => renderImage(record),
      },
      {
        title: formatMessage({ id: 'project.user.name', defaultMessage: '商品名称' }),
        key: 'title',
        render: (_, record: any) =>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              gotoDetail(record?.goods?.event_id, record?.goods?.id)
            }}
          >{record?.goods?.title}</span>
      },
      {
        title: `${formatMessage({ id: 'project.event.title', defaultMessage: '拍卖会' })}`,
        key: 'event',
        // width:'120px',
        render: (_, record: any) => <span>{record?.events?.name}</span>
      },
      {
        title: `${formatMessage({ id: 'project.goods.startPrice', defaultMessage: '起拍价' })}`,
        key: 'start_price',
        // width:'100px',
        render: (_, record: any) => <span>{record?.events?.show_price ? `${getExchangeLabel()} ${getExchangePrice(record?.goods?.start_price)}` : '-'}</span>
      },
      {
        title: `${formatMessage({ id: 'project.goods.myPrice', defaultMessage: '我的出价' })}`,
        key: 'my_bid',
        // width:'120px',
        render: (_, record: any) => <span>{`${record?.currency} ${record?.bid}`}</span>
      },
      {
        title: formatMessage({ id: 'project.goods.startTime', defaultMessage: '开始时间' }),
        key: 'start_time',
        width: '110px',
        render: (_, record: any) => <span>{getZoneTime(record?.events?.start_time)}</span>
      },
      {
        title: formatMessage({ id: 'project.goods.endTime', defaultMessage: '结束时间' }),
        key: 'end_time',
        width: '110px',
        render: (_, record: any) => <span>{getZoneTime(record?.events?.end_time)}</span>
      },
      {
        title: `${formatMessage({ id: 'project.goods.finalPrice', defaultMessage: '最终拍卖价' })} (JPY)`,
        key: 'final_price',
        // width: '110px',
        render: (_, record: any) => <span>{record?.goods?.final_price}</span>
      },
      // {
      //   title: formatMessage({ id: 'project.user.result', defaultMessage: '竞拍结果' }),
      //   key: 'state',
      //   width: '70px',
      //   render: (_, record: any) => <span>{record?.bid_result}</span>
      // },
    ]

    return (
      <Spin spinning={spinLoading} >
        <Table
          dataSource={bidListData?.items}
          columns={columns}
          pagination={{
            current: bidListData?.page,
            pageSize: bidListData?.per_page,
            total: bidListData?.total,
            onChange: (page) => {
              getBidListData(setParams('', null), page)
              gotoContainer('pageTop')
            }
          }}
        />
      </Spin>
    )
  }

  const renderSearch = () => {
    return (
      <div id='pageTop' className="dash-bid-item dashboard-widget mb-20">
        <div className="button-area align-items-center">
          <div className="sort-winning-bid">
            <div className="item">{formatMessage({ id: 'project.user.cate', defaultMessage: '分类: ' })}</div>
            <Select
              style={{ width: '100px' }}
              value={searchCate}
              onChange={(value) => {
                setSearchCate(value)
                getBidListData(setParams('category_id', value))
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
            <div className="item">{formatMessage({ id: 'project.event.name', defaultMessage: '活动名: ' })}</div>
            <Select
              style={{ width: '100px' }}
              value={searchEvent}
              onChange={(value) => {
                setSearchEvent(value)
                getBidListData(setParams('event_id', value))
              }}>
              <Select.Option value={0}>{formatMessage({ id: 'project.user.all', defaultMessage: '全部' })}</Select.Option>
              {allEventData && allEventData.map((item: any) => (
                <Select.Option
                  key={item.key}
                  value={item.id}
                >
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="product-search ml-auto">
            <AutoCompleteInput
              search={() => clickSearch()}
              select={(value: any) => {
                setSearchTitle(value)
                getBidListData(setParams('title', value))
              }}
            />
            <button type="button" style={{ height: '30px' }} onClick={() => {
              clickSearch()
            }}><i className="fas fa-search" /> </button>
          </div>
          <Button shape="round" style={{ marginLeft: '10px' }} onClick={() => {
            resetData()
            getBidListData({ user_id: currentUser?.id })
          }}>{formatMessage({
            id: 'project.public.reset',
            defaultMessage: '重置',
          })}</Button>
        </div>
      </div>
    )
  }

  const renderbottomDiv = () => {
    return (
      <div id='pageTop' className="dashboard-widget">
        <h5 className="title mb-10">{formatMessage({ id: 'project.user.history', defaultMessage: '竞拍记录' })}</h5>
        <div className="dashboard-purchasing-tabs">
          <ul className="nav-tabs nav">
            <li>
              <a
                className={tab === 0 ? "active" : ''}
                data-toggle="tab"
                onClick={() => {
                  setTab(0)
                  getBidListData(setParams('event_on_line', 0))
                }}
              >
                {formatMessage({ id: 'project.user.all', defaultMessage: '所有' })}
              </a>
            </li>
            <li>
              <a
                className={tab === 2 ? "active" : ''}
                data-toggle="tab"
                onClick={() => {
                  setTab(2)
                  getBidListData(setParams('event_on_line', 2))
                }}
              >
                {formatMessage({ id: 'project.user.undetermined', defaultMessage: '待定' })}
              </a>
            </li>
            <li>
              <a
                className={tab === 3 ? "active" : ''}
                data-toggle="tab"
                onClick={() => {
                  setTab(3)
                  getBidListData(setParams('event_on_line', 3))
                }}
              >
                {formatMessage({ id: 'project.user.history2', defaultMessage: '历史' })}
              </a>
            </li>
          </ul>
          {renderSearch()}
          <div id='pageTable' className="tab-content">
            {renderTableData()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ScrollToTopSection loading={loading} />
      <div className="col-lg-9">
        {renderTopDiv()}
        {renderbottomDiv()}
      </div>
    </>
  )
}
export default Dashboard
