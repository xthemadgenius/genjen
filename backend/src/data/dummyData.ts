import { User } from '../models/User';
import { Membership } from '../models/Membership';

// Base blockchain constants
export const BASE_CHAIN = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org'
};

// Dummy membership tiers (same as before)
export const DUMMY_MEMBERSHIPS: Membership[] = [
  {
    id: '1',
    name: 'Tier 1 - Basic',
    price: 0,
    features: [
      'Basic access to platform',
      'Standard support',
      'Community forum access'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2', 
    name: 'Tier 2 - Pro',
    price: 29.99,
    features: [
      'All Basic features',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom integrations'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Tier 3 - Premium', 
    price: 79.99,
    features: [
      'All Pro features',
      'White-label solution',
      'Dedicated account manager',
      'Custom reporting',
      'Advanced security features',
      'Multi-chain wallet support'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Tier 4 - Enterprise',
    price: 199.99,
    features: [
      'All Premium features',
      'Unlimited API calls',
      'Custom development',
      'SLA guarantee',
      'On-premise deployment',
      'Advanced compliance tools',
      'Dedicated infrastructure'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 6 Dummy users - email-first registration with generated Base wallets
export const DUMMY_USERS: User[] = [
  {
    id: 'usr_01jhq2x8y9z1a2b3c4d5e6f7g8h9',
    email: 'alex.chen@example.com',
    username: 'alexchen',
    name: {
      first_name: 'Alex',
      last_name: 'Chen'
    },
    walletAddress: '0x742d35Cc6634C0532925a3b8D48e67c8b0c2b618',
    ensName: 'alexchen.base.eth',
    membershipTierId: '3', // Premium tier
    membershipAssignedAt: new Date(),
    isWalletVerified: true,
    walletType: 'WalletConnect', // Generated wallet
    lastWalletConnection: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usr_02jhq2x8y9z1a2b3c4d5e6f7g8h9',
    email: 'sarah.rodriguez@example.com',
    username: 'sarahrod',
    name: {
      first_name: 'Sarah',
      last_name: 'Rodriguez'
    },
    walletAddress: '0x1a2B3c4D5e6F789012345678901234567890abcD',
    ensName: undefined,
    membershipTierId: '4', // Enterprise tier
    membershipAssignedAt: new Date(),
    isWalletVerified: true,
    walletType: 'WalletConnect', // Generated wallet
    lastWalletConnection: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usr_03jhq2x8y9z1a2b3c4d5e6f7g8h9',
    email: 'marcus.johnson@example.com',
    username: 'marcusj',
    name: {
      first_name: 'Marcus',
      last_name: 'Johnson'
    },
    walletAddress: '0x9876543210987654321098765432109876543210',
    ensName: 'marcusj.base.eth',
    membershipTierId: '2', // Pro tier
    membershipAssignedAt: new Date(),
    isWalletVerified: true,
    walletType: 'WalletConnect', // Generated wallet
    lastWalletConnection: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usr_04jhq2x8y9z1a2b3c4d5e6f7g8h9',
    email: 'emma.thompson@example.com',
    username: 'emmat',
    name: {
      first_name: 'Emma',
      last_name: 'Thompson'
    },
    walletAddress: '0xDeadBeef123456789abcdef123456789abcdef12',
    ensName: undefined,
    membershipTierId: '1', // Basic tier
    membershipAssignedAt: new Date(),
    isWalletVerified: false, // Wallet generated but not verified yet
    walletType: 'WalletConnect', // Generated wallet
    lastWalletConnection: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usr_05jhq2x8y9z1a2b3c4d5e6f7g8h9',
    email: 'david.kumar@example.com',
    username: 'davidk',
    name: {
      first_name: 'David',
      last_name: 'Kumar'
    },
    walletAddress: '0x123456789abcdef123456789abcdef123456789a',
    ensName: 'davidk.base.eth',
    membershipTierId: '3', // Premium tier
    membershipAssignedAt: new Date(),
    isWalletVerified: true,
    walletType: 'WalletConnect', // Generated wallet
    lastWalletConnection: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'usr_06jhq2x8y9z1a2b3c4d5e6f7g8h9',
    email: 'lisa.park@example.com',
    username: 'lisap',
    name: {
      first_name: 'Lisa',
      last_name: 'Park'
    },
    walletAddress: '0xabcdef123456789abcdef123456789abcdef1234',
    ensName: undefined,
    membershipTierId: '2', // Pro tier
    membershipAssignedAt: new Date(),
    isWalletVerified: true,
    walletType: 'WalletConnect', // Generated wallet
    lastWalletConnection: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions for dummy data
export const getDummyUserByWallet = (walletAddress: string): User | undefined => {
  return DUMMY_USERS.find(user => 
    user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
  );
};

export const getDummyMembershipById = (id: string): Membership | undefined => {
  return DUMMY_MEMBERSHIPS.find(membership => membership.id === id);
};

export const getDummyUsersByTier = (membershipTierId: string): User[] => {
  return DUMMY_USERS.filter(user => user.membershipTierId === membershipTierId);
};

// Summary stats for the dummy data
export const DUMMY_DATA_STATS = {
  totalUsers: DUMMY_USERS.length,
  verifiedUsers: DUMMY_USERS.filter(u => u.isWalletVerified).length,
  usersWithENS: DUMMY_USERS.filter(u => u.ensName).length,
  tierDistribution: {
    basic: getDummyUsersByTier('1').length,
    pro: getDummyUsersByTier('2').length,
    premium: getDummyUsersByTier('3').length,
    enterprise: getDummyUsersByTier('4').length
  },
  walletTypes: {
    MetaMask: DUMMY_USERS.filter(u => u.walletType === 'MetaMask').length,
    'Coinbase Wallet': DUMMY_USERS.filter(u => u.walletType === 'Coinbase Wallet').length,
    WalletConnect: DUMMY_USERS.filter(u => u.walletType === 'WalletConnect').length,
    Rainbow: DUMMY_USERS.filter(u => u.walletType === 'Rainbow').length,
    Frame: DUMMY_USERS.filter(u => u.walletType === 'Frame').length
  }
};