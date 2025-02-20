import { api_error } from '@errors/index';
import { Web3Provider } from './ethers';
import { get_cookie } from './cookies';
import {
  web3LoggedIn,
  web3loginError,
  referralCodes,
  authenticated,
  availables,
  newsletterStatus,
} from '@stores/account';
import { toastStore } from '@stores/toast';

const url = import.meta.env.PUBLIC_BACKEND;
const domain = import.meta.env.PUBLIC_DOMAIN;

const message = (nonce: string) => `
Sign this message to prove you're a Potential NFT holder.

It will not cause a blockchain transaction, nor any gas fees.

Nonce:
${nonce}`;

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  ARTIST = 'artist',
}

class Account {
  #username: string;
  #admin: boolean;

  private constructor(username: string, admin: boolean) {
    this.#username = username;
    this.#admin = admin;
  }

  static async cookie(): Promise<void> {
    const cookiePresent = get_cookie('logged') === 'true';

    web3LoggedIn.set(cookiePresent);
  }

  static async logged_in(): Promise<boolean> {
    // if (web3LoggedIn) {
    // 	try {
    // 		const response = await fetch(`${url}/logged-in`, {
    // 			method: "POST",
    // 		});

    // 		const logged_in = response.ok;

    // 		if (logged_in) {
    // 			return true;
    // 		}
    // 		web3LoggedIn.set(false);
    // 	} catch (error) {
    // 		web3LoggedIn.set(false);
    // 	}
    // }

    return true;
  }

  static async log_in(
    walletProvider: 'metamask' | 'coinbase' = 'metamask',
    link: boolean = false,
  ): Promise<Account> {
    const provider = await Web3Provider.init(walletProvider);

    const nonce = await Account.get_nonce(walletProvider);

    const signature = await provider.sign(message(nonce));

    const userWallet = await provider.userAddress();

    const urlPath = link ? 'linklogin' : 'login';

    const response = await fetch(`${url}/${urlPath}`, {
      method: 'POST',
      body: JSON.stringify({
        wallet: userWallet,
        signature: signature,
      }),
    });

    if (!response.ok) {
      console.error(response.text());

      web3loginError.set(true);

      toastStore.show(
        'This wallet is not linked to any account! Please use another login method or different wallet.',
        'error',
      );
    } else {
      web3LoggedIn.set(true);

      const resp = await response.json();

      authenticated.set({ user: resp.user, loggedIn: true });

      toastStore.show('Successfully logged in', 'info');
    }

    // type Account = {
    //   username: string;
    //   admin: boolean;
    // };

    // const {username, admin}: Account = await response.json();

    return new Account('username', false);
  }

  private static async get_nonce(
    walletProvider: 'metamask' | 'coinbase' = 'metamask',
  ): Promise<string> {
    const provider = await Web3Provider.init(walletProvider);

    const urlPath = 'nonce';

    const response = await fetch(`${url}/${urlPath}`, {
      method: 'POST',
      body: JSON.stringify({
        wallet: await provider.userAddress(),
      }),
    });

    if (!response.ok) {
      console.error(response.text());
    }

    return await response.text();
  }

  static async log_out(): Promise<void> {
    await fetch(`${url}/logout`, {
      method: 'POST',
    });

    web3LoggedIn.set(false);
  }

