import { Request, Response } from 'express';
import { 
  Membership, 
  MembershipResponse, 
  CreateMembershipRequest, 
  UpdateMembershipRequest,
  AssignMembershipRequest,
  UserMembershipResponse,
  DEFAULT_MEMBERSHIP_TIERS
} from '../models/Membership';
import { 
  postgresQuery, 
  isPostgresEnabled, 
  formatPostgresMembership,
  formatPostgresMembershipToModel,
  formatPostgresUser
} from '../utils/postgresClient';
import { getSupabaseClient, isSupabaseEnabled } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for memberships when databases are not available
let inMemoryMemberships: Membership[] = DEFAULT_MEMBERSHIP_TIERS.map(tier => ({
  ...tier,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const getDatabaseMode = (): 'supabase' | 'postgres' | 'memory' => {
  if (isSupabaseEnabled()) return 'supabase';
  if (isPostgresEnabled()) return 'postgres';
  return 'memory';
};

const formatMembershipResponse = (membership: Membership): MembershipResponse => ({
  id: membership.id,
  name: membership.name,
  price: membership.price,
  features: membership.features,
  createdAt: membership.createdAt.toISOString(),
  updatedAt: membership.updatedAt.toISOString()
});

export const getMemberships = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      const result = await postgresQuery('SELECT * FROM memberships ORDER BY price ASC');
      const memberships = result.rows.map(formatPostgresMembership);
      res.json({ memberships });
    } else if (dbMode === 'supabase') {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');
      
      // Note: In a real implementation, you'd also create memberships table in Supabase
      // For now, return in-memory data as fallback
      const formattedMemberships = inMemoryMemberships.map(formatMembershipResponse);
      res.json({ memberships: formattedMemberships });
    } else {
      const formattedMemberships = inMemoryMemberships.map(formatMembershipResponse);
      res.json({ memberships: formattedMemberships });
    }
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
  }
};

export const getMembershipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      const result = await postgresQuery('SELECT * FROM memberships WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      const membership = formatPostgresMembership(result.rows[0]);
      res.json({ membership });
    } else {
      const membership = inMemoryMemberships.find(m => m.id === id);
      if (!membership) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      res.json({ membership: formatMembershipResponse(membership) });
    }
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'Failed to fetch membership' });
  }
};

export const createMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, features }: CreateMembershipRequest = req.body;
    
    if (!name || price === undefined || !features || !Array.isArray(features)) {
      res.status(400).json({ error: 'Name, price, and features array are required' });
      return;
    }
    
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      const result = await postgresQuery(
        'INSERT INTO memberships (name, price, features) VALUES ($1, $2, $3) RETURNING *',
        [name, price, JSON.stringify(features)]
      );
      
      const newMembership = formatPostgresMembership(result.rows[0]);
      res.status(201).json({ membership: newMembership });
    } else {
      const newMembership: Membership = {
        id: uuidv4(),
        name,
        price,
        features,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      inMemoryMemberships.push(newMembership);
      res.status(201).json({ membership: formatMembershipResponse(newMembership) });
    }
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Failed to create membership' });
  }
};

