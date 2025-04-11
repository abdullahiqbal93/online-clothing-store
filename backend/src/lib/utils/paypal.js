import paypal from 'paypal-rest-sdk';
import { env } from '@/lib/config.js';

paypal.configure({
    mode: 'sandbox',
    client_id: env.PAYPAL_CLIENT_ID,
    client_secret: env.PAYPAL_CLIENT_SECRET,
});

export default paypal;