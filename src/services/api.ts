import { request } from 'umi';

/// ------登录管理------- ///
export async function postLogin(params: {
  username: string,
  password: string,
}) {
  return request('/user/login', {
    method: 'POST',
    data: {
      username: params.username,
      password: params.password,
      // auth: 1
    },
  });
}

export async function postLogout() {
  return request('/user/logout', {
    method: 'POST',
  });
}

export async function getUserInfo() {
  return request('/user/info', {
    method: 'GET',
  });
}

/// ------用户管理------- ///
export async function modifyPassWord(params: {
  password: string,
  old_password: string,
}) {
  return request('/user/password', {
    method: 'PUT',
    data: {
      password: params.password,
      old_password: params.old_password,
    },
  });
}

export async function modifyUserInfo(params: any) {
  return request('/user/edit', {
    method: 'PUT',
    data: params,
  });
}

/// ------分类管理------- ///
export async function getGoodsCate(params: any) {
  return request('/goods/cate/all', {
    method: 'GET',
    params,
  });
}

/// ------商品管理------- ///
export async function getGoodsData(params: any) {
  return request('/goods', {
    method: 'GET',
    params,
  });
}

// 商品详细信息翻译字典
export async function getTranslateList(params: any) {
  return request('/translate/dict', {
    method: 'GET',
    params,
  });
}

// 商品名字输入联想
export async function getGoodsName(params: any) {
  return request('/goods/keyword', {
    method: 'GET',
    params,
  });
}

/// ------活动管理------- ///
export async function getEventList(params: any) {
  return request('/event/list', {
    method: 'GET',
    params,
  });
}

export async function getAllEvent() {
  return request('/event/admin/all', {
    method: 'GET',
  });
}

/// ------竞价管理------- ///
export async function getUserBidList(params: any) {
  return request('/user_bid', {
    method: 'GET',
    params,
  });
}

export async function postUserBid(params: {
  event_id: number,
  goods_id: number,
  bid: number,
  currency: string,
}) {
  return request('/user_bid', {
    method: 'POST',
    data: {
      event_id: params.event_id,
      goods_id: params.goods_id,
      bid: params.bid,
      currency: params.currency
    },
  });
}

export async function getBidRule(params: any) {
  return request('/bid_rule/rule', {
    method: 'GET',
    params,
  });
}

// 我的商品出价
export async function getMyBid(params: any) {
  return request('/goods/my_price', {
    method: 'POST',
    data: params,
  });
}

/// ------收藏管理------- ///
export async function getCollectionList(params: any) {
  return request('/user_collection', {
    method: 'GET',
    params,
  });
}

export async function postCollection(params: any) {
  return request('/user_collection', {
    method: 'POST',
    data: params,
  });
}

export async function deleteCollection(params: any) {
  return request('/user_collection', {
    method: 'DELETE',
    data: params,
  });
}

export async function getCategoryCollectionList(params: any) {
  return request('/user_collection/category', {
    method: 'GET',
    params,
  });
}

export async function getCategoryCollectionGoodsList(params: any) {
  return request('/user_collection/category/goods', {
    method: 'GET',
    params,
  });
}

/// ------个人信息------- ///
export async function getRecord() {
  return request('/user/count/my_record', {
    method: 'GET'
  });
}

/// ------热门推荐------- ///
export async function getRecommend(params: any) {
  return request('/goods/recommend', {
    method: 'GET',
    params
  });
}

/// ------汇率信息------- ///
export async function getExchangeRate(params: any) {
  return request('/exchange_rate', {
    method: 'GET',
    params
  });
}

/// ------品牌信息------- ///
export async function getBrand(params: any) {
  return request('/cate/brand', {
    method: 'GET',
    params
  });
}

/// ------品牌信息------- ///
export async function getUserIp() {
  return request('/user/ip', {
    method: 'GET',
  });
}
