export const otpTemplate = (otp: string, isReset: boolean) => {
  const title = isReset ? 'Reset Your Password' : 'Confirm Your Email';
  const actionText = isReset ? 'reset your password' : 'complete your registration';

  return `
  <div style="background-color: #f9fafb; padding: 4px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
      
      <div style="background-color: #111827; padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; font-weight: 300;">
          HUMAN <span style="font-weight: 700; color: #60a5fa;">STORIES</span>
        </h1>
      </div>

      <div style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 16px; font-size: 20px;">${title}</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
          Hello! You're almost there. Please use the verification code below to ${actionText} on Human Stories.
        </p>
        
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; display: inline-block; min-width: 200px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2563eb; font-family: monospace;">
            ${otp}
          </span>
        </div>

        <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
          This code is valid for <strong>5 minutes</strong>.
        </p>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          This is an automated message from <strong>Human Stories</strong>.
        </p>
        <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 11px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    </div>
  </div>
  `;
};