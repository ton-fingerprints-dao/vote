import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isWalletInfoInjected, WalletInfoInjected } from "@tonconnect/sdk";
import {
  ChromeExtensionWalletProvider,
  TonConnection,
  TonhubProvider,
  TonWalletProvider,
} from "@ton-defi.org/ton-connection";
import { Address, Cell, CommentMessage, toNano } from "ton";
import { isMobile } from "react-device-detect";
import {
  CONTRACT_ADDRESS,
  LOCAL_STORAGE_PROVIDER,
  TX_FEE,
  walletAdapters,
} from "config";
import { WalletProvider, Provider, ConnectionStore, EndpointsArgs } from "types";
import TonConnect from "@tonconnect/sdk";
import _ from "lodash";
import { create } from "zustand";
import {manifestUrl} from 'config'
import { getClientV2, getClientV4 } from "contracts-api/logic";


export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  address: undefined,
  connection: undefined,
  connectorTC: new TonConnect({
    manifestUrl,
  }),
  clientV2: undefined,
  clientV4: undefined,
  setClients: (clientV2, clientV4) => set({ clientV2, clientV4 }),
  reset: () => set({ address: undefined, connection: undefined }),
  setAddress: (address) => set({ address }),
  setTonConnectionProvider: (provider) => {
    const _connection = new TonConnection();
    _connection.setProvider(provider);
    set({ connection: _connection });
  },
}));



export const useGetClients = () => {
  const setClients = useConnectionStore().setClients;

  return useMutation(async (args?: EndpointsArgs) => {
    const clientV2 = await getClientV2(args?.clientV2Endpoint, args?.apiKey);
    const clientV4 = await getClientV4(args?.clientV4Endpoint);
    setClients(clientV2, clientV4);
  });
};


export const useWallets = () => {
  const connector = useConnectionStore().connectorTC;

  return useQuery(
    [],
    async () => {
      return connector.getWallets();
    },
    {
      staleTime: Infinity,
    }
  );
};

export const useRestoreConnection = () => {
  const { selectWallet } = useOnWalletSelected();
  const connector = useConnectionStore().connectorTC;

  useEffect(() => {
    connector.restoreConnection();
    const provider = localStorage.getItem(LOCAL_STORAGE_PROVIDER);
    if (!provider) {
      return;
    }
    const walletAdapter = walletAdapters.find((it) => it.type === provider);
    if (walletAdapter) {
      selectWallet(walletAdapter);
    }
  }, []);
};

export const useConnectionEvenSubscription = () => {
  const { setAddress } = useConnectionStore();
  const connector = useConnectionStore().connectorTC;

  useEffect(() => {
    connector.onStatusChange((walletInfo) => {
      const address = walletInfo?.account.address;
      const friendlyAddress = address
        ? Address.parse(address).toFriendly()
        : "";
      setAddress(friendlyAddress);
    });
  }, []);
};

export const useEmbededWallet = () => {
  const wallets = useWallets().data;
  const connector = useConnectionStore().connectorTC;

  useEffect(() => {
    const embeddedWallet = wallets?.find(
      (wallet) => isWalletInfoInjected(wallet) && wallet.embedded
    ) as WalletInfoInjected;

    if (embeddedWallet) {
      connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey });
    }
  }, []);
};



export const useOnWalletSelected = () => {
  const [session, setSession] = useState("");
  const { setTonConnectionProvider, setAddress } = useConnectionStore();
  const [walletInfo, setWalletInfo] = useState<
    { name: string; icon: string } | undefined
  >();
  const [showQR, setShowQR] = useState(false);

  const reset = () => {
    setSession("");
    setWalletInfo(undefined);
  };

  const connector = useConnectionStore().connectorTC;

  const onSessionLinkReady = (link: string) => {
    if (isMobile) {
      (window as any).location = link;
    } else {
      setSession(link);
    }
  };

  const onShowQr = () => {
    if (!isMobile) {
      setShowQR(true);
    }
  };

  const selectWalletTC = (wallet: any) => {
    setWalletInfo({ name: wallet.name, icon: wallet.imageUrl });
    try {
      try {
        const walletConnectionSource = {
          jsBridgeKey: wallet.jsBridgeKey,
        };
        connector.connect(walletConnectionSource);
      } catch (error) {
        const walletConnectionSource = {
          universalLink: wallet.universalLink,
          bridgeUrl: wallet.bridgeUrl,
        };

        const _session = connector.connect(walletConnectionSource);
        onSessionLinkReady(_session);
        onShowQr();
      }
    } catch (error) {
      if (isMobile) {
        (window as any).location = wallet.aboutUrl;
      } else {
        window.open(wallet.aboutUrl);
      }
    }
  };

  const selectWallet = async (wallet: WalletProvider) => {
    let tonWalletProvider: TonWalletProvider | undefined;
    setWalletInfo({ name: wallet.title, icon: wallet.icon });

    if (wallet.type === Provider.EXTENSION) {
      tonWalletProvider = new ChromeExtensionWalletProvider();
    } else if (wallet.type === Provider.TONHUB) {
      tonWalletProvider = new TonhubProvider({
        onSessionLinkReady,
        persistenceProvider: window.localStorage,
      });

      onShowQr();
    }

    if (!tonWalletProvider) {
      return;
    }
    setTonConnectionProvider(tonWalletProvider);
    const _wallet = await tonWalletProvider.connect();
    setAddress(_wallet.address);
    localStorage.setItem(LOCAL_STORAGE_PROVIDER, wallet.type);
  };

  return {
    selectWalletTC,
    session,
    selectWallet,
    reset,
    walletInfo,
    showQR,
    hideQR: () => setShowQR(false),
  };
};

export const useResetConnection = () => {
  const reset = useConnectionStore().reset;
  const connection = useConnectionStore().connection;
  const connector = useConnectionStore().connectorTC;
  return () => {
    if (connection) connection.disconnect();
    localStorage.removeItem(LOCAL_STORAGE_PROVIDER);
    if (connector.connected) {
      connector.disconnect();
    }
    reset();
  };
};

export const useGetTransaction = () => {
  const { connectorTC, connection } = useConnectionStore();

  return async (contractAddress: string, vote: string, onSuccess: () => void) => {
    const cell = new Cell();
    new CommentMessage(vote).writeTo(cell);

    if (connectorTC.connected) {
      handleMobileLink(connectorTC);

      await connectorTC.sendTransaction({
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: contractAddress,
            amount: toNano(TX_FEE).toString(),
            stateInit: undefined,
            payload: cell ? cell.toBoc().toString("base64") : undefined,
          },
        ],
      });
      onSuccess();
      return;
    }
    if (!connection) return;

    const isExtension =
      (connection as any)._provider instanceof ChromeExtensionWalletProvider;

    if (isMobile || isExtension) {
      await connection?.requestTransaction({
        to: Address.parse(contractAddress),
        value: toNano(TX_FEE),
        message: cell,
      });
      onSuccess();
    } else {
      return connection?.requestTransaction(
        {
          to: Address.parse(contractAddress),
          value: toNano(TX_FEE),
          message: cell,
        },
        onSuccess
      );
    }
  };
};

const handleMobileLink = (connectorTC?: TonConnect) => {
  if (!isMobile) return;
  const Tonkeeper = connectorTC?.wallet?.device.appName;

  switch (Tonkeeper) {
    case "Tonkeeper":
      (window as any).location = "https://app.tonkeeper.com";
      break;

    default:
      break;
  }
};
