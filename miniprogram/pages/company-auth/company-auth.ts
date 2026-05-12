const api = require('../../utils/api');

Page({
  data: {
    companyName: '',
    companyList: [],
    showCompanyList: false,
    employeeId: '',
    certificateUrl: '',
    submitting: false,
    authStatus: null, // 0: 审核中, 1: 已认证, 2: 已拒绝
    authRemark: '',
  },

  onLoad() {
    this.checkAuthStatus();
  },

  // 检查认证状态
  async checkAuthStatus() {
    try {
      const res = await api.get('/company/my', {}, { silent: true });
      if (res.data && res.data.userCompanies && res.data.userCompanies.length > 0) {
        const uc = res.data.userCompanies[0];
        this.setData({
          authStatus: uc.audit_status,
          companyName: uc.company.name,
          employeeId: uc.employee_id || '',
          authRemark: uc.audit_remark || '',
        });
      }
    } catch (error) {
      // 没有认证信息，正常
    }
  },

  onCompanyNameInput(e) {
    this.setData({ companyName: e.detail.value });
    // 模糊搜索公司
    if (e.detail.value.length >= 2) {
      this.searchCompany(e.detail.value);
    }
  },

  async searchCompany(keyword) {
    try {
      const res = await api.get('/company/search', { keyword }, { silent: true });
      this.setData({
        companyList: res.data.items || [],
        showCompanyList: true,
      });
    } catch (error) {
      // 搜索失败，忽略
    }
  },

  selectCompany(e) {
    const company = e.currentTarget.dataset.item;
    this.setData({
      companyName: company.name,
      showCompanyList: false,
      companyList: [],
    });
  },

  closeCompanyList() {
    this.setData({ showCompanyList: false, companyList: [] });
  },

  onEmployeeIdInput(e) {
    this.setData({ employeeId: e.detail.value });
  },

  async uploadCertificate() {
    try {
      // 选择图片
      const chooseRes = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
      });

      const tempFilePath = chooseRes.tempFiles[0].tempFilePath;

      // 上传图片
      const res = await api.uploadFile({
        url: '/admin/certificate/upload',
        filePath: tempFilePath,
      });

      this.setData({
        certificateUrl: res.data.url,
      });

      wx.showToast({
        title: '上传成功',
        icon: 'success',
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  },

  async handleSubmit() {
    const { companyName, employeeId, certificateUrl, submitting } = this.data;

    if (submitting) return;

    if (!companyName.trim()) {
      wx.showToast({ title: '请输入企业名称', icon: 'none' });
      return;
    }

    if (!certificateUrl) {
      wx.showToast({ title: '请上传在职证明', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      await api.post('/company/submit', {
        name: companyName.trim(),
        employee_id: employeeId.trim() || undefined,
        certificate_url: certificateUrl,
      });

      wx.showModal({
        title: '提交成功',
        content: '您的认证申请已提交，请耐心等待审核。审核结果将通过消息通知您。',
        showCancel: false,
        success: () => {
          wx.switchTab({ url: '/pages/index/index' });
        },
      });
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      this.setData({ submitting: false });
    }
  },

  // 重新提交（被拒绝后）
  handleResubmit() {
    this.setData({
      authStatus: null,
      certificateUrl: '',
      employeeId: '',
    });
  },
});
