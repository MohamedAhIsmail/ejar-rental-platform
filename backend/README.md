# 🔧 Ejar Rental Platform – Backend API (Node.js)

This is the backend API for **Ejar Rental Platform**, a rental platform where users can rent out or borrow items from other users.

The backend is built with **Node.js + Express**, uses **MongoDB** for data storage, and supports features like authentication, file uploads, and real-time communication via Socket.IO.

It was developed as part of the **ITI Graduation Project (2025)** during the **ITI ICC Training**.

---

## 📦 Main Features

- 🔐 JWT-based Authentication (login/register)
- 🧾 Validation with Joi
- 🧑‍🤝‍🧑 Role-based access control (users, admins)
- ☁️ File uploads to **Cloudinary** via **Multer**
- 📬 Email integration using **Nodemailer**
- 🧠 Realtime communication with **Socket.IO**
- 🌍 CORS support for frontend integration
- 🗄️ MongoDB + Mongoose data modeling

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Multer** + **Cloudinary** for file/image handling
- **Socket.IO** for real-time chat
- **Nodemailer** for emails
- **Joi** for data validation
- **dotenv**, **cors**, and other utilities

> See `package.json` for full list of dependencies.

## 🗂️ Folder Structure

```

ejar-rental-platform-node/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── index.js
└── .env

```

---

## 🔄 Project Origin

This repository is a clean version extracted from the original team repository that contains the full commit history of the collaboration.

👉 [Original Team Repository](https://github.com/malikhussein/ITI-node-ejar-project)

---

## 👥 Our Team

| Name          | GitHub Profile                                         |
| ------------- | ------------------------------------------------------ |
| Mohamed Ahmed | [@MohamedAhIsmail](https://github.com/MohamedAhIsmail) |
| Malik Hussein | [@malikhussein](https://github.com/malikhussein)       |
| Ahmed Amr     | [@ahmedamr3000](https://github.com/ahmedamr3000)       |
| Mohamed Eid   | [@Mohamedeid602](https://github.com/Mohamedeid602)     |
| Omar Abdeen   | [@OmarAbdeen](https://github.com/Test0-VC)             |

---

## 🔗 Part of a Rental Platform Project

This backend powers the full **Ejar Rental Platform**, which includes:

- 🛒 **Customer Website** → React frontend for users to browse, rent, and list items
- 🧑‍💼 Admin Dashboard → Angular 19

👉 [View the Full Project Repository](https://github.com/MohamedAhIsmail/ejar-rental-platform)

---

## 🌐 .env File Example env Copy Edit

```

PORT=3000

MONGO_URI=
SALT_ROUND = 10
SEND_EMAIL_ADDRESS = 
SEND_EMAIL_PASSWORD = 
TOKEN_SECRET_KEY = 
CONFIRM_EMAIL_TOKEN=
RESET_PASSWORD_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

```

## ⚙️ Getting Started

```bash
# Clone the repository
git clone https://github.com/MohamedAhIsmail/ejar-rental-platform-node.git

# Navigate into the project folder
cd ejar-rental-platform-node

# Install dependencies
npm install

# Create .env file and add your environment variables
touch .env

# Start the server (dev mode)
npm start
