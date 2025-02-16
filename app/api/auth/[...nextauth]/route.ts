import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      // when the user is first created/signs in,
      // add the role if it exists (e.g. after profile update) 
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // attach the role from the token (or default to staff)
      session.user = {
        ...session.user,
        role: (token.role as "staff" | "student") || "staff",
      };
      return session;
    },
  },
  // You may add callbacks, pages, etc. here if needed
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
