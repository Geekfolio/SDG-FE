import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: "staff" | "student";
      department?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: "staff" | "student";
    department?: string | null;
    batch?: Number | null;
    rollNumber?: string | null;
  }
}
