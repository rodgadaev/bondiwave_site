import { Resend } from 'resend';

export default async (req, context) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { payload } = await req.json();
    const { email } = payload.data;

    if (!email) {
      console.error('No email address found in submission');
      return new Response(JSON.stringify({ error: 'No email provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Bondi Wave <hello@bondiwaveaustralia.com>',
      to: email,
      subject: 'Welcome to Bondi Wave',
      template: { id: 'welcome' },
      headers: {
        'List-Unsubscribe': '<{{{RESEND_UNSUBSCRIBE_URL}}}>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      },
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Email sent successfully:', data);
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
