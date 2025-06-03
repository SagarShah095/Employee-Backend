const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "utsavvasoya99@gmail.com",
    pass: "uptdpvaxaavevvbp",
  },
});

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"HR Team" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
