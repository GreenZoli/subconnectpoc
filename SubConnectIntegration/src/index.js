import Onboard from '@subwallet-connect/core'
import injectedModule from '@subwallet-connect/injected-wallets'
import subwalletModule from '@subwallet-connect/subwallet';
import walletConnectModule from '@web3-onboard/walletconnect'
import PolkadotJsModule from '@subwallet-connect/polkadot-js'
import TalismanModule from '@subwallet-connect/talisman'

window.subConnect = {

  subConnectModal: null,
  wallets: null,
  appState: null,

  handleChange: async function (wallet) {

    const appStateChange = this.subConnectModal.state.get();
    DotNet.invokeMethodAsync('SubConnectIntegration', 'StateHasChanged',appStateChange.wallets[0].chains[0].id, appStateChange.wallets[0].accounts[0].address);
  },
  connect: async function () {

    if (this.subConnectModal != null) {
      this.wallets = await this.subConnectModal.connectWallet();

      return;
    }

    const wcInitOptions = {
      /**
       * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
       */
      projectId: 'abc123...',
      /**
       * Chains required to be supported by all wallets connecting to your DApp
       */
      requiredChains: [1],
      /**
       * Chains required to be supported by all wallets connecting to your DApp
       */
      optionalChains: [42161, 8453, 10, 137, 56],
      /**
       * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
       * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
       * To connect with WalletConnect
       */
      dappUrl: 'http://YourAwesomeDapp.com'
    };

    const injected = injectedModule();
    const subwalletWallet = subwalletModule();
    //const walletConnectWallet = walletConnectModule(wcInitOptions)
    const polkadotjs = PolkadotJsModule();
    const talisman = TalismanModule();

    const wallets = [injected, subwalletWallet, polkadotjs, talisman];

    const chains = [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: 'https://cloudflare-eth.com',
        namespace: 'evm'
      },
      {
        id: '0x38',
        token: 'BNB',
        label: 'Binance Smart Chain',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        namespace: 'evm'
      }
    ];

    const polkaChains = [
      //{
      //  id: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
      //  token: 'WND',
      //  decimal: 12,
      //  label: 'Westend',
      //  blockExplorerUrl: 'westend.subscan.io',
      //  namespace: 'substrate'
      //},
      //{
      //  id: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      //  namespace: 'substrate',
      //  token: 'DOT',
      //  label: 'Polkadot',
      //  blockExplorerUrl: `polkadot.api.subscan.io`,
      //  decimal: 10
      //},
      //{
      //  id: '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
      //  label: 'Polkadot Asset Hub',
      //  namespace: 'substrate',
      //  decimal: 10,
      //  token: 'DOT',
      //  blockExplorerUrl: 'assethub-polkadot.subscan.io',
      //},

      //{
      //  id: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
      //  label: 'Kusama',
      //  decimal: 12,
      //  namespace: 'substrate',
      //  token: 'KSM',
      //  blockExplorerUrl: 'kusama.api.subscan.io'
      //},

      //{
      //  id: '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
      //  label: 'Kusama Asset Hub',
      //  decimal: 12,
      //  namespace: 'substrate',
      //  token: 'KSM',
      //  blockExplorerUrl: 'assethub-kusama.subscan.io'
      //}
    ];

    const appMetadata = {
      name: 'Novalus Prime',
      icon: "./img/novalus-logo.svg", // svg string icon todo
      logo: "./img/novalus-logo.svg", // svg string logo todo
      description: 'Connect your wallet.',
      recommendedInjectedWallets: [
        { name: 'MetaMask', url: 'https://metamask.io' },
        { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
      ]
    };

    const notify = {
      desktop: {
        enabled: true,
        transactionHandler: transaction => {
          console.log({ transaction })
          if (transaction.eventCode === 'txPool') {
            return {
              type: 'success',
              message: 'Success',
            }
          }
        },
        position: 'bottomLeft'
      },
      mobile: {
        enabled: true,
        transactionHandler: transaction => {
          console.log({ transaction })
          if (transaction.eventCode === 'txPool') {
            return {
              type: 'success',
              message: 'Success',
            }
          }
        },
        position: 'topRight'
      }
    };

    const accountCenter = {
      desktop: {
        position: 'bottomRight',
        enabled: true,
        minimal: true
      },
      mobile: {
        position: 'bottomRight',
        enabled: true,
        minimal: true
      }
    };

    const modal = Onboard({
      //apiKey: 'xxx387fb-bxx1-4xxc-a0x3-9d37e426xxxx',
      //connect: {
      //  autoConnectLastWallet: true
      //},
      wallets: wallets,
      chains: chains,
      chainsPolkadot: polkaChains,
      appMetadata: appMetadata,
      notify: notify,
      accountCenter: accountCenter
    })

    this.subConnectModal = modal;
    this.wallets = await this.subConnectModal.connectWallet();
    if (!this.appState) {
      this.appState = this.subConnectModal.state.select("wallets");
      const { unsubscribe } = this.appState.subscribe(update =>
        this.handleChange(update)
      );
      this.handleChange(this.wallets);
    }
  },

  getAccount: async function () {

    console.log("Current account: ", this.wallets[0]);
    return this.wallets[0].accounts[0].address;
  },
  signMessage: async function (message) {
    var signedMessage = "";
    const provider = this.wallets[0].provider;
    if (provider != null && this.wallets[0].type == "evm") {
      signedMessage = await provider.request({
        method: "personal_sign",
        params: [message, this.wallets[0].accounts[0].address]
      });

    } else if (provider != null && this.wallets[0].type == "substrate") {
      const signer = this.wallets[0].signer;
      if (signer && signer.signRaw) {
        signedMessage = (await signer.signRaw({
          address: this.wallets[0].accounts[0].address,
          data: message,
          type: 'bytes'
        })).signature;
      }
    }
    return signedMessage;
  }

}
