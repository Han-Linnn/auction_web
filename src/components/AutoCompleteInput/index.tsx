import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import { getGoodsName } from '@/services/api'
import { useIntl } from 'umi'

let timeout: any = null;
let currentValue: string = '';

const AutoCompleteInput: React.FC<{ props: any }> = (props) => {
  const { formatMessage } = useIntl();
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const fetch = (value: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const getData = async () => {
      const response = await getGoodsName({ keyword: value }); // size 返回记录数量
      if (response.code === 200) {
        if (currentValue === value) {
          if ('data' in response) {
            const { data } = response
            const temp: { value: string }[] = []
            data.forEach((item: any) => {
              temp.push({ value: item })
            })
            setOptions(temp);
          }
        }
      }
    }

    timeout = setTimeout(getData, 300);
  }

  const onSearch = async (searchText: string) => {
    if (searchText) {
      fetch(searchText)
    } else {
      setOptions([])
    }
  };

  const onSelect = (data: string) => {
    props.select(data)
  };


  return (
    <AutoComplete
      id='searchTitle'
      style={{
        width: '150px',
        height: '100%',
        fontSize: '14px',
      }}
      placeholder={formatMessage({
        id: 'project.goods.name',
        defaultMessage: '商品名',
      })}
      options={options}
      onSearch={onSearch}
      onSelect={onSelect}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          props.search()
        }
      }}
    />
  );
}

export default AutoCompleteInput
