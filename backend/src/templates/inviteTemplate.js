const inviteTemplate = (
    name,
    inviteLink
) => `
<div style="
    max-width:600px;
    margin:auto;
    padding:20px;
    border:1px solid #e5e7eb;
    border-radius:10px;
    font-family:Arial,sans-serif;
">

    <h2 style="
        color:#111827;
        text-align:center;
    ">
        Welcome to TeamFlow
    </h2>

    <p>
        Hello ${name},
    </p>

    <p>
        You have been invited to join your organization on TeamFlow.
    </p>

    <p>
        Click the button below to activate your account and set your password.
    </p>

    <div style="text-align:center;margin:30px 0;">
        <a
            href="${inviteLink}"
            style="
                background:#0f172a;
                color:white;
                text-decoration:none;
                padding:12px 24px;
                border-radius:8px;
                display:inline-block;
            "
        >
            Accept Invitation
        </a>
    </div>

    <p>
        If the button doesn't work, copy and paste the link below into your browser:
    </p>

    <p style="
        word-break:break-all;
        color:#2563eb;
    ">
        ${inviteLink}
    </p>

    <p>
        This invitation will expire in 24 hours.
    </p>

    <p>
        Regards,<br/>
        TeamFlow Team
    </p>

</div>
`;

module.exports = inviteTemplate;