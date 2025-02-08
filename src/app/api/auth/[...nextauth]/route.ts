import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/lib/modals/user"; // User model
import connect from "@/lib/db"; // MongoDB connection utility

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await connect(); // Ensure DB connection

        const user = await User.findOne({ email: profile.email });

        if (!user) {
          // Create new user if not found
          const newUser = new User({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          });

          await newUser.save(); // Save the new user to DB
          return {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
          };
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        await connect();

        // Check if the user exists
        const user = await User.findOne({ email: credentials.email });

        // If user doesn't exist, return null (don't create a new user)
        if (!user) return null;

        // Check password validity
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        // Return user data without password
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login", // Custom login page
  },

  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google") {
        // You can log the profile or perform other actions after Google sign-in
      }
      return true;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/membership`; // Redirect to membership page after sign-in
    },

    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub; // Add user ID to session
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Add user ID to JWT
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env.local
  session: {
    strategy: "jwt", // Use JWT for session strategy
  },
  debug: true, // Enable debugging for development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
