import React from 'react';
import { history, useIntl, useModel } from 'umi';
import { Carousel, Spin, Image } from 'antd';
import Media from 'react-media';
import { imageFallback } from '@/utils/constants';

const EventSection: React.FC<{ props: { eventListData: any } }> = (props) => {
  const { eventListData } = props
  const { formatMessage } = useIntl();
  const { getZoneTime } = useModel('dataModel');
  let eventCarousel = null

  const renderMoreBtn = () => {
    if (eventListData && eventListData.length > 0) {
      return (
        <a className="custom-button white"
          style={{ float: 'right', marginTop: '20px' }}
          onClick={() => {
            history.push({
              pathname: '/event',
              query: {
                hot: true
              },
            });
          }}
        >
          {formatMessage({ id: 'project.public.more', defaultMessage: '查看全部' })}
        </a>)
    }
    return null
  }

  const renderEventCarousel = (listNumber: number) => {
    const tempListData = [];
    for (let i = 0; i < Math.ceil(eventListData.length / listNumber); i += 1) {
      const temp = []
      for (let x = 0; x < listNumber; x += 1) {
        if (eventListData.length > ((i * listNumber) + x)) {
          temp.push(eventListData[(i * listNumber) + x])
        }
      }
      tempListData.push(temp)
    }

    return (
      <Carousel
        autoplay
        dots={false}
        ref={dom => { eventCarousel = dom }}
      >
        {tempListData.map((listItem: any, index: number) => (
          <div key={`eventItem-${index}`}>
            {listItem.map((item: any) => (
              <a key={item.id}
                className="browse-item-2"
                style={{
                  margin:'5px',
                  width: `${Math.floor(100 / listNumber) - 3}%`,
                  float: 'left'
                }}
                onClick={() => {
                  props.eventChange(item.id)
                }}
              >
                <div className="thumb">
                  <Image
                    width="100%"
                    height="100%"
                    style={{ width: "80px", height: '80px' }}
                    src={('pic_small_url' in item && item.pic_small_url && item.pic_small_url.length > 0) ? item.pic_small_url[0] : ''}
                    fallback={imageFallback}
                    preview={false}
                    placeholder={
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <Spin size="large" />
                      </div>
                    }
                  /></div>
                <div className="content">
                  <span className="title">{item.name}</span>
                  <span className="info">{item.source}</span>
                  <span className="info">
                    {formatMessage({ id: 'project.info.start', defaultMessage: '开始：' })}
                    {`${getZoneTime(item.start_time)}`}
                  </span>
                  <span className="info">
                    {formatMessage({ id: 'project.info.end', defaultMessage: '结束: ' })}
                    {`${getZoneTime(item.end_time)}`}
                  </span>
                </div>
              </a>
            ))}
          </div>))
        }
      </Carousel>
    )
  }

  const renderEvent = () => {
    if (eventListData && eventListData.length > 0) {
      return (
        <Media queries={{
          mini: "(max-width: 699px)",
          small: "(min-width: 700px) and (max-width: 1000px)",
          medium: "(min-width: 1001px) and (max-width: 1400px)",
          large: "(min-width: 1401px)"
        }}>
          {matches => (
            <>
              {matches.mini && renderEventCarousel(1)}
              {matches.small && renderEventCarousel(2)}
              {matches.medium && renderEventCarousel(3)}
              {matches.large && renderEventCarousel(4)}
            </>
          )}
        </Media>
      )
    }
    return (
      <h5 className="title mb-3" style={{ textAlign: 'center', color: 'black' }}>
        {formatMessage({ id: 'project.public.empty', defaultMessage: '暂无拍卖会' })}
      </h5>
    );
  }

  return (
    <div id='HightlightSliderSection' className="browse-slider-section padding-top pt-lg-0 mt--140 mt-max-xl-0">
      <div className="container2">
        {eventListData && eventListData.length > 0 && <>
          <div className="section-header-2 mb-4">
            <div className="left">
              <h6 className="title pl-0">{formatMessage({ id: 'project.info.title', defaultMessage: '热门拍卖会' })}</h6>
            </div>
            {eventListData.length > 1 && <div className="slider-nav">
              <a className="bro-prev" onClick={() => {
                eventCarousel.prev()
              }}><i className="flaticon-left-arrow" /></a>
              <a className="bro-next active"
                onClick={() => {
                  eventCarousel.next()
                }}
              ><i className="flaticon-right-arrow" /></a>
            </div>}
          </div>
          <div className="m--15">
            {renderEvent()}
          </div>
          {renderMoreBtn()}
        </>
        }
      </div>
    </div >
  )
}

export default EventSection
