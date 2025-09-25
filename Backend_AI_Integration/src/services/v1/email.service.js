import db from "@/models/index";
import nodemailer from "nodemailer";
import { configMailOptions } from "../../shared/utils/mail_options";

import { config } from "@/config.app";

/**
 * Send email using nodemailer
 * @param {Object} data - The email details
 * @param {string} data.name_project - The name of the project
 * @param {string} data.email_project - The email address of the project
 * @param {string} data.name_user - The name of the user
 * @param {string} data.email_user - The email address of the user
 * @param {string} data.url_verify - The verification URL
 * @param {string} data.url_contact - The contact URL
 * @param {string} data.url_feedback - The feedback URL
 */
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const mailOptions = configMailOptions({
    name_project: data.name_project,
    email_project: data.email_project,
    name_user: data.name_user,
    email_user: data.email_user,
    url_verify: data.url_verify,
    url_contact: data.url_contact,
    url_feedback: data.url_feedback,
  });

  // Send the email
  try {
    const res_sendEmail = await transporter.sendMail(mailOptions);
    return {
      code: 2,
      data: {
        code: "200",
        message: "Email sent successfully!",
        status: "SUCCESS_SEND_EMAIL",
        data: res_sendEmail,
      },
    };
  } catch (error) {
    console.error("Error sending email", error);
    return {
      code: 4,
      error: {
        code: "400",
        message: "Email send fail!",
        status: "FAIL_SEND_EMAIL",
        data: error,
      },
    };
  }
};

/**
 * Verify the user's email address
 * @param {Object} data - The email address to verify
 * @param {string} data.email_verify - The email address to verify
 */
const verifyEmail = async (data) => {
  try {
    // Update the user's status to verified
    const data_user = await db.User.update(
      { status: "verified" },
      { where: { email: data.email_verify } }
    );
    //console.log("check data_user", data_user);
    if (data_user[0] === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `Email verification failed`,
          status: "FAIL_VERIFY_EMAIL",
        },
      };
    }
    return {
      code: 2,
      data: {
        code: "200",
        message: `Email verified successfully`,
        status: "SUCCESS_VERIFY_EMAIL",
      },
    };
  } catch (error) {
    console.error("Error verifying email", error);
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

export { sendEmail, verifyEmail };
