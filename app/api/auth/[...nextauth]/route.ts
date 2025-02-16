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
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        // console.log("TRIGGER UPDATE");
        token = { ...session };
      }
      console.log(token);
      if (user) {
        if (user.role) token.role = user.role;
        if (user.name) token.name = user.name;
        if (user.department) token.department = user.department as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name || session.user.name,
        role: (token.role as "student" | "staff") || "student",
        department: (token.department as string) || session.user.department,
      };
      return session;
    },
  },
  // You may add callbacks, pages, etc. here if needed
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
