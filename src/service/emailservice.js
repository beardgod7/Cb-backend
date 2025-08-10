const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendResetCodeEmail(email, resetCode) {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: "reset password OTP Code",
    text: `Your reset password OTP code is: ${resetCode}`,
    html: `<strong>Your OTP code is: ${resetCode}</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP sent to ${resetCode}`);
    return true;
  } catch (error) {
    console.error(
      "Failed to send OTP email:",
      error.response?.body || error.message
    );
    return false;
  }
}

async function sendVerificationCodeEmail(email, verificationCode) {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${verificationCode}`,
    html: `<strong>Your OTP code is: ${verificationCode}</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error(
      "Failed to send OTP email:",
      error.response?.body || error.message
    );
    return false;
  }
}

module.exports = { sendVerificationCodeEmail, sendResetCodeEmail };
