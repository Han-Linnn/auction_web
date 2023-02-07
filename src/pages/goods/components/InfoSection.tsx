import React, { useEffect, useState } from 'react';
import { useIntl, getLocale } from 'umi'
import { Button } from 'antd';
import { getTranslateList } from '@/services/api';

const InfoSection: React.FC<{ props: any }> = (props) => {
  const { detailData } = props;
  const { formatMessage } = useIntl();
  const [translateDic, setTranslateDic] = useState({})

  const checkData = () => {
    return 'property_json' in detailData && detailData.property_json
  }

  const getTranslateData = async () => {
    const loacle = getLocale()
    if (loacle !== 'en-US') {
      const response = await getTranslateList({ type: loacle === 'ja-JP' ? 4 : 3 })
      if (response.code === 200) {
        setTranslateDic(response.data)
      }
    }
  };

  useEffect(() => {
    if (checkData()) {
      getTranslateData();
    }
  }, []);

  const renderInfoData = () => {
    if (checkData()) {
      const { property_json } = detailData;
      return Object.keys(property_json).map((key) => {
        return (
          <tr key={key} style={{ borderLeft: '1px solid #e0e0f1', borderBottom: '1px solid #e0e0f1' }}>
            <th><b style={{ color: 'grey' }}>{
              Object.keys(translateDic).length > 0 && key in translateDic
                ? translateDic[key]
                : key}
            </b></th>
            <td>{property_json[key] || '-'}</td>
          </tr>
        )
      });
    }
    return null
  }

  return (
    <div className="container"
      style={{
        marginTop: '20px',
        paddingTop: '10px',
        borderTop: '1px solid #e0e0f1'
      }}>
      <div className="tab-content">
        <div className="tab-pane fade show active" id="details">
          <div className="tab-details-content">
            <div className="header-area">
              <h6 className="title">{formatMessage({
                id: 'project.goods.info',
                defaultMessage: '商品信息',
              })}</h6>
              <div className="item">
                <table className="product-info-table">
                  <tbody>
                    {renderInfoData()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <Button style={{ marginRight: '20px' }} onClick={() => {
          props.nextGoods(false)
        }}>
          {formatMessage({ id: 'project.goods.last', defaultMessage: '上一个商品' })}
        </Button>
        <Button type='primary' onClick={() => {
          props.nextGoods(true)
        }}>
          {formatMessage({ id: 'project.goods.next', defaultMessage: '下一个商品' })}
        </Button>
      </div>
    </div>
  )
}

export default InfoSection
