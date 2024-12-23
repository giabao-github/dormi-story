import nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { reportTemplate } from './templates/report';

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

export function compileReportTemplate(name: string, url: string, reporterName: string, reporterEmail: string, reporterId: string, category: string, time: string, location: string, description: string, link: string) {
  const template = handlebars.compile(reportTemplate);
  const htmlBody = template({
    name: name,
    url: url,
    reporterName: reporterName,
    reporterEmail: reporterEmail,
    reporterId: reporterId,
    category: category,
    time: time,
    location: location,
    description: description,
    link: link
  });
  return htmlBody;
}