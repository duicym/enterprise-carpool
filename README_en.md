<p align="center">
  <h1 align="center">🚗 Ceng-Carpool</h1>
  <p align="center">
    Acquaintance Social Mutual-Aid Travel Platform
  </p>
  <p align="center">
    Breaking the cold commute, making every trip warmer and more trustworthy! 🌟
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-WeChat-07C160?logo=wechat&logoColor=white" alt="Platform">
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white" alt="Backend">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="Database">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <strong>English</strong> · 
  <a href="README.md"><strong>简体中文</strong></a>
</p>

---

## 📖 Introduction

**Ceng-Carpool** is a mutual-aid carpooling WeChat Mini Program designed for private acquaintance circles such as corporate employees, closed communities, and university alumni. Instead of blindly pursuing a large-scale commercial ride-hailing model, we focus on building a **"high-trust, low-cost, zero-operational-risk"** acquaintance social travel ecosystem.

> 💡 Unlike commercial ride-hailing services like Didi, Ceng-Carpool focuses on **mutual assistance within trusted circles**, making every ride between colleagues, neighbors, and alumni warmer and more reliable.

### 🎯 Core Scenarios

| Scenario | Description | Example |
|----------|-------------|---------|
| 🏢 **Workplace Commute** | Colleagues carpooling to work | "Engineer Zhang drives from Tech Park daily, can take 2 colleagues" |
| 🎉 **Team Events** | Smart vehicle allocation for team activities | "15 people for team building, 5 drivers provide seats, 2 others suggested to take taxi" |
| 🏘️ **Community Ride** | Neighborhood/alumni carpooling | "Morning commute carpool group from XX Community to metro station" |

---

## ✨ Key Features

### 🤝 No Circle, No Carpool

Unique **"Circle Owner Management + Member Review"** mechanism. All visible trips are within acquaintance circles, naturally filtering out safety hazards!

- ✅ Only circle members can view and publish trips
- ✅ Circle owners and admins review new member applications
- ✅ Credit score + dual review system makes reliable people more popular

### 🧠 Smart Event Vehicle Allocator

**A blessing for administrators!** Input destination, drivers, and seat counts, and the system automatically calculates the optimal vehicle allocation plan and seat combinations.

- ✅ Smart allocation algorithm: Priority for same department and nearby pickup points
- ✅ Automatic taxi suggestions for remaining passengers (calculated at 4 people/car)
- ✅ One-click view allocation results and contact drivers

### 💰 Flexible Payment Options

Supports **free mutual aid**, **AA cost-sharing**, and **micro-profit paid rides**, with strict pricing caps for legal compliance.

| Mode | Scenario | Cost Calculation |
|------|----------|------------------|
| 🆓 Free Mutual Aid | Colleague favors, neighborhood mutual aid | ¥0 |
| 🧮 AA Cost-Sharing | Long-distance trips, toll sharing | (Fuel + Tolls) ÷ Number of Passengers |
| 💵 Paid Rides | Fixed commute routes, micro-profit operations | Driver-defined (platform capped) |

### ⚡ Minimalist Architecture

Backend uses lightweight high-performance **NestJS**, frontend paired with **native WeChat Mini Program**, supports flexible SQLite/MySQL switching, one-click script for instant deployment!

---

## 🛠️ Tech Stack & Features

### Tech Stack

**Backend**

