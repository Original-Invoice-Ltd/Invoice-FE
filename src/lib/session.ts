import { SessionOptions } from 'iron-session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  jwt?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    isVerified: boolean;
    roles: string[];
    imageUrl?: string;
    createdAt?: string;
  };
  isAuthenticated: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_production_use_only',
  cookieName: 'invoice-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  },
};

export const defaultSession: SessionData = {
  isAuthenticated: false,
};

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.isAuthenticated) {
    session.isAuthenticated = defaultSession.isAuthenticated;
  }
  
  return session;
}

export async function createSession(jwt: string, user: SessionData['user']) {
  const session = await getSession();
  session.jwt = jwt;
  session.user = user;
  session.isAuthenticated = true;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  await session.destroy();
}