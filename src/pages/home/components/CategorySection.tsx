import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import CategoryModal from '@/components/CategoryModal';
import { getCategoryCollectionList } from '@/services/api';

const CategorySection: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false)
  const [collectionData, setCollectionData] = useState([])

  const getCollectionData = async () => {
    const response = await getCategoryCollectionList({ page: 1, size: 99 });
    if (response.code === 200) {
      if ('data' in response) {
        if ('items' in response.data) {
          const temp = []
          response.data.items.forEach((item: any) => {
            temp.push(item.category_id)
          })
          setCollectionData(temp)
        }
      }
    }
  }

  useEffect(() => {
    getCollectionData()
  }, []);

  return (
    <>
      {collectionData.length === 0 &&
        <>
          <section className="call-in-section padding-top pt-max-xl-0">
            <div className="container">
              <div className="call-wrapper cl-white bg_img"
                style={{ backgroundImage: `url(${require('../../../../public/images/call-in/call-bg.png')})` }}
              >
                <div className="section-header">
                  <h3 className="title">{formatMessage({ id: 'project.cate.title1', defaultMessage: '手表 珠宝 相机 ...' })}</h3>
                  <p>{formatMessage({ id: 'project.cate.title2', defaultMessage: '请选择你喜欢的拍卖品类项？' })}</p>
                </div>
                <a className="custom-button white" onClick={() => {
                  setVisible(true)
                }} >{formatMessage({ id: 'project.cate.button', defaultMessage: '请选择' })}</a>
              </div>
            </div>
          </section>
          <CategoryModal
            visible={visible}
            modalCancel={() => {
              setVisible(false)
            }}
            onSucc={() => {
              setVisible(false)
              getCollectionData()
            }}
          />
        </>
      }
    </>
  )
}

export default CategorySection
