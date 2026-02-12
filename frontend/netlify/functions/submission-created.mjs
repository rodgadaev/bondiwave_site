import { Resend } from 'resend';

export default async (req, context) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { payload } = await req.json();
    const { email, profile } = payload.data;
    const formName = payload.form_name;

    if (!email) {
      console.error('No email address found in submission');
      return new Response(JSON.stringify({ error: 'No email provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine which template to use based on form and profile
    let templateId = 'welcome'; // Default for waitlist form
    let subject = 'Welcome to Bondi Wave';

    if (formName === 'assessment' && profile) {
      // Map profile to template ID
      const profileTemplates = {
        'A': 'profile_a-2',
        'B': 'profile_b',
        'C': 'profile_c',
      };
      templateId = profileTemplates[profile] || 'welcome';
      subject = 'Your Breathing Profile Results - Bondi Wave';
    }

    const { data, error } = await resend.emails.send({
      from: 'Bondi Wave <hello@bondiwaveaustralia.com>',
      to: email,
      subject: subject,
      template: { id: templateId },
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
