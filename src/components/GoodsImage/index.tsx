import React from 'react';
import { Spin, Image } from 'antd';
import { imageFallback } from '@/utils/constants';
import styles from './index.less';


const GoodsImage: React.FC<{
  props: {
    src: string
  }
}> = (props) => {
  const { src } = props

  return (
    <div className={styles.ver_pic}>
      <div className={styles.subpic}>
        <Image
          className={styles.img}
          src={src}
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
        />
      </div>
    </div>
  )

}
export default GoodsImage