[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-07405E?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Redis](https://img.shields.io/badge/Redis-6-DC382D?logo=redis&logoColor=white)](https://redis.io/)

**Frontend**

[![WeChat](https://img.shields.io/badge/WeChat_MiniProgram-Latest-07C160?logo=wechat&logoColor=white)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Tools & Services**

- 🔐 JWT Authentication
- 📄 Swagger API Documentation
- ☁️ Tencent Cloud COS File Storage
- 🐳 Docker Containerization

### Core Features

#### 🛡️ Security Guard
- JWT authentication + circle review, building a safety wall
- Trips visible only within circles, inaccessible from outside
- Credit score system + two-way reviews, establishing trust mechanisms

#### 📊 Data Transparency
- Built-in Swagger API interactive documentation
- Complete definition of 8 core data tables
- Clear architecture, extremely smooth for secondary development

#### 📦 Out-of-the-Box
- Provides `start.sh` startup script
- SQLite development mode, no database installation required
- R&D costs reduced to zero!

---

## 🚀 Quick Start

### Option 1: Local Development (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd ceng-carpool

# 2. Start backend (SQLite mode, no Docker required)
cd backend
npm install
cp .env.example .env  # Set DB_TYPE=sqlite
npm run start:dev

# 3. Mini-program frontend
# Open miniprogram/ directory in WeChat DevTools
# Modify apiBaseUrl in app.ts to http://localhost:3000/api
```

Access Swagger docs: http://localhost:3000/api/docs

### Option 2: Production Environment (MySQL + Redis)

```bash
cd backend

# 1. Start database and Redis
docker-compose up -d

# 2. Configure environment variables
cp .env.example .env
# Edit .env, set DB_TYPE=mysql, fill in database connection info

# 3. Run database migrations
npm run migration:run

# 4. Start server
npm run start:dev
```

For detailed deployment instructions, see [QUICKSTART.md](QUICKSTART.md)

---

## 📁 Project Structure

```
ceng-carpool/
├── backend/                  # NestJS backend service
│   ├── src/
│   │   ├── modules/         # Business modules
│   │   │   ├── auth/        # WeChat authentication
│   │   │   ├── user/        # User management
│   │   │   ├── circle/      # Circle management ⭐
│   │   │   ├── trip/        # Trip management ⭐
│   │   │   ├── booking/     # Booking management ⭐
│   │   │   ├── event/       # Team events ⭐
│   │   │   └── ...
│   │   ├── guards/          # JWT guard
│   │   └── common/          # Global filters
│   └── package.json
├── miniprogram/              # WeChat mini-program frontend
│   ├── pages/               # Pages
│   ├── utils/               # Utilities
│   └── app.ts               # App configuration
├── .monkeycode/             # Project documentation
│   ├── docs/                # Wiki docs
│   └── specs/               # Specifications
├── start.sh                 # One-click startup script
└── README.md
```

---

## 📊 Data Models

| Table | Description | Key Fields |
|-------|-------------|------------|
| `user` | User table | openid, nickname, credit_score |
| `circle` | Circle table | name, type, owner_id, member_count |
| `circle_member` | Circle members | circle_id, user_id, role, status |
| `trip` | Trip table | driver_id, start/end, seats, fee_mode |
| `booking` | Booking table | trip_id, passenger_id, status, fee_amount |
| `event` | Event table | title, location, start_time, allocation_status |
| `event_participant` | Event participants | event_id, user_id, role, seats_offered |

---

## 🔗 API Endpoints

| Module | Path Prefix | Key Endpoints |
|--------|-------------|---------------|
| Auth | `/api/auth` | WeChat login, user info |
| Circle | `/api/circle` | Create/Join/Manage circles, member management |
| Trip | `/api/trip` | Publish trips, search & filter, seat management |
| Booking | `/api/booking` | Create booking, confirm/cancel, complete trip |
| Event | `/api/event` | Create events, join, **smart vehicle allocation** |

Full API documentation: http://localhost:3000/api/docs

---

## 📚 Documentation

### Wiki Docs
- [📖 Wiki Home](.monkeycode/docs/wiki.md) - Documentation navigation
- [🏗️ Architecture](.monkeycode/docs/architecture.md) - Technical architecture and module design
- [📊 Data Models](.monkeycode/docs/data-model.md) - Database schema documentation
- [🛠️ Development Guide](.monkeycode/docs/development-guide.md) - Local development and coding standards

### Product Docs
- [📋 Requirements](.monkeycode/specs/ceng-carpool/requirements.md) - Product requirements
- [⚙️ Technical Design](.monkeycode/specs/ceng-carpool/design.md) - Detailed technical design

### Other Docs
- [🚀 Quick Start](QUICKSTART.md) - Detailed installation and deployment guide
- [🤝 Contributing](CONTRIBUTING.md) - How to contribute to the project
- [📜 Code of Conduct](CODE_OF_CONDUCT.md) - Community code of conduct
- [📝 Changelog](CHANGELOG.md) - Version history

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

<p align="center">
  🌟 Connecting trust with code, warming commutes with technology
</p>

<p align="center">
  If this project inspires you, please give us a <strong>Star</strong>! 😉
</p>

<p align="center">
  Made with ❤️ by Ceng-Carpool Team
</p>
