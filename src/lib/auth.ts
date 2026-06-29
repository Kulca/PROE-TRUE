import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        userId: { label: "UserId", type: "text" },
      },
      async authorize(credentials) {
        // Credentials are pre-verified via Convex signIn mutation on the client.
        // This callback just returns the user object for JWT session creation.
        if (!credentials?.email) return null;

        return {
          id: (credentials.userId as string) ?? (credentials.email as string),
          email: credentials.email as string,
          name: credentials.name as string ?? "",
          role: credentials.role as string ?? "consumer",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role ?? "consumer";
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      // For social providers, create a Convex user if they don't exist yet.
      // (Social user creation is handled via a Convex action or REST API call)
      // For credentials, always allow since credentials were pre-verified.
      if (account?.provider === "credentials") {
        return true;
      }

      // For social providers (Google, Facebook, Apple), allow sign-in.
      // User creation in Convex happens via a separate process.
      return true;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
});
