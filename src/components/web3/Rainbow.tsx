import React, { useMemo } from 'react';

import {
  createAuthenticationAdapter,
  darkTheme,
  getDefaultConfig,
  type AuthenticationStatus,
  ConnectButton,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createSiweMessage } from 'viem/siwe';
import { WagmiProvider } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';

import { SetCache, USER_CACHE_KEY, TTL_HOUR } from '@constants/cache';
import { assetsURL } from '@constants/media';
import { authenticated } from '@stores/account.svelte';
import { AccountAPI, AuthAPI } from '@service/routes';

import '@rainbow-me/rainbowkit/styles.css';

const wagmiConfig = getDefaultConfig({
  appName: 'Degenerous DAO',
  appIcon: `${assetsURL}/logo.png`,
  appUrl: 'https://conexus.degenerousdao.com', // prod
  // appUrl: 'http://localhost:4321', // dev
  projectId: '0b8a3fac6220753a719b9aeceb8f19fb',
  chains: [mainnet, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
  pollingInterval: 12000, // How often (in ms) to poll for updates
});

const queryClient = new QueryClient();

const rkTheme = darkTheme({
  accentColor: 'rgb(51, 226, 230)',
  accentColorForeground: 'rgb(51, 226, 230)',
  borderRadius: 'large',
  fontStack: 'rounded',
  overlayBlur: 'large',
});

interface Web3Props {
  linking?: boolean;
  children: React.ReactNode;
}

const Web3Provider: React.FC<Web3Props> = ({ linking = false, children }) => {
  let AUTHENTICATION_STATUS: AuthenticationStatus = 'unauthenticated';

  const authAPI = useMemo(
    () => new AuthAPI(import.meta.env.PUBLIC_BACKEND),
    [],
  );
  const accountAPI = useMemo(
    () => new AccountAPI(import.meta.env.PUBLIC_BACKEND),
    [],
  );

  const authenticationAdapter = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const { data, error } = await authAPI.web3Getnonce();

          if (!data) {
            console.error('Failed to fetch nonce:', error);
            throw new Error('Failed to fetch nonce');
          }

          AUTHENTICATION_STATUS = 'loading';

          return data.nonce;
        },

        createMessage: ({ nonce, address, chainId }) => {
          if (!nonce || !address || !chainId) {
            console.error(
              'Missing required parameters for createSiweMessage:',
              {
                nonce,
                address,
                chainId,
              },
            );
            throw new Error('Missing parameters for creating the message');
          }

          try {
            return createSiweMessage({
              nonce,
              address,
              chainId,
              statement:
                'Welcome to CoNexus! Click to sign in and accept the Terms of Service: https://degenerousdao.com/legal/terms-of-service',
              domain: window.location.host,
              uri: window.location.origin,
              version: '1',
            });
          } catch (error) {
            console.error('Error creating SIWE message:', error);
            throw error;
          }
        },

        verify: async ({ message, signature }) => {
          let resp: APIResponse<{ user: User }>;

          if (linking) {
            resp = await accountAPI.web3WalletLink({
              message,
              signature,
            });
          } else {
            resp = await authAPI.web3WalletSignin({
              message,
              signature,
            });
          }

          const { data, error } = resp;

          if (!data) {
            console.error('Failed to verify signature:', error?.details);
            AUTHENTICATION_STATUS = 'unauthenticated';
            return false;
          }

          SetCache(USER_CACHE_KEY, data.user, TTL_HOUR);

          authenticated.set(data.user);

          AUTHENTICATION_STATUS = 'authenticated';

          window.location.reload();

          return true;
        },

        signOut: async () => {
          const { data, error } = await accountAPI.logout();

          if (!data) {
            console.error('Failed to sign out:', error);
            return;
          }

          authenticated.set(null);

          AUTHENTICATION_STATUS = 'unauthenticated';
        },
      }),
    [linking],
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={AUTHENTICATION_STATUS}
        >
          <RainbowKitProvider modalSize="wide" theme={rkTheme}>
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const RainbowConnect = (linking: boolean, title: string) => {
  return (
    <Web3Provider linking={linking}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      className={
                        title == 'with Web3 wallet' ? 'sign-button' : ''
                      }
                      onClick={openConnectModal}
                      type="button"
                    >
                      <img src="/icons/wallet.png" alt="Google" />
                      <p>{title}</p>
                    </button>
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  );
                }
                return (
                  <div>
                    <button onClick={openChainModal} type="button">
                      {chain.hasIcon && (
                        <div>
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                    <button onClick={openAccountModal} type="button">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </Web3Provider>
  );
};

export default RainbowConnect;
