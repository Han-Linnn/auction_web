declare namespace API {
  export interface CurrentUser {
    id?: string;
    username?: string;
    avatar?: string;
    active: boolean;
    auth: number; //1：普通用户, 2:管理员
    create_time: string;
    update_time: string;
    email: string;
    moblie: string;
    extend: string;

    // title?: string;
    // group?: string;
    // signature?: string;
    // tags?: {
    //   key: string;
    //   label: string;
    // }[];
    // access?: 'user' | 'guest' | 'admin';
    // unreadCount?: number;
  }

  // export interface LoginStateType {
  //   status?: 'ok' | 'error';
  //   type?: string;
  // }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
  export interface BidData {
    event_id: number,
    goods_id: number,
    goods_name: string,
    goods_img: string,
    start_price: number,
    last_price: number,
    minBidPrice: number,
    bidPriceUnit: number
  }
}
