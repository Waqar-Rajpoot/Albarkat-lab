import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendEmail } from "./email";
import { buildEmailHtml } from "./email-template";

const client = new MongoClient(process.env.MONGODB_URI as string, {
  family: 4,
});
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://albarkatlab.com",
    "https://www.albarkatlab.com",
  ],

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      const heading = "Reset your password";
      const body = `Hi ${user.name || "there"}, click the button below to choose a new password for your Albarkat Lab account.`;
      const expiryText = "This link expires in 1 hour.";
      const disclaimer = "If you didn't request this, you can safely ignore this email — your password won't change.";

      await sendEmail({
        to: user.email,
        subject: "Reset your password — Albarkat Lab",
        html: buildEmailHtml({
          heading,
          body,
          ctaLabel: "Reset Password",
          url,
          expiryText,
          disclaimer,
        }),
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true, // send the link automatically right after sign-up
    autoSignInAfterVerification: true, // log them in once they click the link
    expiresIn: 60 * 60, // verification link valid for 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      const heading = "Verify your email";
      const body = `Hi ${user.name || "there"}, click the button below to verify your email address and activate your Albarkat Lab account.`;
      const expiryText = "This link expires in 1 hour.";
      const disclaimer = "If you didn't create an account, you can safely ignore this email.";

      await sendEmail({
        to: user.email,
        subject: "Verify your email — Albarkat Lab",
        html: buildEmailHtml({
          heading,
          body,
          ctaLabel: "Verify Email",
          url,
          expiryText,
          disclaimer,
        }),
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [nextCookies()],
});