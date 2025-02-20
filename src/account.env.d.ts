/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface SignUp {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
}

interface AuthWallet {
  wallet: string;
  fauc: boolean;
  main: boolean;
}

interface User extends SignUp {
  ID?: string;
  oauth_id?: string;
  email_confirmed?: boolean;
  referral_count?: number;
  referred: boolean;
  wallets?: AuthWallet[];
  main_wallet?: string;
  faux?: boolean;
  email_confirmed?: boolean;
  is_oauth?: boolean;
}

interface SignIn {
  email: string;
  password: string;
}

enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  ARTIST = 'artist',
}

interface ReferralCode {
  ID: number;
  code: string;
  user_id: number;
  is_used: boolean;
  used_by: number;
  created_at: string;
  updated_at: string;
}

interface ReferralSignUp {
  user: User;
  referral_code: string;
}

type Available = {
  available: number;
  used: number;
  bonus: number;
  continuable?: ContinuableStory[];
  categories?: Category[];
  has_ape?: boolean;
};
