const otpTemplate = (otp) => `
<div style="max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px">
    <h2>Email Verification</h2>

    <p>Welcome to Role SaaS System.</p>

    <p>Your verification code is:</p>

    <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        text-align:center;
        padding:20px;
        background:#f4f4f4;
        border-radius:8px;
    ">
        ${otp}
    </div>

    <p>This OTP will expire in 10 minutes.</p>

    <p>Thanks,<br/>Role SaaS Team</p>
</div>
`;

module.exports = otpTemplate;