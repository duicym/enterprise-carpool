/**
 * 统一 API 请求封装
 * - 自动注入 Token
 * - 统一错误处理
 * - 支持 loading 状态
 */

const app = getApp();

function getBaseUrl() {
  return app.globalData.apiBaseUrl || '';
}

function getToken() {
  return app.globalData.token || wx.getStorageSync('token') || '';
}

/**
 * 统一请求方法
 * @param {Object} options
 * @param {string} options.url - 请求路径（不含 baseUrl）
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {boolean} [options.showLoading=false] - 是否显示 loading
 * @param {string} [options.loadingText='加载中...'] - loading 文案
 * @param {boolean} [options.silent=false] - 静默模式（不弹出错误提示）
 * @returns {Promise<Object>} 响应数据
 */
function request({ url, method = 'GET', data, showLoading = false, loadingText = '加载中...', silent = false }) {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({ title: loadingText, mask: true });
    }

    const token = getToken();
    const header = {
      'Content-Type': 'application/json',
    };
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }

    wx.request({
      url: `${getBaseUrl()}${url}`,
      method,
      data,
      header,
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }

        // HTTP 状态码非 200
        if (res.statusCode !== 200) {
          if (!silent) {
            wx.showToast({
              title: `请求失败 (${res.statusCode})`,
              icon: 'none',
              duration: 2000,
            });
          }
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const responseData = res.data;

        // 业务状态码非 0
        if (responseData.code !== 0) {
          // 401 未授权，跳转登录
          if (responseData.code === 401) {
            wx.removeStorageSync('token');
            app.globalData.token = null;
            if (!silent) {
              wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000,
              });
            }
            reject(new Error('Unauthorized'));
            return;
          }

          if (!silent) {
            wx.showToast({
              title: responseData.message || '请求失败',
              icon: 'none',
              duration: 2000,
            });
          }
          reject(new Error(responseData.message || 'Business Error'));
          return;
        }

        resolve(responseData);
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }

        if (!silent) {
          wx.showToast({
            title: '网络错误，请检查网络连接',
            icon: 'none',
            duration: 2000,
          });
        }
        reject(err);
      },
    });
  });
}

/**
 * 文件上传方法
 * @param {Object} options
 * @param {string} options.url - 上传路径
 * @param {string} options.filePath - 文件路径
 * @param {string} [options.name='file'] - 文件字段名
 * @param {Object} [options.formData] - 额外的表单数据
 * @param {boolean} [options.showLoading=true] - 是否显示 loading
 * @param {string} [options.loadingText='上传中...'] - loading 文案
 * @returns {Promise<Object>} 响应数据
 */
function uploadFile({ url, filePath, name = 'file', formData, showLoading = true, loadingText = '上传中...' }) {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({ title: loadingText, mask: true });
    }

    const token = getToken();
    const header = {};
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }

    wx.uploadFile({
      url: `${getBaseUrl()}${url}`,
      filePath,
      name,
      formData,
      header,
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }

        if (res.statusCode !== 200) {
          wx.showToast({
            title: `上传失败 (${res.statusCode})`,
            icon: 'none',
            duration: 2000,
          });
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        let data;
        try {
          data = JSON.parse(res.data);
        } catch (e) {
          reject(new Error('解析响应失败'));
          return;
        }

        if (data.code !== 0) {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none',
            duration: 2000,
          });
          reject(new Error(data.message || 'Upload Error'));
          return;
        }

        resolve(data);
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }

        wx.showToast({
          title: '网络错误，上传失败',
          icon: 'none',
          duration: 2000,
        });
        reject(err);
      },
    });
  });
}

module.exports = {
  request,
  get: (url, data, options = {}) => request({ url, method: 'GET', data, ...options }),
  post: (url, data, options = {}) => request({ url, method: 'POST', data, ...options }),
  put: (url, data, options = {}) => request({ url, method: 'PUT', data, ...options }),
  del: (url, data, options = {}) => request({ url, method: 'DELETE', data, ...options }),
  uploadFile,
};
