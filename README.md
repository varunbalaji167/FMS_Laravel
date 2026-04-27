<div align="center">

<img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo"/>

# 🎓 Faculty Management System

**A comprehensive web application to manage faculty records, attendance, leaves, and departmental operations — built with Laravel, React (Inertia.js), and Tailwind CSS.**

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![Build Status](https://img.shields.io/github/actions/workflow/status/varunbalaji167/FMS_Laravel/tests.yml?branch=main&style=for-the-badge)](https://github.com/varunbalaji167/FMS_Laravel/actions)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure) • [Contributing](#-contributing)

</div>

---

## 📌 About the Project

The **Faculty Management System (FMS)** is a full-stack web application designed for educational institutions to efficiently manage their faculty workforce. It provides a centralized platform for tracking faculty profiles, managing departmental assignments, handling leave requests, monitoring attendance, and generating insightful reports — all within a clean, modern interface.

> 🔗 **Related Project:** [Faculty Recruitment System (FRS)](https://github.com/varunbalaji167/FRS_Laravel) — handles the end-to-end hiring pipeline for new faculty.

---

## ✨ Features

### 👤 Faculty Management
- Add, view, edit, and deactivate faculty profiles
- Upload and manage faculty documents (CV, certificates, ID proofs)
- Track personal details, qualifications, and specializations
- Assign faculty to departments and courses

### 🏛️ Department Management
- Create and manage academic departments
- Assign HODs (Heads of Department)
- Track department-wise faculty headcount and workload

### 📅 Attendance Tracking
- Mark and monitor daily faculty attendance
- View attendance history with filters by date, department, or faculty
- Export attendance reports in CSV/PDF format

### 🗓️ Leave Management
- Faculty can submit leave requests with type and reason
- Admin/HOD can approve or reject leave applications
- Dashboard summary of pending, approved, and rejected leaves
- Leave balance tracking per faculty

### 📊 Dashboard & Reports
- Admin dashboard with real-time statistics
- Department-wise faculty distribution charts
- Leave utilization and attendance summary reports
- Exportable reports for administrative use

### 🔐 Authentication & Role-Based Access
- Secure login for Admin, HOD, and Faculty roles
- Role-specific dashboards and access controls
- Laravel Sanctum-powered session management

### 🌐 Modern UI/UX
- Responsive design built with Tailwind CSS and shadcn/ui
- Single-page application experience via Inertia.js
- Intuitive navigation with a clean, minimal interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Laravel 12.x (PHP 8.2+) |
| **Frontend** | React 18.x + Inertia.js |
| **Styling** | Tailwind CSS 3.x |
| **UI Components** | shadcn/ui |
| **Build Tool** | Vite |
| **Database** | MySQL / MariaDB |
| **ORM** | Eloquent |
| **Authentication** | Laravel Breeze |
| **Containerization** | Docker (Sail) |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 20.x and **npm** >= 10.x
- **MySQL** >= 8.0 or MariaDB >= 10.6
- **Git**
- *(Optional)* Docker & Docker Compose

---

## 🚀 Installation

### Option 1 — Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/varunbalaji167/FMS_Laravel.git
cd FMS_Laravel
```

**2. Install PHP dependencies**

```bash
composer install
```

**3. Install JavaScript dependencies**

```bash
npm install
```

**4. Configure environment variables**

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and update your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fms_laravel
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

**5. Run database migrations and seed initial data**

```bash
php artisan migrate --seed
```

**6. Create a storage symlink**

```bash
php artisan storage:link
```

**7. Build frontend assets**

```bash
npm run build
```

**8. Start the development server**

```bash
php artisan serve
```

Visit **http://localhost:8000** in your browser.

---

### Option 2 — Docker / Laravel Sail Setup

```bash
git clone https://github.com/varunbalaji167/FMS_Laravel.git
cd FMS_Laravel

cp .env.example .env

./vendor/bin/sail up -d

./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail artisan storage:link
```

Visit **http://localhost:8000** in your browser.

---

## 🔑 Default Credentials

After seeding, you can log in with the following default accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fms.com` | `password` |
| HOD | `hod@fms.com` | `password` |
| Faculty | `faculty@fms.com` | `password` |

> ⚠️ **Change these credentials immediately in a production environment.**

---

## 💻 Development

To run the app in development mode with hot module replacement:

```bash
# Start Laravel backend
php artisan serve

# In a separate terminal, start Vite dev server
npm run dev
```

If you are using Sail:

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

---

## 📁 Project Structure

```
FMS_Laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # Route controllers (Faculty, Department, Leave, Attendance...)
│   │   ├── Middleware/        # Auth and role middleware
│   │   └── Requests/          # Form request validation classes
│   ├── Models/                # Eloquent models (Faculty, Department, Leave, Attendance...)
│   └── Policies/              # Authorization policies
├── database/
│   ├── migrations/            # Database schema migrations
│   └── seeders/               # Seed data for initial setup
├── resources/
│   ├── js/
│   │   ├── Components/        # Reusable React components
│   │   ├── Layouts/           # Page layout components
│   │   └── Pages/             # Inertia.js page components
│   └── css/                   # Global styles
├── routes/
│   ├── web.php                # Web routes
│   └── auth.php               # Authentication routes
├── public/                    # Publicly served files
├── storage/                   # File uploads and logs
├── compose.yaml               # Docker Compose configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js             # Vite bundler configuration
└── components.json            # shadcn/ui component config
```

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing style and that all tests pass before submitting.

---

## 🧪 Running Tests

```bash
php artisan test
```

Or with Sail:

```bash
./vendor/bin/sail artisan test
```

---

## 🔒 Security

If you discover a security vulnerability, please send an e-mail to the maintainer. All security vulnerabilities will be promptly addressed.

---


<div align="center">

Built with using [Laravel](https://laravel.com) · [React](https://reactjs.org) · [Inertia.js](https://inertiajs.com) · [Tailwind CSS](https://tailwindcss.com)

</div>
