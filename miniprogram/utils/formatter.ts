// utils/formatter.ts

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date | string, format = 'YYYY-MM-DD HH:mm'): string {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else {
    return formatDateTime(d, 'YYYY-MM-DD');
  }
}

/**
 * 格式化费用
 */
export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) {
    return '免费';
  }
  return `¥${price.toFixed(2)}`;
}

/**
 * 格式化圈子类型
 */
export function formatCircleType(type: number): string {
  const types: Record<number, string> = {
    1: '企业通勤',
    2: '小区邻居',
    3: '校友群',
    4: '团建活动',
    5: '其他',
  };
  return types[type] || '其他';
}

/**
 * 格式化行程状态
 */
export function formatTripStatus(status: number): string {
  const statusMap: Record<number, string> = {
    1: '招募中',
    2: '已满员',
    3: '进行中',
    4: '已完成',
    5: '已取消',
  };
  return statusMap[status] || '未知';
}

/**
 * 格式化预约状态
 */
export function formatBookingStatus(status: number): string {
  const statusMap: Record<number, string> = {
    0: '待确认',
    1: '已确认',
    2: '已完成',
    3: '已取消',
    4: '已拒绝',
    5: '已爽约',
  };
  return statusMap[status] || '未知';
}

/**
 * 格式化费用模式
 */
export function formatFeeMode(mode: number): string {
  const modeMap: Record<number, string> = {
    1: '免费互助',
    2: 'AA 分摊',
    3: '付费搭乘',
  };
  return modeMap[mode] || '未知';
}

/**
 * 格式化距离
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 评分转星星
 */
export function ratingToStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
