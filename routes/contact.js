//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let ms = require("../mailSender");

router.post("/contact", async function (req, res) {
  try {
    // Assuming the HTML form has these field names
    let {
      form_name,
      company_name,
      form_subject,
      form_phone,
      form_message,
      email,
    } = req.body;
    console.log(req.body);

    // Replace newlines with <br> tags and add margin
    const formattedMessage = (form_message || "").replace(
      /(?:\r\n|\r|\n)/g,
      '<br style="margin: 10px 0;">'
    );

    const escapeHtml = (str) => {
      if (str === undefined || str === null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const safeName = escapeHtml(form_name);
    const safeCompany = escapeHtml(company_name);
    const safeSubject = escapeHtml(form_subject);
    const safePhone = escapeHtml(form_phone);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(formattedMessage);

    const emailContent = `
        <div style="width: 600px; margin: 0 auto; background: #F0F2F5; padding: 20px;">
            <p>Hi Dan,</p>
            <p>Received a contact message from ${safeName}</p>
            <div style="margin-top: 15px;font-size: .9em">
                <p>Email: <span style="font-weight: bold"> ${safeEmail} </span></p>
                <p>Phone Number: <span style="font-weight: bold"> ${safePhone} </span></p>
                <p>On behalf of: <span style="font-weight: bold"> ${safeCompany} </span></p>
                <p>Subject: <span style="font-weight: bold"> ${safeSubject} </span></p>

                <h6 style="text-decoration: underline"> MESSAGE FROM CLIENT </h6>
                <p style="line-height: 1.5;">${safeMessage}</p>
            </div>
        </div>
        `;

    try {
      await ms.mailSender(
        safeEmail,
        "info@hublinkexpress.com",
        safeSubject || "Contact Form Submission",
        emailContent,
        {
          replyTo: safeEmail,
          listUnsubscribe: '<mailto:unsubscribe@hublinkexpress.com>'
        }
      );
      return res
        .status(200)
        .send({ success: true, message: "Successfully sent your message" });
    } catch (mailErr) {
      console.error(mailErr);
      if (mailErr.code === 'RATE_LIMIT') {
        return res.status(429).send({ success: false, message: 'Email rate limit exceeded, message logged.' });
      }
      return res
        .status(500)
        .send({ success: false, message: "Couldn't send your message" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
});

module.exports = router;
