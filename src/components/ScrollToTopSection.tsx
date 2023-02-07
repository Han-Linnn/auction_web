import React from 'react';

const ScrollToTopSection: React.FC<{ props: { loading: boolean } }> = (props) => {
  const { loading } = props

  return (
    <>
      {!loading && <div className="overlayer" id="overlayer">
        <div className="loader">
          <div className="loader-inner"></div>
        </div>
      </div>}
      <a href="#top" className="scrollToTop active" >
        <i className="fas fa-angle-up" />
      </a>
    </>
  )
}

export default ScrollToTopSection
