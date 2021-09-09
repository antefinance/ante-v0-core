import { Contract } from 'ethers';

export interface TestPoolDeployment {
  test: Contract;
  pool: Contract;
}

export interface ContractRecord {
  address: string;
  tx: string;
  args: any[];
}

export interface TestPoolRecord {
  test: ContractRecord;
  pool: ContractRecord;
}

export interface Deployment {
  commit: string;
  timestamp: number;
  contracts: Record<string, ContractRecord>;
  testPools: Record<string, TestPoolRecord>;
}

export interface DeployConstants {
  WETH: string;
  WBTC: string;
  USDC: string;
  USDT: string;
  ETH2: string;
  ETH_DEV: string;
}

export const deployConsts: Record<string, DeployConstants> = {
  mainnet: {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ETH2: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ETH_DEV: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  rinkeby: {
    // TODO: replace w/ rinkeby specific addresses
    WETH: '0xc778417e063141139fce010982780140aa0cd5ab',
    ETH2: '0xc778417e063141139fce010982780140aa0cd5ab', // just need an address with a lot of eth
    USDC: '0x7d66cde53cc0a169cae32712fc48934e610aef14',
    USDT: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad',
    ETH_DEV: '0xc778417e063141139fce010982780140aa0cd5ab', // just need an address with a lot of eth
    WBTC: '0x577d296678535e4903d59a4c929b718e1d575e0a',
  },
  hardhat: {
    // forked mainnet, so can use same config as mainnet
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ETH2: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ETH_DEV: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
};