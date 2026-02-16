/**
 * Account domain types.
 * Authentication, user profiles, roles, referrals, and dashboard metrics.
 */

/** Registration payload for new accounts. */
type SignUp = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  /** Whether the user was referred by another user. */
  referred: boolean;
};

/** Wallet linked to a user account. */
type AuthWallet = {
  id?: string;
  wallet: string;
  /** True if the wallet was system-generated (not user-owned). */
  faux: boolean;
  /** True if this is the user's primary wallet. */
  main: boolean;
};

/** Authenticated user profile. Extends SignUp with account metadata. */
type User = {
  id?: string;
  tenant_id?: string;
  email_confirmed?: boolean;
  is_oauth?: boolean;
  created_at?: string;
  referral_code?: string;
  credits: number;
  bonus?: number;
  /** Seconds until the next credit reset. */
  credit_reset_in: number;
  role_id: string;
  role_name?: DefaultRoles;
  username?: string;
  avatar_url?: string;
  avatar_file_id?: string;
  avatar_bio?: string;
  main_wallet?: string;
  /** True if the user has a system-generated wallet. */
  faux?: boolean;
  wallets?: AuthWallet[];
} & SignUp;

/** Login credentials. */
type SignIn = {
  email: string;
  password: string;
};

/** Platform role tiers. */
type DefaultRoles = 'Guest' | 'Player' | 'Creator' | 'Admin';

/** Referral code with usage tracking. */
type ReferralCode = {
  id: string;
  code: string;
  usage_count: number;
  max_usage: number;
  created_at: string;
  updated_at: string;
};

/** Registration payload for referred users. */
type ReferralSignUp = SignUp & {
  referral_code: string;
  newsletter: boolean;
};

/** Error state for account-related operations. */
type AccountError = {
  signin?: Nullable<string>;
  signup?: Nullable<string>;
  googleSignin?: Nullable<string>;
  changePassword?: Nullable<string>;
} | null;

/** Route guard user states. */
type UserState = 'signed' | 'admin' | 'player' | 'guest' | 'referred';

// ---------------------------------------------------------------------------
// V2 — Dashboard & Metrics
// ---------------------------------------------------------------------------

/** Allowed story duration filters. */
type DurationEnum =
  | '1 DAY'
  | '2 DAYS'
  | '5 DAYS'
  | '10 DAYS'
  | '1 WEEK'
  | '1 MONTH';

/** Dashboard filter for user story history. */
type UserStoriesFilter = {
  ended: boolean;
  duration: DurationEnum;
};

/** Topic summary shown on the user console. */
type ConsoleTopic = {
  topic_id?: string;
  name?: string;
  tile_file_url?: string;
  route_name?: string;
  /** True if the current user is the topic creator. */
  creator?: boolean;
};

/** In-app notification entry. */
type AccountNotification = {
  id: string;
  title: string;
  body: string;
  data?: {
    /** Optional deep-link URL. */
    href?: string;
  };
  /** Null when the notification is unread. */
  read_at: string | null;
};

/** Minimal user info for display (leaderboards, lists). */
type DisplayUser = {
  account_id: string;
  username: string;
  avatar: string;
};

/** Creator card shown in discovery feeds. */
type CreatorTile = {
  Genre: string[];
  tile_file_url?: string;
} & DisplayUser;

/** Actions that count toward a user's streak. */
type StreakAction = 'login' | 'play';

/** Per-topic story activity metric for the user console. */
type UserStoriesMetric = {
  story_count: number;
  stories: ConsoleStoryInfo[];
} & ConsoleTopic;

/** Individual story progress entry within a console metric. */
type ConsoleStoryInfo = {
  story_id: string;
  total_steps: number;
  started_at: Date;
  last_step_at: Date;
};
