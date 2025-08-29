import { Request, Response } from 'express';
import { 
  User, 
  CreateUserRequest,
  WalletGeneratedRequest,
  UpdateUserRequest, 
  UserResponse,
  CreateUserResponse,
  WalletGeneratedResponse,
  BASE_CHAIN,
  SUPPORTED_WALLET_TYPES 
} from '../models/User';
import { getSupabaseClient, isSupabaseEnabled } from '../utils/supabaseClient';
import { getPostgresPool, isPostgresEnabled, postgresQuery, formatPostgresUser } from '../utils/postgresClient';
import { DUMMY_USERS, DUMMY_MEMBERSHIPS, getDummyUserByWallet, getDummyMembershipById } from '../data/dummyData';
import { verifyWalletSignature, isValidEthereumAddress } from '../utils/walletUtils';
import { v4 as uuidv4 } from 'uuid';

// Use dummy data for in-memory storage
export let inMemoryUsers: User[] = [...DUMMY_USERS];

// Database priority: Supabase > PostgreSQL > In-memory
const getDatabaseMode = (): 'supabase' | 'postgres' | 'memory' => {
  if (isSupabaseEnabled()) return 'supabase';
  if (isPostgresEnabled()) return 'postgres';
  return 'memory';
};

const formatUserResponse = (user: User): UserResponse => {
  const membershipTier = getDummyMembershipById(user.membershipTierId);
  
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    walletAddress: user.walletAddress,
    ensName: user.ensName,
    membershipTier: membershipTier ? {
      id: membershipTier.id,
      name: membershipTier.name,
      price: membershipTier.price,
      features: membershipTier.features
    } : undefined,
    membershipAssignedAt: user.membershipAssignedAt.toISOString(),
    isWalletVerified: user.isWalletVerified,
    walletType: user.walletType,
    lastWalletConnection: user.lastWalletConnection?.toISOString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'supabase') {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = users?.map(user => formatUserResponse({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        walletAddress: user.wallet_address,
        ensName: user.ens_name,
        membershipTierId: user.membership_tier_id,
        membershipAssignedAt: new Date(user.membership_assigned_at),
        isWalletVerified: user.is_wallet_verified,
        walletType: user.wallet_type,
        lastWalletConnection: user.last_wallet_connection ? new Date(user.last_wallet_connection) : undefined,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      })) || [];

      res.json({ users: formattedUsers });
    } else if (dbMode === 'postgres') {
      const result = await postgresQuery(
        'SELECT * FROM users ORDER BY created_at DESC'
      );
      
      const formattedUsers = result.rows.map(formatPostgresUser);
      res.json({ users: formattedUsers });
    } else {
      const formattedUsers = inMemoryUsers.map(formatUserResponse);
      res.json({ 
        users: formattedUsers,
        total: formattedUsers.length,
        blockchain: BASE_CHAIN.name,
        chainId: BASE_CHAIN.chainId
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dbMode = getDatabaseMode();

    if (dbMode === 'supabase') {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        throw error;
      }

      const formattedUser = formatUserResponse({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        walletAddress: user.wallet_address,
        ensName: user.ens_name,
        membershipTierId: user.membership_tier_id,
        membershipAssignedAt: new Date(user.membership_assigned_at),
        isWalletVerified: user.is_wallet_verified,
        walletType: user.wallet_type,
        lastWalletConnection: user.last_wallet_connection ? new Date(user.last_wallet_connection) : undefined,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      });

      res.json({ user: formattedUser });
    } else if (dbMode === 'postgres') {
      const result = await postgresQuery(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const formattedUser = formatPostgresUser(result.rows[0]);
      res.json({ user: formattedUser });
    } else {
      const user = inMemoryUsers.find(u => u.id === id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ user: formatUserResponse(user) });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Register new user with email and username (Step 1 of 2)
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, name }: CreateUserRequest = req.body;

    if (!email || !username) {
      res.status(400).json({ error: 'Email and username are required' });
      return;
    }

    const dbMode = getDatabaseMode();

    if (dbMode === 'supabase') {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      // Check for existing email or username
      const { data: existing } = await supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${email},username.eq.${username}`);

      if (existing && existing.length > 0) {
        const existingUser = existing[0];
        if (existingUser.email === email) {
          res.status(409).json({ error: 'Email already exists' });
          return;
        }
        if (existingUser.username === username) {
          res.status(409).json({ error: 'Sorry username is taken or unavailable' });
          return;
        }
      }

      const { data: user, error } = await supabase
        .from('users')
        .insert([{ 
          email, 
          username, 
          name: name || null,
          wallet_address: '',
          membership_tier_id: '1',
          membership_assigned_at: new Date().toISOString(),
          is_wallet_verified: false,
          wallet_type: 'WalletConnect'
        }])
        .select()
        .single();

      if (error) throw error;

      const response: CreateUserResponse = {
        success: true,
        user: formatUserResponse({
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          walletAddress: user.wallet_address,
          ensName: user.ens_name,
          membershipTierId: user.membership_tier_id,
          membershipAssignedAt: new Date(user.membership_assigned_at),
          isWalletVerified: user.is_wallet_verified,
          walletType: user.wallet_type,
          lastWalletConnection: user.last_wallet_connection ? new Date(user.last_wallet_connection) : undefined,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at)
        }),
        message: 'User registered successfully. Next step: generate wallet.',
        nextStep: 'generate_wallet'
      };

      res.status(201).json(response);
    } else if (dbMode === 'postgres') {
      // Check for existing email or username
      const existingResult = await postgresQuery(
        'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingResult.rows.length > 0) {
        const existing = existingResult.rows[0];
        if (existing.email === email) {
          res.status(409).json({ error: 'Email already exists' });
          return;
        }
        if (existing.username === username) {
          res.status(409).json({ error: 'Sorry username is taken or unavailable' });
          return;
        }
      }

      const result = await postgresQuery(
        'INSERT INTO users (email, username, name, wallet_address, membership_tier_id, membership_assigned_at, is_wallet_verified, wallet_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [email, username, name ? JSON.stringify(name) : null, '', '1', new Date(), false, 'WalletConnect']
      );

      const newUser = formatPostgresUser(result.rows[0]);
      const response: CreateUserResponse = {
        success: true,
        user: newUser,
        message: 'User registered successfully. Next step: generate wallet.',
        nextStep: 'generate_wallet'
      };

      res.status(201).json(response);
    } else {
      // Check for existing email or username in memory
      const existingUser = inMemoryUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() || 
        u.username.toLowerCase() === username.toLowerCase()
      );

      if (existingUser) {
        if (existingUser.email.toLowerCase() === email.toLowerCase()) {
          res.status(409).json({ error: 'Email already exists' });
          return;
        }
        if (existingUser.username.toLowerCase() === username.toLowerCase()) {
          res.status(409).json({ error: 'Sorry username is taken or unavailable' });
          return;
        }
      }

      const newUser: User = {
        id: uuidv4(),
        email,
        username,
        name,
        walletAddress: '', // Will be generated in next step
        membershipTierId: '1',
        membershipAssignedAt: new Date(),
        isWalletVerified: false,
        walletType: 'WalletConnect',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inMemoryUsers.push(newUser);

      const response: CreateUserResponse = {
        success: true,
        user: formatUserResponse(newUser),
        message: 'User registered successfully. Next step: generate wallet.',
        nextStep: 'generate_wallet'
      };

      res.status(201).json(response);
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Generate wallet for registered user (Step 2 of 2)
export const generateWallet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, walletAddress, signature, message }: WalletGeneratedRequest = req.body;

    if (!userId || !walletAddress || !signature || !message) {
      res.status(400).json({ error: 'User ID, wallet address, signature, and message are required' });
      return;
    }

    if (!isValidEthereumAddress(walletAddress)) {
      res.status(400).json({ error: 'Invalid wallet address' });
      return;
    }

    // Verify wallet signature
    const isValidSignature = await verifyWalletSignature({
      message,
      signature,
      walletAddress
    });

    if (!isValidSignature) {
      res.status(401).json({ error: 'Invalid wallet signature' });
      return;
    }

    const dbMode = getDatabaseMode();

    if (dbMode === 'supabase') {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      const { data: user, error } = await supabase
        .from('users')
        .update({ 
          wallet_address: walletAddress,
          is_wallet_verified: true,
          last_wallet_connection: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        throw error;
      }

      const response: WalletGeneratedResponse = {
        success: true,
        user: formatUserResponse({
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          walletAddress: user.wallet_address,
          ensName: user.ens_name,
          membershipTierId: user.membership_tier_id,
          membershipAssignedAt: new Date(user.membership_assigned_at),
          isWalletVerified: user.is_wallet_verified,
          walletType: user.wallet_type,
          lastWalletConnection: user.last_wallet_connection ? new Date(user.last_wallet_connection) : undefined,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at)
        }),
        walletGenerated: true,
        message: 'Wallet generated and verified successfully'
      };

      res.json(response);
    } else if (dbMode === 'postgres') {
      const result = await postgresQuery(
        'UPDATE users SET wallet_address = $1, is_wallet_verified = $2, last_wallet_connection = $3, updated_at = $4 WHERE id = $5 RETURNING *',
        [walletAddress, true, new Date(), new Date(), userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const updatedUser = formatPostgresUser(result.rows[0]);
      const response: WalletGeneratedResponse = {
        success: true,
        user: updatedUser,
        walletGenerated: true,
        message: 'Wallet generated and verified successfully'
      };

      res.json(response);
    } else {
      const userIndex = inMemoryUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = inMemoryUsers[userIndex];
      user.walletAddress = walletAddress;
      user.isWalletVerified = true;
      user.lastWalletConnection = new Date();
      user.updatedAt = new Date();

      const response: WalletGeneratedResponse = {
        success: true,
        user: formatUserResponse(user),
        walletGenerated: true,
        message: 'Wallet generated and verified successfully'
      };

      res.json(response);
    }
  } catch (error) {
    console.error('Error generating wallet:', error);
    res.status(500).json({ error: 'Failed to generate wallet' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, name, email, ensName }: UpdateUserRequest = req.body;

    if (isSupabaseEnabled()) {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      const updateData: any = {};
      if (username) updateData.username = username;
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (ensName !== undefined) updateData.ens_name = ensName;
      updateData.updated_at = new Date().toISOString();

      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        throw error;
      }

      const formattedUser = formatUserResponse({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        walletAddress: user.wallet_address,
        ensName: user.ens_name,
        membershipTierId: user.membership_tier_id,
        membershipAssignedAt: new Date(user.membership_assigned_at),
        isWalletVerified: user.is_wallet_verified,
        walletType: user.wallet_type,
        lastWalletConnection: user.last_wallet_connection ? new Date(user.last_wallet_connection) : undefined,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      });

      res.json({ user: formattedUser });
    } else {
      const userIndex = inMemoryUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = inMemoryUsers[userIndex];
      if (username) user.username = username;
      if (name) user.name = name;
      if (email) user.email = email;
      if (ensName !== undefined) user.ensName = ensName;
      user.updatedAt = new Date();

      res.json({ user: formatUserResponse(user) });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isSupabaseEnabled()) {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(204).send();
    } else {
      const userIndex = inMemoryUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      inMemoryUsers.splice(userIndex, 1);
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};