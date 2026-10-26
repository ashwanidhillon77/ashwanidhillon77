const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// .env file se variables load karne ke liye
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 1. Static files serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));

// 2. Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 3. Rate Limiter (Spam / Bot attack se bachne ke liye)
// Ek IP address se 15 minute me sirf 5 form submissions allow hongi
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// 4. Nodemailer Transporter Configuration (Using .env variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 5. Contact Form Submission API Endpoint (Rate limiter applied)
app.post('/api/send-email', contactLimiter, async (req, res) => {
  const { name, company, email, phone, message } = req.body;

  // Basic Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    // A. Admin Notification Email
    const adminMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // B. Client Welcome Email with CV Attachment
    const clientMailOptions = {
      from: `"Ashwani Dhillon" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for connecting with me! I have received your message and will get back to you as soon as possible.</p>
        <p>In the meantime, please find my updated Resume attached to this email.</p>
        <br>
        <p>Best regards,<br>
        <strong>Ashwani Dhillon</strong><br>
        Backend Software Developer</p>
      `,
      attachments: [
        {
          filename: 'Ashwani_Dhillon_CV.pdf',
          path: path.join(__dirname, 'public/Ashwani_CV.pdf')
        }
      ]
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    res.status(200).json({ success: true, message: 'Emails sent successfully!' });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, message: 'Error sending emails', error });
  }
});

// 6. Server start
app.listen(PORT, () => {
    console.log(`Server is running smoothly at http://localhost:${PORT}`);
});