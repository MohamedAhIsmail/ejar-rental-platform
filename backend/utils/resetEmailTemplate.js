export const resetPasswordEmailTemplate = (url, name = "User") => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f0f2f5;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        background: linear-gradient(90deg, #5e17eb, #8e2de2);
        color: #ffffff;
        padding: 30px;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
      }
      .email-body {
        padding: 30px;
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .email-body p {
        margin: 18px 0;
      }
      .button {
        display: inline-block;
        background-color: #5e17eb;
        color: #ffffff !important;
        text-decoration: none !important;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        margin-top: 20px;
        transition: background 0.3s ease;
      }
      .button:hover {
        background-color: #4c14c3;
      }
      .email-footer {
        background-color: #f0f2f5;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #6c757d;
      }
      .email-footer a {
        color: #5e17eb;
        text-decoration: none;
        font-weight: 500;
      }
      .email-footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        Reset Your Password
      </div>
      <div class="email-body">
        <p>Hi <strong>${name}</strong>,</p>
        <p>We received a request to reset your password for your account. Click the button below to proceed:</p>
        <p>
          <a href="${url}" 
             class="button" 
             style="color: #ffffff; text-decoration: none;">
             Reset Password
          </a>
        </p>
        <p>If you didn't request this, no action is needed — your account is safe.</p>
  <p><strong>Note:</strong> This link will expire in <strong>1 hour</strong> for security reasons.</p>
      </div>
      <div class="email-footer">
        <p>© 2025 Ejar ITI Final Project. All rights reserved.</p>
        <p>Need help? <a href="mailto:support@ejar.com">Contact Support</a></p>
      </div>
    </div>
  </body>
  </html>`;
  };
  
  