  static async google_login(): Promise<void> {
    try {
      const response = await fetch(
        `${url}/google/login?redirect_uri=${domain}`,
        {
          method: 'GET',
        },
      );

      if (response.status === 307) {
        const resp = await response.json();

        window.location.href = resp.url;
      }

      if (!response.ok) {
        console.error(response.text());
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  static async signin(data: SignIn): Promise<void> {
    try {
      const response = await fetch(`${url}/signin`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const resp = await response.json();

      web3LoggedIn.set(true);
      authenticated.set({ user: resp.user, loggedIn: true });
      availables.set(resp.available);

      if (resp.message) {
        toastStore.show(resp.message, 'info');
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  static async setMainWallet(wallet: string): Promise<void> {
    try {
      const response = await fetch(`${url}/walletselect`, {
        method: 'POST',
        body: JSON.stringify({ wallet }),
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const resp = await response.json();

      authenticated.set({ user: resp.user, loggedIn: true });
    } catch (error: any) {
      console.error(error);
    }
  }

  static async me() {
    try {
      const response = await fetch(`${url}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const resp = await response.json();

      authenticated.set({ user: resp.user, loggedIn: true });
      availables.set(resp.available);
    } catch (error) {
      console.error(error);
    }
  }

  static async middlewareAuthme(): Promise<
    [User, Available | APIError] | null
  > {
    try {
      const response = await fetch(`${url}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(response.text());
        return null;
      }

      const resp = await response.json();

      return [resp.user, resp.available];
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  static async signupReferral(data: ReferralSignUp): Promise<void> {
    const response = await fetch(`${url}/referral/signup`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(response.text());
    }

    const resp = await response.json();

    authenticated.set({ user: resp.user, loggedIn: true });
  }

  static async signout(): Promise<void> {
    await Account.log_out();

    const response = await fetch(`${url}/signout`, {
      method: 'POST',
    });

    if (!response.ok) {
      console.error(response.text());
    }

    authenticated.set({ user: null, loggedIn: false });
    web3LoggedIn.set(false);
    window.open('/', '_self');
  }

  static async generateReferralCode(): Promise<void> {
    try {
      const response = await fetch(`${url}/referral/generate`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const referralC = await response.json();

      referralCodes.set(referralC.codes);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
    }
  }

  static async referraLCodes(): Promise<void> {
    try {
      const response = await fetch(`${url}/referral/get`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const referralC = await response.json();

      referralCodes.set(referralC.codes);
    } catch (error: any) {
      console.error(error);
    }
  }

  static async userReferralCode(code: string): Promise<void> {
    try {
      const response = await fetch(`${url}/referral/use?code=${code}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const referralC = await response.json();

      console.log(referralC.message);
    } catch (error: any) {
      console.error(error);
    }
  }

  static async validateReferralCode(
    code: string,
  ): Promise<ReferralCode | null> {
    try {
      const response = await fetch(`${url}/referral/validate?code=${code}`, {
        method: 'GET',
      });

      if (!response.ok) {
        // Log or handle the error as appropriate
        console.error(response.text());
        return null;
      }

      const referralC = await response.json();
      return referralC.referral as ReferralCode;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${url}/forgot-password?email=${email}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const resp = await response.json();

      console.log(resp.message);
    } catch (error: any) {
      console.error(error);
    }
  }

  static async resetPassword(data: ResetPassword): Promise<void> {
    try {
      const response = await fetch(`${url}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // console.error(response.text())
        toastStore.show('Error resetting password', 'error');
      }

      const resp = await response.json();

      toastStore.show(resp.message, 'info');
    } catch (error: any) {
      console.error(error);
    }
  }

  static async changePassword(data: ChangePassword): Promise<void> {
    try {
      const response = await fetch(`${url}/change-password`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // console.error(response.text())
        toastStore.show('Error changing password', 'error');
      }

      const resp = await response.json();

      console.log(resp.message);
    } catch (error: any) {
      console.error(error);
    }
  }

  static async confirmEmail(token: string): Promise<void> {
    try {
      const response = await fetch(`${url}/confirm-email?token=${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(response.text());
      }

      const resp = await response.json();

      console.log(resp.message);
    } catch (error: any) {
      console.error(error);
    }
  }

  static async subscribeNewsletter(): Promise<void> {
    try {
      const response = await fetch(`${url}/subscribe-newsletter`, {
        method: 'GET',
      });

      if (!response.ok) {
        new_error({ code: response.status, error: await response.text() });
      }

      const resp = await response.json();

      console.log(resp.message);
    } catch (error: any) {
      new_error({ code: 500, error: error });
    }
  }

  static async unsubscribeNewsletter(): Promise<void> {
    try {
      const response = await fetch(`${url}/unsubscribe-newsletter`, {
        method: 'GET',
      });

      if (!response.ok) {
        new_error({ code: response.status, error: await response.text() });
      }

      const resp = await response.json();

      console.log(resp.message);
    } catch (error: any) {
      new_error({ code: 500, error: error });
    }
  }

  static async subscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${url}/subscription-status`, {
        method: 'GET',
      });

      if (!response.ok) {
        new_error({ code: response.status, error: await response.text() });
      }

      const resp = await response.json() as SubscriptionStatus

      newsletterStatus.set(resp);
      
      return resp;
    } catch (error: any) {
      new_error({ code: 500, error: error });
      return { is_active: false, subscribed_at: null, unsubscribed_at: null };
    }
  }
}

export default Account;
