import type { DefaultSession } from "next-auth";

import type { AppUser } from './User. types';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      starsCount?: number;
    } & DefaultSession["user"]; // keep default optional fields (name, email, image)
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    starsCount?: number;
  }
}
