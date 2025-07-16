export const emailTemplate = (url, name = "User") => {
    if (!url) {
      console.error("❌ Error: Confirmation URL is missing!");
      return "<p>Error: Confirmation URL is missing!</p>";
    }
  
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 40px auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        text-align: center;
      }
      .email-header {
        background-color: #007bff;
        color: #ffffff;
        padding: 30px;
        font-size: 24px;
        font-weight: bold;
      }
      .email-body {
        padding: 30px;
        color: #333333;
        font-size: 16px;
        line-height: 1.6;
      }
      .email-body p {
        margin: 18px 0;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff !important;
        text-decoration: none !important;
        padding: 14px 24px;
        border-radius: 6px;
        font-size: 18px;
        font-weight: bold;
        margin-top: 20px;
        transition: background 0.3s ease-in-out;
      }
      .button:hover {
        background-color: #0056b3;
      }
      .email-footer {
        background-color: #f8f9fa;
        padding: 20px;
        font-size: 14px;
        color: #6c757d;
        text-align: center;
      }
      .email-footer a {
        color: #007bff;
        text-decoration: none;
        font-weight: bold;
      }
      .email-footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        Confirm Your Email Address
      </div>
      <div class="email-body">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for signing up! , please confirm your email address.</p>
        <p>Click the button below to verify your email:</p>
        <p>
          <a href="${url}" class="button" style="color: #ffffff; text-decoration: none;">
            Confirm Email
          </a>
        </p>
        <p>If you did not sign up for this account, please disregard this email.</p>
      </div>
      <div class="email-footer">
        <p>© 2025 Ejar ITI Final Project. All rights reserved.</p>
        <p>Need assistance? <a href="mailto:support@ejar.com">Contact Support</a></p>
      </div>
    </div>
  </body>
  </html>`;
  };
  