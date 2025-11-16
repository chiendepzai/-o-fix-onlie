const nodemailer = require('nodemailer');

/**
 * Gửi email chứa link xác thực tài khoản
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} token - Token xác thực
 */
const sendVerificationEmail = async (to, token) => {
  try {
    // KIỂM TRA MÔI TRƯỜNG: Nếu không có cấu hình SMTP, chỉ in link ra console.
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
      console.log('==============================================================');
      console.log('📧 CHẾ ĐỘ PHÁT TRIỂN (KHÔNG GỬI EMAIL)');
      console.log(`   - Người nhận : ${to}`);
      console.log(`   - Link xác thực: ${process.env.FRONTEND_URL}/verify-account?token=${token}`);
      console.log('   (Sao chép link trên và dán vào trình duyệt để xác thực)');
      console.log('==============================================================');
      return; // Kết thúc hàm ở chế độ phát triển
    }

    // Nếu có cấu hình SMTP, tạo transporter và tiến hành gửi email thật
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // không từ chối các chứng chỉ tự ký (hữu ích cho môi trường local hoặc một số nhà cung cấp)
        rejectUnauthorized: false
      }
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${token}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your App Name'}" <${process.env.EMAIL_USER}>`,
      to: to, // Người nhận
      subject: 'Xác thực tài khoản của bạn', // Chủ đề
      html: `
        <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấp vào nút dưới đây để xác thực tài khoản của bạn:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
          Xác thực tài khoản
        </a>
        <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán đường link sau vào trình duyệt:</p>
        <p>${verificationLink}</p>
        <p>Đường link này sẽ hết hạn sau 15 phút.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending verification email to ${to}:`, error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };