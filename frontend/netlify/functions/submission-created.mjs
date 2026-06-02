import { Resend } from 'resend';

/**
 * Netlify event-triggered function.
 * The file name `submission-created` registers it to run automatically
 * whenever a Netlify Form submission is verified. Uses the reliable
 * legacy handler signature: the submission arrives as a JSON string in
 * `event.body`, with the form fields under `payload.data`.
 */
export const handler = async (event) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { payload } = JSON.parse(event.body);
    const email = payload?.data?.email;
    const profile = payload?.data?.profile;
    const formName = payload?.form_name;

    if (!email) {
      console.error('submission-created: no email found in payload', payload?.data);
      return { statusCode: 400, body: JSON.stringify({ error: 'No email provided' }) };
    }

    // Default (waitlist) template
    let templateId = 'welcome';
    let subject = 'Welcome to Bondi Wave';

    // Map the assessment profile (A/B/C) to its published Resend template
    if (formName === 'assessment' && profile) {
      const profileTemplates = {
        A: 'profile_a-2',
        B: 'profile_b',
        C: 'profile_c',
      };
      templateId = profileTemplates[profile] || 'welcome';
      subject = 'Your Breathing Profile Results - Bondi Wave';
    }

    const { data, error } = await resend.emails.send({
      from: 'Bondi Wave <hello@bondiwave.com.au>',
      to: email,
      subject,
      template: { id: templateId },
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@bondiwave.com.au>',
      },
    });

    if (error) {
      console.error('Resend error:', error);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    console.log(`Email sent to ${email} using template "${templateId}":`, data);
    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    console.error('submission-created function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
