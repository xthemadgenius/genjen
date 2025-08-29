export interface Membership {
  id: string;
  name: string;
  price: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipResponse {
  id: string;
  name: string;
  price: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipRequest {
  name: string;
  price: number;
  features: string[];
}

export interface UpdateMembershipRequest {
  name?: string;
  price?: number;
  features?: string[];
}

export interface AssignMembershipRequest {
  userId: string;
  membershipTierId: string;
}

export interface UserMembershipResponse {
  userId: string;
  membershipTier: MembershipResponse | null;
  assignedAt: string | null;
}

// Pre-defined membership tiers
export const DEFAULT_MEMBERSHIP_TIERS = [
  {
    id: '1',
    name: 'Tier 1 - Basic',
    price: 0,
    features: [
      'Basic access to platform',
      'Standard support',
      'Community forum access'
    ]
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
    ]
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
    ]
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
    ]
  }
];