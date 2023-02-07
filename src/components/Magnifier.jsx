import React, { useEffect, useState, useMemo } from 'react';
import { Spin } from 'antd';
/**
 * 配置项
 * @param {*} scale integer 图片放大倍数
 * @param {*} width integer 组件宽度
 * @param {*} height integer 组件高度
 */
// 根据父级宽度生成 配置项 参数
function fetMainParams(clientWidth = 500) {
  const PARAMS = {
    // 放大倍数
    scale: 2,
    // 组件宽
    width: clientWidth,
    // 组件高 (特别注意.因为箱包和手表的图不一样.)
    height: clientWidth,
  };

  // 鼠标悬停小方块 width的半径
  const mouseRadiusW = PARAMS.width / PARAMS.scale / 3;
  // 鼠标悬停小方块 height的半径
  const mouseRadiusH = PARAMS.height / PARAMS.scale / 3;

  const ClassObj = {
    // 图片容器
    imgContainer: {
      width: `${PARAMS.width}px`,
      height: `${PARAMS.height}px`,
      border: '1px solid #dcdcdc',
      cursor: 'move',
      position: 'relative',
    },

    // 遮罩
    maskBlock: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      // background: "rgba(0,0,0,0)",
      zIndex: 100,
    },

    // 鼠标悬停小方块样式
    mouseBlock: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: `${mouseRadiusW * 2}px`,
      height: `${mouseRadiusH * 2}px`,
      background: 'rgba(0,0,0,0.1)',
      zIndex: 99,
    },

    // 放大镜容器样式
    magnifierContainer: {
      position: 'absolute',
      left: `${PARAMS.width}px`,
      top: '0',
      width: `${PARAMS.width}px`,
      height: `${PARAMS.height}px`,
      border: '1px solid #dcdcdc',
      overflow: 'hidden',
      zIndex: 98,
    },

    // 图片放大样式 此处图片宽高不能设置为百分比，在scale的作用下，放大的只是图片初始的宽高 ！！！
    imgStyle: {
      width: `${PARAMS.width}px`,
      height: `${PARAMS.height}px`,
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `scale(${PARAMS.scale})`,
      transformOrigin: 'top left',
    },
  };

  return { PARAMS, mouseRadiusW, mouseRadiusH, ClassObj };
}

/**
 * 参数
 * @param {*} imgUrl string 图片url
 * @param {} position string [left] 放大镜位置 默认位于右边, left左边
 */
export default (props) => {
  // 图片信息
  const [imgUrl, setImgUrl] = useState('');
  // 配置项参数
  const [{ PARAMS, mouseRadiusW, mouseRadiusH, ClassObj }, setMainParams] = useState({
    PARAMS: {},
    mouseRadiusW: 0,
    mouseRadiusH: 0,
    ClassObj: {},
  });
  // 移入移出开关
  const [magnifierOff, setMagnifierOff] = useState(false);
  // 放大镜样式
  const [{ mouseBlock, imgStyle }, setMouseImg] = useState({
    mouseBlock: {},
    imgStyle: {},
  });
  const [imgLoading, setImgLoading] = useState(true);

  // 计算相关参数
  const calculationBlock = (offsetX, offsetY) => {
    const cssStyle = {
      mouseBlock: { ...mouseBlock },
      imgStyle: { ...imgStyle },
    };
    let offsetW = offsetX;
    let offsetH = offsetY;
    /* 小方块位置 */
    // 防止鼠标移动过快导致计算失误，只要小于或者大于对应值，直接设置偏移量等于最小值或者最大值
    // 判断与左右的边距
    if (offsetX < mouseRadiusW) {
      offsetW = mouseRadiusW;
    } else if (offsetX > PARAMS.width - mouseRadiusW) {
      offsetW = PARAMS.width - mouseRadiusW;
    }

    // 判断 鼠标小方块 与上下的边距
    if (offsetY < mouseRadiusH) {
      offsetH = mouseRadiusH;
    } else if (offsetY > PARAMS.height - mouseRadiusH) {
      offsetH = PARAMS.height - mouseRadiusH;
    }

    const left = offsetW - mouseRadiusW;
    const top = offsetH - mouseRadiusH;

    // 设置鼠标悬停小方块
    cssStyle.mouseBlock.left = left;
    cssStyle.mouseBlock.top = top;

    /* 计算图片放大位置 */
    cssStyle.imgStyle.left = (-left * PARAMS.scale) / 1.333;
    cssStyle.imgStyle.top = (-top * PARAMS.scale) / 1.333;

    setMouseImg(cssStyle);
  };

  // 鼠标移入
  const mouseEnter = () => {
    setMagnifierOff(true);
  };

  // 鼠标移除
  const mouseLeave = () => {
    setMagnifierOff(false);
  };

  // 鼠标移动
  const mouseMove = (event) => {
    const e = event.nativeEvent;
    calculationBlock(e.offsetX, e.offsetY);
  };

  // 放大镜容器样式
  const magnifierMemo = useMemo(() => {
    if (props.position === 'left') {
      return {
        ...ClassObj.magnifierContainer,
        left: `-${PARAMS.width}px`,
      };
    }
    return ClassObj.magnifierContainer;
  }, [props.position, ClassObj]);

  const init = () => {
    const clientWidth = document.getElementById('imgDiv').clientWidth || 500;
    const results = fetMainParams(clientWidth);
    setMainParams(results);
    setMouseImg({
      mouseBlock: results.ClassObj.mouseBlock,
      imgStyle: results.ClassObj.imgStyle,
    });
  };

  // 根据父级容器生成宽度
  useEffect(() => {
    init();
    window.addEventListener('resize', init);
  }, []);

  useEffect(() => {
    setImgUrl(props.imgUrl);
    setImgLoading(true);
  }, [props.imgUrl]);

  return (
    <div
      id="imgDiv"
      style={{ position: 'relative', float: 'right', width: '100%', marginBottom: '20px' }}
    >
      <div style={ClassObj.imgContainer}>
        <Spin spinning={imgLoading}>
          <img
            src={imgUrl}
            width="100%"
            height="100%"
            alt="图片加载失败"
            onLoad={() => {
              setImgLoading(false);
            }}
          />
        </Spin>
        <div
          style={ClassObj.maskBlock}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          onMouseMove={mouseMove}
        />
        {imgUrl && magnifierOff && <div style={mouseBlock} />}
      </div>

      {imgUrl && magnifierOff && (
        <div style={magnifierMemo}>
          <img style={imgStyle} src={imgUrl} alt="图片加载失败" />
        </div>
      )}
    </div>
  );
};
