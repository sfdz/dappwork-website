import type { AddEthereumChainParameter } from '@web3-react/types';

interface BasicChainInformation {
    urls: string[]
    name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
    nativeCurrency: AddEthereumChainParameter['nativeCurrency']
    blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export const CHAINS: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
    42: {
        urls: ["https://kovan.infura.io/v3/0dfa29e50e11402a9014a2a0c9346003"].filter(
          (url) => url !== undefined
        ),
        name: 'Kovan',
    },
};

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
    (accumulator, chainId) => {
        const validURLs: string[] = CHAINS[Number(chainId)].urls

        if (validURLs.length) {
            accumulator[Number(chainId)] = validURLs
        }

        return accumulator
    },
    {}
);