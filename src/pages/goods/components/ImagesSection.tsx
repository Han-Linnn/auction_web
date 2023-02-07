import React, { useEffect, useState } from 'react';
import { Spin, Image } from 'antd';
import { imageFallback } from '@/utils/constants';

const ImagesSection: React.FC<{ props: any }> = (props) => {
  const { detailData } = props;
  const [imgURL, setImgURL] = useState<string>('');

  const gotoContainer = (anchorName: string) => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  useEffect(() => {
    setImgURL('')
  }, [detailData]);

  const scrollAction = (type: string) => {
    const tableBody = document.getElementById('scrollImages')
    const step = 230
    if (tableBody) {
      if (type === 'left') {
        tableBody.scrollLeft -= step
      } else if (type === 'right') {
        tableBody.scrollLeft += step
      }
    }
  };

  const renderBigImage = () => {
    if ('pic_url' in detailData && detailData.pic_url.length > 0) {
      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Image
            width="50%"
            height="50%"
            style={{ cursor: 'pointer' }}
            // preview={false}
            src={imgURL || detailData.pic_url[0]}
            fallback={imageFallback}
            placeholder={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Spin size="large" />
              </div>
            }
          />
        </div>
      )
    }
    return null
  }

  const renderImages = () => {
    if ('pic_small_url' in detailData && detailData.pic_small_url.length > 0) {
      return detailData.pic_small_url.map((item: any, index: number) => (
        <div
          key={`img-${index}`}
          style={{
            display: 'inline-block',
            float: 'none',
            marginRight: '20px',
          }}
        >
          <Image
            width='10vw'
            height='10vw'
            style={{
              borderRadius: '20px',
              boxShadow: '0px 0px 15px rgba(22, 26, 57, 0.36)',
              cursor: 'pointer',
            }}
            preview={false}
            src={item}
            fallback={imageFallback}
            placeholder={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Spin size="large" />
              </ div>
            }
            onClick={() => {
              if ('pic_url' in detailData && detailData.pic_url.length > 0) {
                setImgURL(detailData.pic_url[index]);
                gotoContainer('pageTop')
              }
            }}
          />
        </div>
      ))
    }
    return null
  }

  const renderImageList = () => {
    return (
      <div className="product-details-slider-wrapper">
        <div className="product-bottom-slider" id="sync2">
          <div id='scrollImages' style={{
            display: 'flex',
            width: 'auto',
            overflow: 'auto',
          }}>
            {renderImages()}
          </div>
        </div>
        <span className="det-prev det-nav" onClick={() => {
            scrollAction('left')
          }} >
          <i className="fas fa-angle-left"/>
        </span>
        <span className="det-next det-nav active" onClick={() => {
            scrollAction('right')
          }} >
          <i className="fas fa-angle-right"/>
        </span>
      </div>
    )
  }

  return (
    <>
      <div id='pageTop' className="product-details-slider-top-wrapper">
        <div className="product-details-slider owl-theme owl-carousel" id="sync1">
          {renderBigImage()}
        </div>
      </div>
      {renderImageList()}
    </>
  )
}

export default ImagesSection
