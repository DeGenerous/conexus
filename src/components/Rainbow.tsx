import React from 'react';

import {
  getDefaultConfig,
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import '@rainbow-me/rainbowkit/styles.css';

const Web3Provider = ({ children }) => {
  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: '0b8a3fac6220753a719b9aeceb8f19fb',
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false, // If your dApp uses server side rendering (SSR)
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          // modalSize="compact"
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const App = () => {
  return (
    <Web3Provider>
      <ConnectButton
        label="with Wallet Connect"
        showBalance={false}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </Web3Provider>
  );
};

export const YourApp = () => {
  return (
    <Web3Provider>
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
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} type="button">
                      Connect Wallet
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
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
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
