import React from 'react';
import PageHeader from '@/components/PageHeader';

const PageLayout: React.FC<{ props: any }> = (props) => {
  const { children } = props;

  return (
    <>
      <header>
        <PageHeader />
      </header>
      <div className="hero-section style-2">
        <div className="bg_img hero-bg bottom_center"
          style={{ backgroundImage: `url(${require('../../public/images/banner/hero-bg.png')})` }}
        />
      </div>
      {children}
    </>
  )
}
export default PageLayout
