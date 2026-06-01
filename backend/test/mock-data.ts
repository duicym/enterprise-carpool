export const MOCK_USER = {
  id: 1,
  openid: 'test_openid_123',
  nickname: 'Test User',
  avatarUrl: 'https://example.com/avatar.png',
  phone: '13800138000',
  gender: 1,
  creditScore: 100,
};

export const MOCK_CIRCLE = {
  id: 1,
  name: '测试圈子',
  type: 1,
  description: '测试描述',
  ownerId: 1,
  memberCount: 1,
  maxMembers: 500,
  isPublic: 1,
  status: 1,
};

export const MOCK_TRIP = {
  id: 1,
  circleId: 1,
  driverId: 1,
  startAddress: '起点地址',
  startLatitude: 30.57281234,
  startLongitude: 120.12345678,
  endAddress: '终点地址',
  endLatitude: 30.67281234,
  endLongitude: 120.22345678,
  departureTime: new Date('2024-06-02 08:30:00'),
  seatCount: 4,
  availableSeats: 3,
  feeMode: 1,
  status: 1,
};

export const MOCK_BOOKING = {
  id: 1,
  tripId: 1,
  driverId: 1,
  passengerId: 2,
  seatsBooked: 1,
  feeAmount: null,
  status: 1,
};

export const MOCK_EVENT = {
  id: 1,
  circleId: 1,
  organizerId: 1,
  title: '团建活动',
  startTime: new Date('2024-06-15 10:00:00'),
  locationAddress: '活动地点',
  locationLatitude: 30.57281234,
  locationLongitude: 120.12345678,
  totalParticipants: 0,
  driversCount: 0,
  passengersCount: 0,
  allocationStatus: 0,
};
