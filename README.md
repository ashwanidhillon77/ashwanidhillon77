# Personal Portfolio & Backend Contact Service

A modern, responsive personal portfolio website featuring a secure Node.js and Express backend with Nodemailer integration for handling contact form submissions, admin notifications, and automated client CV delivery.

## 🚀 Features

- **Responsive Frontend:** Clean design with a permanent dark theme and functional project/social links.
- **Dynamic Contact Form:** Seamlessly sends messages via a secure backend API.
- **Dual Email Dispatch:** 
  - Sends an instant notification email to the admin with visitor details.
  - Sends an automated welcome email to the client with the updated resume attached (`Ashwani_CV.pdf`).
- **Security Best Practices:** 
  - Protected sensitive credentials using `dotenv`.
  - Implemented `express-rate-limit` to prevent spam and bot attacks on the contact form.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Email Service:** Nodemailer (Gmail SMTP with App Passwords)
- **Security:** Dotenv, Express Rate Limit, CORS

## ⚙️ Installation & Local Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/ashwanidhillon77/ashwanidhillon77.git](https://github.com/ashwanidhillon77/ashwanidhillon77.git)