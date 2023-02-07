import React from 'react';
import { useIntl } from 'umi';

const BannerSection: React.FC<{ props: any }> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <section className="banner-section-5 bg_img oh"
      style={{ backgroundImage: `url(${require('../../../../public/images/banner/banner-bg-4.png')})` }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-10 col-lg-9 col-xl-9">
            <div className="banner-content cl-white">
              <h5 className="cate">{formatMessage({
                id: 'project.banner.title1',
                defaultMessage: '全新的体验',
              })}</h5>
              <h1 className="title">
                <span className="d-xl-block">{formatMessage({ id: 'project.banner.title2', defaultMessage: '随时随地' })}</span>
                {formatMessage({ id: 'project.banner.title3', defaultMessage: '买你想买' })}
              </h1>
              <p className="mw-500">
                {formatMessage({ id: 'project.banner.title4', defaultMessage: '您身边的拍卖专家' })}
              </p>
              <a className="custom-button yellow btn-large" onClick={() => {
                props.gotoContainer('HightlightSliderSection')
              }}>{formatMessage({
                id: 'project.banner.experience',
                defaultMessage: '立即体验',
              })}</a>
            </div>
          </div>
          <div className="col-lg-3 col-xl-3 d-none d-lg-block">
            <div className="banner-thumb-5">
              <img src="./images/banner/banner-5.png" alt="banner" />
            </div>
          </div>
        </div>
      </div>
      <div className="banner-shape banner-shape-5 d-none d-lg-block bot-0">
        <img src="./css/img/banner-shape-4.png" alt="css" />
      </div>
    </section>
  )
}

export default BannerSection
