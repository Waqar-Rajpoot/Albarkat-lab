type EmailTemplateOptions = {
  heading: string;
  body: string;
  ctaLabel: string;
  url: string;
  expiryText: string;
  disclaimer: string;
};

const COLORS = {
  navyDark: "#001F3F",
  navyLight: "#4A7BA7",
  accentBlue: "#0066CC",
  accentBlueLight: "#E6F0FF",
  backgroundLight: "#F0F4F8",
  surface: "#FFFFFF",
  textDark: "#1F2937",
  textGray: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
};

export function buildEmailHtml({
  heading,
  body,
  ctaLabel,
  url,
  expiryText,
  disclaimer,
}: EmailTemplateOptions) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:${COLORS.backgroundLight};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.backgroundLight};padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:${COLORS.surface};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.border};">
            <!-- Header -->
            <tr>
              <td style="background-color:${COLORS.navyDark};padding:28px 32px;">
                <span style="color:#ffffff;font-size:19px;font-weight:bold;letter-spacing:0.3px;">Albarkat Lab</span>
              </td>
            </tr>

            <!-- Accent strip -->
            <tr>
              <td style="height:4px;background-color:${COLORS.accentBlue};line-height:4px;font-size:0;">&nbsp;</td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 32px;">
                <h1 style="margin:0 0 16px;font-size:21px;color:${COLORS.textDark};">${heading}</h1>
                <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:${COLORS.textGray};">${body}</p>

                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:6px;background-color:${COLORS.accentBlue};">
                      <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:14px;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:6px;">${ctaLabel}</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:${COLORS.textGray};">
                  ${expiryText} ${disclaimer}
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid ${COLORS.borderLight};">
                  <tr>
                    <td style="padding-top:16px;font-size:12px;line-height:1.6;color:#9CA3AF;word-break:break-all;">
                      Or paste this link into your browser:<br />
                      <a href="${url}" style="color:${COLORS.accentBlue};">${url}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:${COLORS.accentBlueLight};padding:18px 32px;text-align:center;">
                <span style="font-size:11px;color:${COLORS.navyLight};">© ${new Date().getFullYear()} Albarkat Lab. All rights reserved.</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildEmailText({
  heading,
  body,
  url,
  expiryText,
  disclaimer,
}: Omit<EmailTemplateOptions, "ctaLabel">) {
  return `${heading}\n\n${body}\n\n${url}\n\n${expiryText} ${disclaimer}`;
}