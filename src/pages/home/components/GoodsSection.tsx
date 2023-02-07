import React, { useState } from 'react';
import { history, useIntl } from 'umi'
import { Spin, Select } from 'antd';
import GoodsItem from '@/components/GoodsItem';


const GoodsSection: React.FC<{
  props: {
    spinning: boolean,
    eventId: number,
    eventTitle: string,
    goodsListData: any
  }
}> = (props) => {
  const { spinning, eventId, eventTitle, goodsListData } = props
  const { formatMessage } = useIntl();

  const checkData = () => {
    return goodsListData && goodsListData.length > 0
  }

  // const hideParams = (index,listData) => {
  //   const params = "index=" + index + "&listData=" + listData;
  //   const url = '/detail?' + params;
  //   //首先创建一个form表单  
  //   var tempForm = document.createElement("form");
  //   tempForm.id = "tempForm1";
  //   //制定发送请求的方式为post  
  //   tempForm.method = "post";
  //   //此为window.open的url，通过表单的action来实现  
  //   tempForm.action = url;
  //   //利用表单的target属性来绑定window.open的一些参数（如设置窗体属性的参数等）  
  //   tempForm.target = "_blank";
  //   //创建input标签，用来设置参数  
  //   var hideInput = document.createElement("input");
  //   hideInput.type = "hidden";
  //   hideInput.name = "index";
  //   hideInput.value = index;
  //   var hideInput2 = document.createElement("input");
  //   hideInput2.type = "hidden";
  //   hideInput2.name = "listData";
  //   hideInput2.value = listData;
  //   //将input表单放到form表单里  
  //   tempForm.appendChild(hideInput);
  //   tempForm.appendChild(hideInput2);
  //   //将此form表单添加到页面主体body中  
  //   document.body.appendChild(tempForm);
  //   //手动触发，提交表单  
  //   tempForm.submit();
  //   //从body中移除form表单  
  //   document.body.removeChild(tempForm);
  // }

  const renderGoods = () => {
    if (checkData()) {
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
            key={item.id}
            type={1}
            goodsData={item}
            collectionChange={() => { props.reLoadGoodslist() }}
            bidSuccess={(type: number, goodsId: number) => {
              if (type === 1 && goodsId === item.id) {
                props.reLoadGoodslist()
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
    );
  }

  const renderMoreBtn = () => {
    if (checkData()) {
      return (
        <a className="custom-button white"
          style={{ float: 'right', marginTop: '20px' }}
          onClick={() => {
            history.push({
              pathname: '/eventGoods',
              query: {
                eventId,
                eventTitle
              },
            });
          }}
        >
          {formatMessage({ id: 'project.public.more', defaultMessage: '查看全部' })}
        </a>
      )
    }
    return null
  }

  const renderEvent = () => (
    <div className="container2">
      <div id='goods-section' className="section-header-3">
        <div className="left d-block">
          <h6 className="title mb-3">
            {`${eventTitle ? `${eventTitle}-` : ''}${formatMessage({
              id: 'project.goods.title',
              defaultMessage: '商品列表',
            })} `}
          </h6>
        </div>
      </div>
      <div className="row justify-content-center mb-30-none">
        {renderGoods()}
      </div>
      {renderMoreBtn()}
    </div>
  )

  return (
    <section className="featured-auction-section padding-bottom padding-top pos-rel oh" style={{ width: '100vw' }}>
      <div className="car-bg"><img src="./images/auction/featured/featured-bg-2.png" alt="featured" /></div>
      {checkData() && <Spin spinning={spinning}>{renderEvent()}</Spin>}
    </section>
  )
}

export default GoodsSection
