//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");
let ms = require("../mailSender");

router.post("/liveupdate", async function (req, res) {
  try {
    let theUpdate = {
      timePosted: req.body.timePosted,
      Information: req.body.information,
      datePosted: req.body.datePosted,
      location: req.body.location,
    };

    const updateResult = await userModel.updateOne(
      { "parcel.tracking": req.body.trackingNumber },
      { $push: { liveUpdate: theUpdate } }
    );

    if (updateResult.matchedCount === 0) {
      return res
        .status(200)
        .send({ message: "Couldn't update info, please try again" });
    }

    const doc = await userModel.findOne({
      "parcel.tracking": req.body.trackingNumber,
    });
    if (!doc)
      return res.status(404).send({ message: "Tracking not found" });

    const from = `Hublink Express <noreply@hublinkexpress.com>`;
    const receiver = doc.receiver.email;
    const receiverName = doc.receiver.name;

    // escape user-supplied values before inserting into HTML to prevent injection
    const escapeHtml = (str) => {
      if (str === undefined || str === null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const safeReceiverName = escapeHtml(receiverName);
    const safeInfo = escapeHtml(req.body.information);
    const safeLocation = escapeHtml(req.body.location);
    const safeTracking = escapeHtml(req.body.trackingNumber);

    const htmlMessage = `
      <div style="width: 600px; margin: 0 auto; background: #F0F2F5; padding: 20px;">
          <img src="https://hublinkexpress.com/assets/images/logo-v2.png" height="50px" alt="Hublink Express" />
          <h3 style="margin-left: 0;">New Parcel Update</h3>
          <p>Hello ${safeReceiverName},</p>

          <p>Your package has been updated. See the current update below.</p>

          <div style="margin-top: 20px; line-height: 1.4; font-size: .95em">
              <p>Tracking Number: <strong> ${safeTracking} </strong></p>
              <p>Activity: <strong> ${safeInfo} </strong></p>
              <p>Current Location: <strong> ${safeLocation} </strong></p>
          </div>

          <hr />

          <p style="font-size: .85em; color: gray">This is an automatically generated email. If you need help reply to info@hublinkexpress.com</p>

          <p style="font-size: .85em; color: gray">Website: www.hublinkexpress.com • Email: info@hublinkexpress.com • Tel: +1 585 308 0030</p>
      </div>
    `;

    const subject = `Parcel update: ${safeTracking} - ${safeInfo}`;

    try {
      await ms.mailSender(from, receiver, subject, htmlMessage, {
        replyTo: 'info@hublinkexpress.com',
        listUnsubscribe: '<mailto:unsubscribe@hublinkexpress.com>',
      });
      return res.status(200).send({ message: 'Update completed successfully.' });
    } catch (mailErr) {
      console.error(mailErr);
      if (mailErr.code === 'RATE_LIMIT') {
        return res.status(429).send({ message: 'Email rate limit exceeded, update logged.' });
      }
      return res.status(200).send({ message: "Update was successful, but we couldn't send email to the receiver" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(200)
      .send({ message: "Couldn't update info, please try again" });
  }
});

module.exports = router;
