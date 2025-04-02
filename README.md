# Charcoal Backend

This is the backend for the Charcoal application. It provides APIs for user management, daily rewards, upgrades, potion settings, slot machine gameplay, and tasks.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Global Settings Routes](#global-settings-routes)
  - [Upgrades Routes](#upgrades-routes)
  - [Potion Settings Routes](#potion-settings-routes)
  - [Farm Routes](#farm-routes)
  - [Slot Machine Routes](#slot-machine-routes)
  - [Tasks Routes](#tasks-routes)

---

## Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run start:dev
   ```

4. Build and start the production server:

   ```bash
   npm run start
   ```

---

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

---

## API Endpoints

### User Routes

Base URL: `/api/v1`

| Method | Endpoint     | Description               | Middleware       |
| ------ | ------------ | ------------------------- | ---------------- |
| POST   | `/users`     | Create a new user         | None             |
| GET    | `/users`     | Get all users             | None             |
| POST   | `/login`     | Login a user              | None             |
| GET    | `/users/:id` | Get a specific user by ID | `authMiddleware` |

---

### Global Settings Routes

Base URL: `/api/v1`

| Method | Endpoint              | Description         | Middleware       |
| ------ | --------------------- | ------------------- | ---------------- |
| GET    | `/globalsettings/:id` | Get global settings | `authMiddleware` |

---

### Upgrades Routes

Base URL: `/api/v1/purchase`

| Method | Endpoint        | Description                | Middleware       |
| ------ | --------------- | -------------------------- | ---------------- |
| POST   | `/:id/:upgrade` | Upgrade a specific feature | `authMiddleware` |

---

### Potion Settings Routes

Base URL: `/api/v1/potionsetting`

| Method | Endpoint                     | Description                  | Middleware       |
| ------ | ---------------------------- | ---------------------------- | ---------------- |
| GET    | `/:id`                       | Get all potion cards         | `authMiddleware` |
| POST   | `/buyandupgrade/:id/:cardId` | Buy or upgrade a potion card | `authMiddleware` |
| GET    | `/lvl/:id`                   | Get user level               | `authMiddleware` |

---

### Farm Routes

Base URL: `/api/v1/farm`

| Method | Endpoint                  | Description                | Middleware       |
| ------ | ------------------------- | -------------------------- | ---------------- |
| POST   | `/claimdailyreward/:id`   | Claim daily rewards        | `authMiddleware` |
| GET    | `/getdailyrewarddata/:id` | Get daily reward data      | `authMiddleware` |
| POST   | `/tap/:id`                | Perform a multi-tap action | `authMiddleware` |
| POST   | `/refill/:id`             | Refill energy              | None             |
| POST   | `/turbo/:id`              | Start charcoal turbo       | `authMiddleware` |
| POST   | `/rechargeturbo/:id`      | Recharge charcoal turbo    | `authMiddleware` |

---

### Slot Machine Routes

Base URL: `/api/v1`

| Method | Endpoint               | Description           | Middleware       |
| ------ | ---------------------- | --------------------- | ---------------- |
| POST   | `/playslotmachine/:id` | Play the slot machine | `authMiddleware` |

---

### Tasks Routes

Base URL: `/api/v1/tasks`

| Method | Endpoint       | Description                    | Middleware       |
| ------ | -------------- | ------------------------------ | ---------------- |
| GET    | `/:id`         | Get all tasks                  | `authMiddleware` |
| POST   | `/:id/:taskId` | Complete a specific task       | `authMiddleware` |
| GET    | `/:id/:taskId` | Get details of a specific task | `authMiddleware` |
