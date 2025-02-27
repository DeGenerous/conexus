/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type SignUp = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
};

type AuthWallet = {
  wallet: string;
  faux: boolean;
  main: boolean;
};

type User = {
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
  available?: Available;
} & SignUp;

type SignIn = {
  email: string;
  password: string;
};

enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  ARTIST = 'artist',
}

type ReferralCode = {
  ID: number;
  code: string;
  user_id: number;
  is_used: boolean;
  used_by: number;
  created_at: string;
  updated_at: string;
};

type ReferralSignUp = {
  user: User;
  referral_code: string;
  newsletter: boolean;
};

type Available = {
  available: number;
  used: number;
  bonus: number;
  continuable?: ContinuableStory[];
  categories?: Category[];
  has_ape?: boolean;
};

type SubscriptionStatus = {
	is_active: boolean
	subscribed_at: {
    Time: Date,
    Valid: boolean
  } | null
	unsubscribed_at: {
    Time: Date,
    Valid: boolean
  } | null
}