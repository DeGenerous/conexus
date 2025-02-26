/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Nullable<T> = T | null | undefined;

type APISTDResposne = {
  message: string;
};

type APIError = {
  message: string; // User-facing error message
  details?: string; // Developer debug info (optional)
};

type APIResponse<T> = {
  data?: T;
  error?: APIError;
};

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
  faux: boolean;
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
  newsletter: bool
}

interface SubscriptionStatus {
	is_active:       boolean
	subscribed_at:   Date | null
	undefinednsubscribed_at: Date | null
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
  continuable?: ContinuableStory[];
  categories?: Category[];
  has_ape?: boolean;
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

type ResetPassword = {
  email: string;
  password: string;
  token: string;
};

type ChangePassword = {
  old_password: string;
  new_password: string;
};

type Web3Signin = {
  message: string;
  signature: string;
};

type Section = {
  name: string;
  tile_image1?: string;
  tile_image2?: string;
};

type Genre = {
  id: number;
  name: string;
};

type SectionCategory = {
  name: string;
  oder: number;
  topics: {
    name: string;
    order: number;
    available: boolean;
    title_image1?: string;
    title_image2?: string;
    created_at?: Date;
  }[];
  created_at?: Date;
};

type SectionTopic = {
  name: string;
  image_prompt?: string;
  description?: string;
  description_image?: string;
  genres?: string;
};
