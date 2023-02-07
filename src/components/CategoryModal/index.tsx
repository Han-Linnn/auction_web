import React, { useEffect, useState } from 'react';
import { useIntl, useModel, useAccess } from 'umi'
import { Modal, Checkbox, Divider, Row, Col, Button, message } from 'antd';
import { getCategoryCollectionList, postCollection, deleteCollection } from '@/services/api';
import NoAccess from '@/components/NoAccess'

const CategoryModal: React.FC<{
  props: {
    visible: boolean
  }
}> = (props) => {
  const { visible } = props
  const { formatMessage } = useIntl();
  const access = useAccess()
  const { cateData, getCollectionCate } = useModel('dataModel');
  const [plainOptions, setPlainOptions] = useState([]);
  const [collectionData, setCollectionData] = useState([])
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const initplainOptions = () => {
    const tempData = []
    if (cateData && cateData.length > 0) {
      cateData.forEach((item: any) => {
        tempData.push({ label: item.category_name, value: item.id })
      })
    }
    setPlainOptions(tempData)
  }

  const getCollectionData = async () => {
    const response = await getCategoryCollectionList({ page: 1, size: 99 });
    if (response.code === 200) {
      if ('data' in response) {
        if ('items' in response.data) {
          const temp = []
          response.data.items.forEach((item: any) => {
            temp.push(item.category_id)
          })
          setCheckedList(temp)
          setCollectionData(temp)
        }
      }
    }
  }

  const delCateData = async (showMes: boolean) => {
    const temp = collectionData.filter(key => !checkedList.includes(key))
    if (temp.length > 0) {
      const response = await deleteCollection({ category_list: temp })
      if (response.code === 202) {
        props.onSucc()
        if (showMes) {
          getCollectionCate()
          message.success(formatMessage({
            id: 'project.message.collection.cancel',
            defaultMessage: '取消成功',
          }))
        }
      }
    } else {
      props.onSucc()
    }
  }

  const submitCateData = async (checkedList: number[]) => {
    if (checkedList.length > 0) {
      // 各有增删
      const response = await postCollection({ category_list: checkedList });
      if (response.code === 201) {
        delCateData(false)
        message.success(formatMessage({
          id: 'project.message.collection.success',
          defaultMessage: '收藏成功',
        }))
        getCollectionCate()
      }
    } else {
      // 全删除
      delCateData(true)
    }
  }

  useEffect(() => {
    initplainOptions()
    getCollectionData()
  }, [])

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const getAllId = () => {
    const temp = []
    plainOptions.forEach((item: any) => {
      temp.push(item.value)
    })
    return temp
  }

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? getAllId() : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const renderItem = () => {
    if (plainOptions.length > 0) {
      return (
        <>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}>
            {formatMessage({ id: 'project.cate.ModalSelect', defaultMessage: '全选' })}
          </Checkbox>
          <Divider />
          <Checkbox.Group
            style={{ width: '100%' }}
            value={checkedList}
            onChange={onChange}>
            <div
              style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Row>
                {plainOptions.map((item: any) => (
                  <Col key={item.value} span={8}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </div>

          </Checkbox.Group>
        </>
      )
    }
    return null
  }

  const renderFooter = () => {
    if (access.canFollow) {
      return (<>
        <Button key="back" onClick={() => {
          props.modalCancel()
        }}>
          {formatMessage({ id: 'project.public.ModalButton2', defaultMessage: '取消' })}
        </Button>
        <Button key="submit" type="primary" onClick={() => {
          submitCateData(checkedList)
        }}>
          {formatMessage({ id: 'project.public.ModalButton1', defaultMessage: '确认' })}
        </Button>
      </>
      )
    }
    return <NoAccess />
  }

  return (
    <Modal
      title={formatMessage({ id: 'project.cate.ModalTitle', defaultMessage: '您在寻找什么类型的拍卖品？' })}
      visible={visible}
      maskClosable={false}
      // closable={false}
      onCancel={() => {
        props.modalCancel()
      }}
      footer={renderFooter()}
    >
      {renderItem()}
    </Modal>
  )
}

export default CategoryModal
