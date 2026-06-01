# 性能测试脚本

## 1. API 性能测试 (使用 Artillery)

### 安装 Artillery
```bash
npm install -g artillery
```

### 运行负载测试
```bash
# 基础负载测试 (100 并发，持续 60 秒)
artillery run --output ./performance-report.json test/performance/load-test.yml

# 压力测试 (500 并发，持续 120 秒)
artillery run --output ./stress-report.json test/performance/stress-test.yml
```

## 2. 数据库查询性能

### 使用 TypeORM 查询分析
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- 分析慢查询
SELECT * FROM mysql.slow_log;
```

### Redis 缓存命中率检查
```bash
# 查看 Redis 命中率
redis-cli info stats | grep hit
redis-cli info keyspace
```

## 3. 优化建议

### 数据库索引优化
- `user`: openid, phone 已建立唯一索引 ✓
- `circle`: owner_id, is_public, status 已建立索引 ✓
- `circle_member`: circle_id, user_id, status 已建立索引 ✓
- `trip`: circle_id, driver_id, status, departure_time 已建立索引 ✓
- `booking`: trip_id, driver_id, passenger_id, status 已建立索引 ✓
- `event`: circle_id, organizer_id, start_time 已建立索引 ✓

### Redis 缓存策略
1. 用户信息缓存：用户详情，信用分，评价统计
2. 圈子信息缓存：圈子详情，成员统计
3. 行程信息缓存：热门路线，推荐行程
4. 通知计数缓存：未读通知数量

### 代码优化
1. 使用 TypeORM 的 QueryBuilder 替代复杂关联查询
2. 使用缓存减少数据库访问
3. 批量操作替代循环单条查询
4. 使用流式响应处理大数据集
