// utils/request.ts

const app = getApp<any>();

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: any;
  needAuth?: boolean;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 统一请求封装
 */
export function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    needAuth = true,
  } = options;

  return new Promise((resolve, reject) => {
    // 添加认证头
    if (needAuth && app.globalData.token) {
      header.Authorization = `Bearer ${app.globalData.token}`;
    }

    wx.request({
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token 过期或无效，跳转登录
          wx.removeStorageSync('token');
          app.globalData.token = null;
          wx.redirectTo({ url: '/pages/login/login' });
          reject(new Error('未授权'));
        } else {
          wx.showToast({
            title: res.data?.message || '请求失败',
            icon: 'none',
          });
          reject(new Error(res.data?.message || '请求失败'));
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
        });
        reject(err);
      },
    });
  });
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'GET', data });
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'POST', data });
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'PUT', data });
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'DELETE' });
}

// API 接口封装
export const api = {
  // 认证
  auth: {
    login: (code: string) => post('/auth/wechat-login', { code }),
    logout: () => post('/auth/logout'),
    profile: () => get('/auth/profile'),
  },

  // 圈子
  circle: {
    create: (data: any) => post('/circle', data),
    my: () => get('/circle/my'),
    search: (params: any) => get('/circle/search', params),
    detail: (id: number) => get(`/circle/${id}`),
    update: (id: number, data: any) => put(`/circle/${id}`, data),
    delete: (id: number) => del(`/circle/${id}`),
    join: (id: number, data: any) => post(`/circle/${id}/join`, data),
    members: (id: number) => get(`/circle/${id}/members`),
    leave: (id: number) => post(`/circle/${id}/leave`),
  },

  // 行程
  trip: {
    create: (circleId: number, data: any) => post(`/trip/${circleId}`, data),
    list: (circleId: number, params?: any) => get(`/trip/circle/${circleId}`, params),
    detail: (id: number) => get(`/trip/${id}`),
    myDriving: () => get('/trip/my/driving'),
    update: (id: number, data: any) => put(`/trip/${id}`, data),
    cancel: (id: number) => post(`/trip/${id}/cancel`),
  },

  // 预约
  booking: {
    create: (tripId: number, data: any) => post(`/booking/${tripId}`, data),
    confirm: (id: number) => post(`/booking/${id}/confirm`),
    cancel: (id: number, data: any) => post(`/booking/${id}/cancel`, data),
    reject: (id: number, data: any) => post(`/booking/${id}/reject`, data),
    complete: (id: number) => post(`/booking/${id}/complete`),
    my: (params?: any) => get('/booking/my', params),
    detail: (id: number) => get(`/booking/${id}`),
    byTrip: (tripId: number) => get(`/booking/trip/${tripId}`),
  },

  // 活动
  event: {
    create: (circleId: number, data: any) => post(`/event/${circleId}`, data),
    list: (circleId: number) => get(`/event/circle/${circleId}`),
    detail: (id: number) => get(`/event/${id}`),
    update: (id: number, data: any) => put(`/event/${id}`, data),
    delete: (id: number) => del(`/event/${id}`),
    join: (id: number, data: any) => post(`/event/${id}/join`, data),
    leave: (id: number) => post(`/event/${id}/leave`),
    allocate: (id: number) => post(`/event/${id}/allocate`),
    allocationResult: (id: number) => get(`/event/${id}/allocation`),
    participants: (id: number) => get(`/event/${id}/participants`),
  },

  // 评价
  review: {
    create: (bookingId: number, data: any) => post(`/review/${bookingId}`, data),
    myReceived: (params?: any) => get('/review/my/received', params),
    myGiven: (params?: any) => get('/review/my/given', params),
    userStats: (userId: number) => get(`/review/user/${userId}/stats`),
    getByBooking: (bookingId: number) => get(`/review/booking/${bookingId}`),
  },

  // 通知
  notification: {
    list: (params?: any) => get('/notification', params),
    count: () => get('/notification/count'),
    markRead: (ids: number[]) => post('/notification/mark-read', { ids }),
    markAllRead: () => post('/notification/mark-all-read'),
    delete: (id: number) => del(`/notification/${id}`),
  },
};
