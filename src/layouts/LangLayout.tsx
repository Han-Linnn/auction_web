import React, { useEffect } from 'react';
import { setLocale } from 'umi'
import { lang } from '@/utils/constants';
import { getUserIp } from '@/services/api'

const LangLayout: React.FC<{ props: any }> = (props) => {
  const { children } = props;

  const getUserIpData = async () => {
    // fetch('https://api.myip.la/en?json',{
    //   method:'GET',
    // })
    //  .then(res =>res.json())
    //  .then((data) => {
    //    console.log('--data--',data)
    //  })

    const temp = sessionStorage.getItem(lang);
    if (temp) {
      setLocale(temp);
    } else {
      const response = await getUserIp();
      if (response.code === 200) {
        const { data } = response
        switch (data?.country_code) {
          case 'CN':
            setLocale('zh-CN');
            break;
          case 'JP':
            setLocale('ja-JP');
            break;
          case 'HK':
          case 'MO':
          case 'TW':
            setLocale('zh-TW');
            break;
          default:
            setLocale('en-US');
            break;
        }
      } else {
        setLocale('en-US');
      }
    }
  }

  useEffect(() => {
    getUserIpData()
  }, [])

  return (
    <>
      {children}
    </>
  )
}
export default LangLayout
