import { BrowserProvider } from 'ethers';
import detectProvider from '@metamask/detect-provider';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

export class Web3Provider {
  #provider: BrowserProvider;

  constructor(provider: BrowserProvider) {
    this.#provider = provider;
  }

  static async init(
    preferredWallet: 'metamask' | 'coinbase',
  ): Promise<Web3Provider> {
    let ethereumProvider: any;

    // Detect MetaMask
    const metamaskProvider = (await detectProvider()) as any;

    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = createCoinbaseWalletSDK({
      appName: 'Degenerous DAO',
      appLogoUrl: 'https://media.degenerousdao.com/assets/logo.png',
      // appChainIds: [8453],
      preference: {
        options: 'smartWalletOnly',
        attribution: {
          auto: true,
        },
      },
    });

    const coinbaseProvider = coinbaseWallet.getProvider();

    if (preferredWallet === 'metamask') {
      if (metamaskProvider) {
        ethereumProvider = metamaskProvider;
      } else if (coinbaseProvider) {
        ethereumProvider = coinbaseProvider;
      } else {
        throw new Error('No wallet detected.');
      }
    } else if (preferredWallet === 'coinbase') {
      ethereumProvider = coinbaseWallet.getProvider();
    } else {
      throw new Error('Unsupported wallet selected.');
    }

    // Request user accounts to ensure permission
    await ethereumProvider.request({ method: 'eth_requestAccounts' });

    const provider = new BrowserProvider(ethereumProvider, 'any');

    return new Web3Provider(provider);
  }

  async userAddress(): Promise<string> {
    const signer = await this.#provider.getSigner();

    return signer.getAddress();
  }

  async sign(message: string) {
    const signer = await this.#provider.getSigner();

    return signer.signMessage(message);
  }
}
