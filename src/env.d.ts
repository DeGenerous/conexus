/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Nullable<T> = T | null | undefined;

type VolumeControl = {
  muted: boolean;
  volume: number;
  restart: boolean;
};

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

interface ContinuableStory {
  story_id: string;
  category: string;
}

type Topic = {
  name: string;
  available: boolean;
};

type Category = {
  name: string;
  topics: Topic[];
};

type Available = {
  available: number;
  used: number;
  bonus: number;
  continuable: ContinuableStory[];
  categories: Category[];
};

type StepData = {
  step: number;
  story: string;
  end: boolean;
  summary: string;
  trait: string;
  options: string[];
  image?: string;
  tts?: Blob;
};

type GameData = {
  id: string;
} & StepData;

// Error
type ConexusError = {
  code: number;
  error?: string = 'Something went wrong, please try again later...';
  log?: boolean = true;
};
