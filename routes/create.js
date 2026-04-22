//Set up
let express = require("express");
let router = express.Router();

let userModel = require("../schemas/userSchema");
let ms = require("../mailSender");

router.post("/create", async function (req, res) {
  try {
    let newUser = {
      sender: {
        name: req.body.senderName.trim(),
        address: req.body.senderAddress.trim(),
        country: req.body.senderCountry.trim(),
        tel: req.body.senderPhone,
        email: req.body.senderEmail,
      },
      receiver: {
        name: req.body.receiverName.trim(),
        address: req.body.receiverAddress.trim(),
        country: req.body.receiverCountry.trim(),
        tel: req.body.receiverPhone,
        email: req.body.receiverEmail,
      },
      parcel: {
        tracking: req.body.trackingNumber.trim(),
        packages: [],
      },
      shippinginformation: {
        carrier: req.body.carrier,
        shipmentmode: req.body.shippingMode,
        deliveryduration: req.body.duration.trim(),
        shipmentdate: req.body.shippingDate.slice(0, 10),
        deliverydate: req.body.deliveryDate.slice(0, 10),
      },
      progress: {
        shipped: false,
        transit: false,
        delivered: false,
      },
      liveUpdate: [],
    };

    const newUserInstance = new userModel(newUser);
    await newUserInstance.save();

    // escape helper
    const escapeHtml = (str) => {
      if (str === undefined || str === null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const safeReceiverName = escapeHtml(req.body.receiverName.trim());
    const safeTracking = escapeHtml(req.body.trackingNumber.trim());
    const safeShipmentDate = escapeHtml(req.body.shippingDate.slice(0,10));
    const safeDeliveryDate = escapeHtml(req.body.deliveryDate.slice(0,10));

    const from = `Hublink Express <noreply@hublinkexpress.com>`;
    const receiver = `${req.body.receiverEmail}`;

    const htmlMessage = `
      <div style="width: 600px; margin: 0 auto; min-height: 600px; background: #F0F2F5; padding: 20px;">
          <img src="https://hublinkexpress.com/assets/images/logo-v2.png" height="50px" alt="Hublink Express" />
          <h3 style="margin-left: 0;">A Package has been sent to you</h3>
          <p>Hi ${safeReceiverName},</p>
          <p>A package has been sent to you and is in process. See details below.</p>
          <div style="margin-top: 20px; line-height: 1.4; font-size: .95em">
              <p>Tracking Number: <strong>${safeTracking}</strong></p>
              <p>Shipment Date: <strong>${safeShipmentDate}</strong></p>
              <p>Delivery Date: <strong>${safeDeliveryDate}</strong></p>
          </div>
          <hr />
          <p style="font-size: .85em; color: gray">This is an automatically generated email. For help reply to info@hublinkexpress.com</p>
      </div>
    `;

    const subject = `Package initiated: ${safeTracking}`;

    try {
      await ms.mailSender(from, receiver, subject, htmlMessage, {
        replyTo: 'info@hublinkexpress.com',
        listUnsubscribe: '<mailto:unsubscribe@hublinkexpress.com>'
      });
      return res.status(200).send({ message: 'Tracking has been created successfully' });
    } catch (mailErr) {
      console.error(mailErr);
      if (mailErr.code === 'RATE_LIMIT') {
        return res.status(429).send({ message: 'Tracking created; email rate limit exceeded; update logged.' });
      }
      return res.status(200).send({ message: "Tracking has been created, but couldn't send an email to the receiver." });
    }
  } catch (err) {
    console.error(err);
    if (err && err.code == 11000) {
      return res.status(400).send({
        message:
          "This tracking number has been assigned, kindly use another tracking number.",
      });
    }
    return res.status(400).send({ message: "An Error Occurred During Creation, please try again" });
  }
});

module.exports = router;
