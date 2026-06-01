module.exports = {
  config: {
    target: 'http://localhost:3000',
    phases: [
      {
        duration: 60,
        arrivalCount: 100,
      },
    ],
    defaults: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  },
  scenarios: [
    {
      name: 'API 负载测试',
      requests: [
        {
          get: {
            url: '/circle/my',
          },
        },
        {
          get: {
            url: '/booking/my',
          },
        },
        {
          get: {
            url: '/trip/my/driving',
          },
        },
      ],
    },
  ],
};
