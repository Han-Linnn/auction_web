import { useState } from 'react';
import {
  getGoodsCate,
  getBidRule,
  getCategoryCollectionList,
  getExchangeRate,
} from '@/services/api';
import { getLocale } from 'umi';
import moment_tz from 'moment-timezone'

export default function useAuthModel() {
  const [cateData, setCateData] = useState<any>(null) // 分类信息
  const [cateLoading, setCateLoading] = useState(false)
  const [bidRuleData, setBidRuleData] = useState<any>(null) // 出价规则
  const [bidRuleLoading, setBidRuleLoading] = useState(false)
  const [collectionCateData, setCollectionCateData] = useState<any>(null) // 关注分类
  const [exchangeData, setExchangeData] = useState<number>(1) // 汇率信息
  const [exchangeLoading, setExchangeLoading] = useState(false)


  // -----------------------------分类信息--------------------------------------- //
  const getGetCate = async () => {
    setCateLoading(true)
    const response = await getGoodsCate({});
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response;
        for (let i = 0; i < data.length; i += 1) {
          data[i].key = data[i].id;
        }
        setCateData(data)
      }
    }
  };

  const getCategoryName = (id: number) => {
    let tempName = '-';
    if (cateData && cateData.length > 0) {
      cateData.forEach((item: any) => {
        if (item.id === id) {
          tempName = item.category_name;
        }
      });
    }
    return tempName;
  };

  if (!cateData && !cateLoading) {
    getGetCate()
  }

  // ------------------------------出价规则-------------------------------------- //
  const getBidRuleData = async () => {
    setBidRuleLoading(true)
    const response = await getBidRule({});
    if (response.code === 200) {
      if ('data' in response) {
        setBidRuleData(response.data)
      }
    }
  };

  const getBidRuleByKey = (goodsPrice: number, key: string) => {
    let temp = 0
    if (bidRuleData && bidRuleData.length > 0) {
      bidRuleData.forEach((item: any) => {
        if (item.high) {
          if (goodsPrice >= item.low
            && goodsPrice <= item.high) {
            temp = item[key]
          }
        } else if (goodsPrice >= item.low) {
          temp = item[key]
        }
      })
    }
    return temp
  }

  if (!bidRuleData && !bidRuleLoading) {
    getBidRuleData()
  }

  // ----------------------------关注分类---------------------------------------- //
  const getCollectionCate = async () => {
    const response = await getCategoryCollectionList({ page: 1, size: 99 }); // 接口默认分页.缺乏查询全部
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response;
        if ('items' in data) {
          const { items } = data;
          for (let i = 0; i < items.length; i += 1) {
            items[i].key = items[i].id;
          }
          setCollectionCateData(items)
        }
      }
    }
  };

  // ----------------------------汇率信息---------------------------------------- //
  const getExchangeRateData = async () => {
    setExchangeLoading(true)
    const loacle = getLocale()
    const dicLoacle = { 'ja-JP': 'JPY', 'en-US': 'USD', 'zh-CN': 'CNY', 'zh-TW': 'HKD' }
    const response = await getExchangeRate({
      base_currency_code: 'JPY',
      ending_currency_code_list: dicLoacle[loacle],
    });
    if (response.code === 200) {
      if ('data' in response) {
        const { data } = response;
        if ('items' in data && data.items && data.items.length > 0) {
          const temp = data.items[0]
          if ('exchange_rate' in temp && temp.exchange_rate) {
            setExchangeData(temp?.exchange_rate)
          }
        }
      }
    }
  };

  if (!exchangeLoading) {
    getExchangeRateData()
  }

  const getExchangePrice = (price: any) => {
    if (price) {
      return `${parseInt(price * exchangeData)}`
    }
    return '-'
  }

  const getExchangeLabel = () => {
    const loacle = getLocale()
    // console.log('-loacle-', loacle)
    const dicLoacle = { 'ja-JP': 'JPY', 'en-US': 'USD', 'zh-CN': 'CNY', 'zh-TW': 'HKD' }
    return loacle in dicLoacle ? dicLoacle[loacle] : 'CNY'
  }

  // ----------------------------时区转化---------------------------------------- //
  const getZoneTime = (date: any) => {
    let tempDate = date
    if (date) {
      const loacle = getLocale()
      if (loacle === 'ja-JP') {
        // 东京时间
        tempDate = moment_tz.tz(date, "Asia/Tokyo").format('YYYY-MM-DD HH:mm:ss')
      } else {
        tempDate = moment_tz.tz(date, "Asia/Tokyo")
        // 伦敦时间 : 北京时间
        const str = loacle === 'en-US' ? "Europe/London" : "Asia/Shanghai"
        tempDate = tempDate.clone().tz(str).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    return tempDate
  }

  return {
    cateData,
    getCategoryName,
    bidRuleData,
    getBidRuleByKey,
    collectionCateData,
    getCollectionCate,
    exchangeData,
    getExchangeLabel,
    getExchangePrice,
    getZoneTime,
  };
}
