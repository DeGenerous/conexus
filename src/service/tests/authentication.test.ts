import { describe, it, expect, beforeEach, vi } from 'vitest';

import AuthenticationAPI from '../authentication';

const mockRequest = vi.fn();

class MockAuthenticationAPI extends AuthenticationAPI {
  request = mockRequest;
}

describe('AuthenticationAPI', () => {
  let api: MockAuthenticationAPI;

  beforeEach(() => {
    api = new MockAuthenticationAPI();
    mockRequest.mockReset();
  });

  it('signin posts credentials', async () => {
    await api.signin('user@test.com', 'secret');
    expect(mockRequest).toHaveBeenCalledWith('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@test.com', password: 'secret' }),
    });
  });

  it('signup posts payload', async () => {
    const payload = { email: 'user@test.com' } as any;
    await api.signup(payload);
    expect(mockRequest).toHaveBeenCalledWith('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('validateReferralCode issues query request', async () => {
    await api.validateReferralCode('CODE');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/validate-referral-code?code=CODE',
    );
  });

  it('forgotPassword posts email', async () => {
    await api.forgotPassword('user@test.com');
    expect(mockRequest).toHaveBeenCalledWith('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@test.com' }),
    });
  });

  it('resetPassword posts token and password', async () => {
    await api.resetPassword('user@test.com', 'token', 'newpass');
    expect(mockRequest).toHaveBeenCalledWith('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@test.com',
        token: 'token',
        password: 'newpass',
      }),
    });
  });

  it('googleSignin fetches OAuth URL', async () => {
    await api.googleSignin();
    expect(mockRequest).toHaveBeenCalledWith('/auth/google-signin');
  });

  it('web3Getnonce fetches nonce', async () => {
    await api.web3Getnonce();
    expect(mockRequest).toHaveBeenCalledWith('/auth/web3-get-nonce');
  });

  it('web3WalletSignin posts signin payload', async () => {
    const signin = { address: '0x0', signature: 'sig', nonce: 'nonce' } as any;
    await api.web3WalletSignin(signin);
    expect(mockRequest).toHaveBeenCalledWith('/auth/web3-wallet-signin', {
      method: 'POST',
      body: JSON.stringify(signin),
    });

    mockRequest.mockClear();
    await api.web3WalletSignin(signin, true);
    expect(mockRequest).toHaveBeenCalledWith('/auth/web3-wallet-link', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  });

  it('web3SelectWallet posts wallet address', async () => {
    await api.web3SelectWallet('0xabc');
    expect(mockRequest).toHaveBeenCalledWith('/auth/web3-select-wallet', {
      method: 'POST',
      body: JSON.stringify({ wallet: '0xabc' }),
    });
  });

  it('web3UnlinkWallet posts wallet address', async () => {
    await api.web3UnlinkWallet('0xabc');
    expect(mockRequest).toHaveBeenCalledWith('/auth/web3-unlink-wallet', {
      method: 'POST',
      body: JSON.stringify({ wallet: '0xabc' }),
    });
  });

  it('logout hits signout endpoint', async () => {
    await api.logout();
    expect(mockRequest).toHaveBeenCalledWith('/auth/signout');
  });
});
