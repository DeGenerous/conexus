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

import { SetCache, USER_KEY, TTL_HOUR } from '@constants/cache';
import { assetsURL } from '@constants/media';
import { NAV_ROUTES } from '@constants/routes';
import { authenticated } from '@stores/account.svelte';
import AuthenticationAPI from '@service/v2/authentication';

import '@rainbow-me/rainbowkit/styles.css';

const wagmiConfig = getDefaultConfig({
  appName: 'DGRS LABS',
  appIcon: `${assetsURL}/logo.png`,
  appUrl: import.meta.env.PUBLIC_FRONTEND,
  projectId: import.meta.env.PUBLIC_WAGMI_PROJECT_ID,
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
    () => new AuthenticationAPI(import.meta.env.PUBLIC_BACKEND),
    [],
  );
  // const accountAPI = useMemo(
  //   () => new AccountAPI(import.meta.env.PUBLIC_BACKEND),
  //   [],
  // );

  const authenticationAdapter = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const { status, message, data } = await authAPI.web3Getnonce();

          switch (status) {
            case 'error':
              console.error('Failed to fetch nonce:', message);
              throw new Error('Failed to fetch nonce');
            case 'success':
              if (!data) {
                console.error('Failed to fetch nonce:', message);
                throw new Error('Failed to fetch nonce');
              }
              return data;
            default:
              throw new Error('Unknown error occurred');
          }
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
              statement: `Welcome to CoNexus! Click to sign in and accept the Terms of Service: ${NAV_ROUTES.TERMS}`,
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
          let resp: APIResponse<User>;

          resp = await authAPI.web3WalletSignin({
            message,
            signature,
          });

          const { status, message: apiMessage, data } = resp;

          switch (status) {
            case 'error':
              console.error('Failed to verify signature:', apiMessage);
              AUTHENTICATION_STATUS = 'unauthenticated';
              return false;
            case 'success':
              if (!data) {
                console.error('Failed to verify signature:', apiMessage);
                AUTHENTICATION_STATUS = 'unauthenticated';
                return false;
              }
              SetCache(USER_KEY, data, TTL_HOUR);
              authenticated.set(data);
              AUTHENTICATION_STATUS = 'authenticated';
              window.location.reload();
              return true;
            default:
              throw new Error('Unknown error occurred');
          }
        },

        signOut: async () => {
          const { status, message } = await authAPI.logout();

          switch (status) {
            case 'error':
              console.error('Failed to sign out:', message);
              return;
            case 'success':
              authenticated.set(null);
              AUTHENTICATION_STATUS = 'unauthenticated';
              window.location.reload();
            default:
              console.error('Unknown error occurred while signing out');
          }
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
