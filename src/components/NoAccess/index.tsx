import React from 'react';
import { Popover } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

const NoAccess: React.FC<{}> = () => {
  const { formatMessage } = useIntl();

  return (
    <Popover
      content={<p>{formatMessage({ id: 'project.public.permission', defaultMessage: '暂无权限, 请与管理员联系' })}</p>}>
      <StopOutlined style={{ padding: '5px', color: 'red' }} />
    </Popover>
  )
}

export default NoAccess
