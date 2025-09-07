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

  it('should call request with correct params for signin', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    await api.signin(email, password);
    expect(api.request).toHaveBeenCalledWith('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  });

  it('should call request with correct params for signup', async () => {
    const user = {
      email: 'test@example.com',
      password: 'pass',
      referralCode: 'ABC123',
    };
    await api.signup(user as any);
    expect(api.request).toHaveBeenCalledWith('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  });

  it('should call request with correct params for validateReferralCode', async () => {
    const code = 'REFCODE';
    await api.validateReferralCode(code);
    expect(api.request).toHaveBeenCalledWith(
      `/account/validate-referral-code?code=${code}`,
    );
  });

  it('should call request with correct params for forgotPassword', async () => {
    const email = 'forgot@example.com';
    await api.forgotPassword(email);
    expect(api.request).toHaveBeenCalledWith('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  });

  it('should call request with correct params for resetPassword', async () => {
    const email = 'reset@example.com';
    const token = 'token123';
    const password = 'newpass';
    await api.resetPassword(email, token, password);
    expect(api.request).toHaveBeenCalledWith('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  });

  it('should call request with correct params for googleSignin', async () => {
    await api.googleSignin();
    expect(api.request).toHaveBeenCalledWith('/auth/google-signin');
  });

  it('should call request with correct params for web3Getnonce', async () => {
    await api.web3Getnonce();
    expect(api.request).toHaveBeenCalledWith('/auth/web3-get-nonce');
  });

  it('should call request with correct params for web3WalletSignin', async () => {
    const signin = { address: '0x123', signature: 'sig', nonce: 'nonce' };
    await api.web3WalletSignin(signin as any);
    expect(api.request).toHaveBeenCalledWith('/auth/web3-wallet-signin', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  });

  it('should call request with correct params for logout', async () => {
    await api.logout();
    expect(api.request).toHaveBeenCalledWith('/auth/logout');
  });
});
