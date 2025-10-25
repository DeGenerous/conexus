/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type SignUp = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  referred: boolean;
};

type AuthWallet = {
  id?: string;
  wallet: string;
  faux: boolean;
  main: boolean;
};

type User = {
  id?: string;
  tenant_id?: string;
  email_confirmed?: boolean;
  is_oauth?: boolean;
  referral_code?: string;
  credits: number;
  bonus?: number;
  credit_reset_in: number;
  role_id: string;
  role_name?: DefaultRoles;
  username?: string;
  avatar_url?: string;
  avatar_file_id?: string;
  avatar_bio?: string;
  main_wallet?: string;
  faux?: boolean;
  wallets?: AuthWallet[];
} & SignUp;

type SignIn = {
  email: string;
  password: string;
};

type DefaultRoles = 'Guest' | 'Player' | 'Creator' | 'Admin';

type ReferralCode = {
  id: string;
  code: string;
  usage_count: number;
  max_usage: number;
  created_at: string;
  updated_at: string;
};

type ReferralSignUp = SignUp & {
  referral_code: string;
  newsletter: boolean;
};

type SubscriptionStatus = {
  is_active: boolean;
  subscribed_at: {
    Time: Date;
    Valid: boolean;
  } | null;
  unsubscribed_at: {
    Time: Date;
    Valid: boolean;
  } | null;
};

// temporary storage for all Profile errors
// until we move it to the separate page
type AccountError = {
  signin?: Nullable<string>;
  signup?: Nullable<string>;
  googleSignin?: Nullable<string>;
  changePassword?: Nullable<string>;
} | null;

// For Route Guards
type UserState = 'signed' | 'admin' | 'player' | 'guest' | 'referred';

/* V2 */

type DurationEnum =
  | '1 DAY'
  | '2 DAYS'
  | '5 DAYS'
  | '10 DAYS'
  | '1 WEEK'
  | '1 MONTH';

type UserStoriesFilter = {
  ended: boolean;
  duration: DurationEnum;
};

type DashboardTopic = {
  topic_id?: string;
  name?: string;
  tile_file_url?: string;
  route_name?: string;
  creator?: boolean;
};

type AccountNotificationData = {
  href?: string;
};

type AccountNotification = {
  id: string;
  title: string;
  body: string;
  data?: AccountNotificationData;
  read_at: string | null;
};

type DisplayUser = {
  account_id: string;
  username: string;
  avatar: string;
};

type CreatorTile = {
  Genre: string[];
  tile_file_url?: string;
} & DisplayUser;

type StreakAction = 'login' | 'play';

type UserStoriesMetric = {
  story_count: number;
  stories: DashboardStoryInfo[];
} & DashboardTopic;

type DashboardStoryInfo = {
  story_id: string;
  total_steps: number;
  started_at: Date;
  last_step_at: Date;
};
