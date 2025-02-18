import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    name?: string | null;
    email?: string | null;
    role?: "staff" | "student" | "hod";
    image?: string | null;
    rollNumber?: string | null;
    department?: string | null;
    year?: Number | null;
  }
}
