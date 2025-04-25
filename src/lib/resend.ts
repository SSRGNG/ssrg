import { env } from '@/env';
import { Resend } from 'resend';

export const resend = new Resend(env.AUTH_RESEND_KEY);
