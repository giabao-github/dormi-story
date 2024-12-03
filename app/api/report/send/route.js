const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { default: getCurrentUser } = require('@/app/actions/getCurrentUser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const currentUser = getCurrentUser();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: currentUser.email,
    pass: currentUser.hashedPassword
  }
});

// Endpoint to handle report submission
app.post('/api/report/send', (req, res) => {
  const { category, time, location, description, proofSrc } = req.body;

  // Read the HTML template
  const templatePath = path.join(__dirname, 'template.html');
  fs.readFile(templatePath, 'utf8', (err, html) => {
    if (err) {
      return res.status(500).send('Error reading template');
    }

    // Replace placeholders with actual data
    const htmlContent = html
      .replace('{{category}}', category)
      .replace('{{time}}', time)
      .replace('{{location}}', location)
      .replace('{{description}}', description)
      .replace('{{proofSrc}}', proofSrc);

    const mailOptions = {
      from: currentUser.email,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Report Submitted',
      html: htmlContent,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '/public/images/full-logo.png'),
          cid: 'logo'
        }
      ]
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Report sent: ' + info.response);
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});