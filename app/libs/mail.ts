import nodemailer from 'nodemailer';

export async function sendEmail({ to, name, subject, body }: {
  to: string, 
  name: string, 
  subject: string, 
  body: string
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD
    },
  });

  try {
    const result = await transport.verify();
    console.log(result);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}