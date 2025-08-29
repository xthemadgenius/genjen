export interface User {
  id: string;
  email: string;
  username: string;
  name?: {
    first_name: string;
    last_name: string;
  };
  phone?: string;
  address?: string;
  walletAddress?: string;
  ensName?: string;
  membershipTierId: string;
  membershipAssignedAt: string;
  isWalletVerified: boolean;
  walletType: string;
  lastWalletConnection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  name?: {
    first_name: string;
    last_name: string;
  };
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  username?: string;
  name?: {
    first_name: string;
    last_name: string;
  };
  email?: string;
  phone?: string;
  address?: string;
  ensName?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  name?: {
    first_name: string;
    last_name: string;
  };
  phone?: string;
  address?: string;
  walletAddress?: string;
  ensName?: string;
  membershipTier?: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  membershipAssignedAt: string;
  isWalletVerified: boolean;
  walletType: string;
  lastWalletConnection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserResponse {
  success: boolean;
  user: UserResponse;
  message: string;
  nextStep: 'generate_wallet';
}

export const BASE_CHAIN = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org'
} as const;

export const SUPPORTED_WALLET_TYPES = [
  'MetaMask',
  'Coinbase Wallet', 
  'WalletConnect',
  'Rainbow',
  'Frame'
] as const;

export type WalletType = typeof SUPPORTED_WALLET_TYPES[number];