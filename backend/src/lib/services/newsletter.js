import { Newsletter } from '@/api/newsletter/schema/model';
import { sendEmail } from '@/lib/utils/email';
import { createNewsletterEmailTemplate } from '@/lib/templates/newsletter';
import { mainLogger } from '@/lib/logger/winston';

/**
 * Send newsletter to all subscribed users
 * @param {Object} options - Newsletter options
 * @param {string} options.subject - Newsletter subject
 * @param {string} options.content - Newsletter content (HTML supported)
 * @returns {Promise<Object>} - Result object with success and error counts
 */

export const sendNewsletterToAllUsers = async ({ subject, content }) => {
  const result = {
    totalSubscribers: 0,
    successCount: 0,
    errorCount: 0,
    errors: []
  };

  try {
    const subscribers = await Newsletter.find({ isSubscribed: true });
    result.totalSubscribers = subscribers.length;

    if (subscribers.length === 0) {
      return result;
    }

    const { html, text } = createNewsletterEmailTemplate(content);

    for (const subscriber of subscribers) {
      try {
        await sendEmail({
          to: subscriber.email,
          subject,
          html,
          text
        });
        result.successCount++;
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          email: subscriber.email,
          error: error.message
        });
        mainLogger.error(`Failed to send newsletter to ${subscriber.email}:`, error);
      }
    }
    return result;
  } catch (error) {
    mainLogger.error('Error in sendNewsletterToAllUsers:', error);
    throw error;
  }
};