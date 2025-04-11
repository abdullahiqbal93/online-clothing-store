export const createNewsletterEmailTemplate = (content) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; }
          .content { padding: 20px 0; }
          .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Newsletter</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Flexxy. All rights reserved.</p>
            <p>You received this email because you are subscribed to our newsletter.</p>
            <p>Visit our website: <a href="https://www.flexxy.com">www.flexxy.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    html,
    text: content.replace(/<[^>]*>/g, '') 
  };
};