export const updateMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, features }: UpdateMembershipRequest = req.body;
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      const updateData: string[] = [];
      const values: any[] = [];
      let paramCount = 0;
      
      if (name) {
        updateData.push(`name = $${++paramCount}`);
        values.push(name);
      }
      if (price !== undefined) {
        updateData.push(`price = $${++paramCount}`);
        values.push(price);
      }
      if (features) {
        updateData.push(`features = $${++paramCount}`);
        values.push(JSON.stringify(features));
      }
      
      if (updateData.length === 0) {
        res.status(400).json({ error: 'At least one field must be provided for update' });
        return;
      }
      
      values.push(id);
      const result = await postgresQuery(
        `UPDATE memberships SET ${updateData.join(', ')}, updated_at = NOW() WHERE id = $${++paramCount} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      const updatedMembership = formatPostgresMembership(result.rows[0]);
      res.json({ membership: updatedMembership });
    } else {
      const membership = inMemoryMemberships.find(m => m.id === id);
      if (!membership) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      if (name) membership.name = name;
      if (price !== undefined) membership.price = price;
      if (features) membership.features = features;
      membership.updatedAt = new Date();
      
      res.json({ membership: formatMembershipResponse(membership) });
    }
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: 'Failed to update membership' });
  }
};

export const deleteMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      const result = await postgresQuery('DELETE FROM memberships WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      res.status(204).send();
    } else {
      const membershipIndex = inMemoryMemberships.findIndex(m => m.id === id);
      if (membershipIndex === -1) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      inMemoryMemberships.splice(membershipIndex, 1);
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Failed to delete membership' });
  }
};

export const assignMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, membershipTierId }: AssignMembershipRequest = req.body;
    
    if (!userId || !membershipTierId) {
      res.status(400).json({ error: 'userId and membershipTierId are required' });
      return;
    }
    
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      // Check if membership exists
      const membershipResult = await postgresQuery('SELECT * FROM memberships WHERE id = $1', [membershipTierId]);
      if (membershipResult.rows.length === 0) {
        res.status(404).json({ error: 'Membership tier not found' });
        return;
      }
      
      // Update user's membership
      const userResult = await postgresQuery(
        'UPDATE users SET membership_tier_id = $1, membership_assigned_at = NOW(), updated_at = NOW() WHERE id = $2 RETURNING *',
        [membershipTierId, userId]
      );
      
      if (userResult.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const membership = formatPostgresMembership(membershipResult.rows[0]);
      res.json({ 
        message: 'Membership assigned successfully',
        userId,
        membership,
        assignedAt: new Date().toISOString()
      });
    } else {
      res.status(501).json({ error: 'Membership assignment requires PostgreSQL database' });
    }
  } catch (error) {
    console.error('Error assigning membership:', error);
    res.status(500).json({ error: 'Failed to assign membership' });
  }
};

export const getUserMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      const result = await postgresQuery(`
        SELECT 
          u.id as user_id,
          u.membership_assigned_at,
          m.id as membership_id,
          m.name as membership_name,
          m.price as membership_price,
          m.features as membership_features,
          m.created_at as membership_created_at,
          m.updated_at as membership_updated_at
        FROM users u
        LEFT JOIN memberships m ON u.membership_tier_id = m.id
        WHERE u.id = $1
      `, [userId]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const row = result.rows[0];
      const userMembership: UserMembershipResponse = {
        userId: row.user_id,
        membershipTier: row.membership_id ? {
          id: row.membership_id,
          name: row.membership_name,
          price: parseFloat(row.membership_price),
          features: row.membership_features,
          createdAt: row.membership_created_at,
          updatedAt: row.membership_updated_at
        } : null,
        assignedAt: row.membership_assigned_at
      };
      
      res.json(userMembership);
    } else {
      res.status(501).json({ error: 'User membership lookup requires PostgreSQL database' });
    }
  } catch (error) {
    console.error('Error fetching user membership:', error);
    res.status(500).json({ error: 'Failed to fetch user membership' });
  }
};

export const updateUserMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { membershipTierId }: { membershipTierId: string } = req.body;
    
    if (!membershipTierId) {
      res.status(400).json({ error: 'membershipTierId is required' });
      return;
    }
    
    const dbMode = getDatabaseMode();
    
    if (dbMode === 'postgres') {
      // Check if membership exists
      const membershipResult = await postgresQuery('SELECT * FROM memberships WHERE id = $1', [membershipTierId]);
      if (membershipResult.rows.length === 0) {
        res.status(404).json({ error: 'Membership tier not found' });
        return;
      }
      
      // Update user's membership
      const userResult = await postgresQuery(
        'UPDATE users SET membership_tier_id = $1, membership_assigned_at = NOW(), updated_at = NOW() WHERE id = $2 RETURNING *',
        [membershipTierId, userId]
      );
      
      if (userResult.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const membership = formatPostgresMembership(membershipResult.rows[0]);
      res.json({ 
        message: 'Membership updated successfully',
        userId,
        membership,
        assignedAt: new Date().toISOString()
      });
    } else {
      res.status(501).json({ error: 'User membership update requires PostgreSQL database' });
    }
  } catch (error) {
    console.error('Error updating user membership:', error);
    res.status(500).json({ error: 'Failed to update user membership' });
  }
};