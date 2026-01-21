# Lost & Listed

A modern, full-stack campus community platform for lost & found items, affordable deals, and student exchanges.

---

## 🚀 Features

- **Lost & Found:** Report, search, and claim lost or found items on campus.
- **Marketplace:** Buy, sell, and exchange products with other students.
- **Live Activity Ticker:** Real-time updates of recent activities.
- **Mobile-First Design:** Fully responsive, beautiful UI for all devices.
- **Authentication:** Secure signup, login, and password recovery.
- **Notifications:** Stay updated with the latest campus activities.
- **Admin Tools:** Manage users, items, and platform content.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Redux
- **Backend:** Node.js, Express, MongoDB
- **Other:** Cloudinary (image uploads), JWT Auth, Email Service

---

## 📦 Project Structure

```
Lost_and_Listed/
  ├── src/
  │   ├── components/         # Reusable UI components
  │   ├── pages/              # Main app pages (Home, Auth, Marketplace, etc.)
  │   ├── hooks/              # Custom React hooks
  │   ├── redux/              # Redux slices and store
  │   ├── config/             # API configs
  │   └── ...
  ├── public/                 # Static assets
  ├── package.json            # Frontend dependencies
  └── ...
Backend/
  ├── src/
  │   ├── controllers/        # Express route controllers
  │   ├── models/             # Mongoose models
  │   ├── routes/             # API routes
  │   ├── middlewares/        # Auth, file upload, etc.
  │   └── ...
  ├── package.json            # Backend dependencies
  └── ...
```

---

## 🖥️ Local Development

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd FSD_Project
```

### 2. Install dependencies
```bash
cd Backend
npm install
cd ../Lost_and_Listed
npm install
```

### 3. Set up environment variables
- Copy `.env.example` to `.env` in both `Backend/` and `Lost_and_Listed/` folders and fill in required values.

### 4. Start the backend server
```bash
cd Backend
npm run dev
```

### 5. Start the frontend app
```bash
cd ../Lost_and_Listed
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements
- Inspired by campus needs for a unified lost & found and student marketplace.
- Built with ❤️ by the Lost & Listed team.
