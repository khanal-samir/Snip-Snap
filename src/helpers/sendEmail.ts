import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function sendMail(
  email: string,
  emailType: "VERIFY" | "RESET",
  token: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: "gdssamir@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
          ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">
              Thank you for signing up! Please use the verification code below to verify your email address.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #007bff; 
                          background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block;">
                ${token}
              </div>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">
              This code will expire in 10 minutes.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              If you did not request this code, please ignore this email.
            </p>
          </div>
        `
          : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555;">
              We received a request to reset your password. Click the link below to reset it.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${token}" 
                style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">
              Or copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #007bff; text-align: center; word-wrap: break-word;">
            ${token}
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              If you did not request this, please ignore this email. The link will expire in 1 hour.
            </p>
          </div>
        `,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
}
