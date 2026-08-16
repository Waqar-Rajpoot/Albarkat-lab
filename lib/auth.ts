// import { betterAuth } from "better-auth";
// import { nextCookies } from "better-auth/next-js";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";
// import { sendEmail } from "./email";

// const client = new MongoClient(process.env.MONGODB_URI as string, {
//   family: 4,
// });
// const db = client.db();

// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL,
//   secret: process.env.BETTER_AUTH_SECRET,

//   database: mongodbAdapter(db, {
//     client,
//   }),

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "user",
//         input: false,
//       },
//     },
//   },

//   emailAndPassword: {
//     enabled: true,
//     // Google sign-in bypasses this since Google already verifies the
//     // email for you. Only email/password sign-ups need this step.
//     requireEmailVerification: true,
//   },

//   emailVerification: {
//     sendOnSignUp: true, // send the link automatically right after sign-up
//     autoSignInAfterVerification: true, // log them in once they click the link
//     expiresIn: 60 * 60, // verification link valid for 1 hour
//     sendVerificationEmail: async ({ user, url }) => {
//       await sendEmail({
//         to: user.email,
//         subject: "Verify your email — Albarkat Lab",
//         html: `
//           <p>Hi ${user.name || "there"},</p>
//           <p>Click the link below to verify your email address:</p>
//           <p><a href="${url}">${url}</a></p>
//           <p>This link expires in 1 hour. If you didn't create an account, you can ignore this email.</p>
//         `,
//       });
//     },
//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },

//   // Automatically sets cookies from Server Actions in Next.js.
//   // Must be the last plugin in the array.
//   plugins: [nextCookies()],
// });







import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendEmail } from "./email";

const client = new MongoClient(process.env.MONGODB_URI as string, {
  family: 4,
});
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

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
    // Google sign-in bypasses this since Google already verifies the
    // email for you. Only email/password sign-ups need this step.
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // reset link valid for 1 hour
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password — Albarkat Lab",
        html: `
          <p>Hi ${user.name || "there"},</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${url}">${url}</a></p>
          <p>This link expires in 1 hour. If you didn't request this, you can ignore this email — your password won't change.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true, // send the link automatically right after sign-up
    autoSignInAfterVerification: true, // log them in once they click the link
    expiresIn: 60 * 60, // verification link valid for 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email — Albarkat Lab",
        html: `
          <p>Hi ${user.name || "there"},</p>
          <p>Click the link below to verify your email address:</p>
          <p><a href="${url}">${url}</a></p>
          <p>This link expires in 1 hour. If you didn't create an account, you can ignore this email.</p>
        `,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Automatically sets cookies from Server Actions in Next.js.
  // Must be the last plugin in the array.
  plugins: [nextCookies()],
});