import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Log the access token
      if (account?.access_token) {
        console.log("Access Token:", account.access_token);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the membership page after sign in
      return `${baseUrl}/membership`;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
