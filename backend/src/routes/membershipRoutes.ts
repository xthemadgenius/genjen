import { Router } from 'express';
import {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
  assignMembership,
  getUserMembership,
  updateUserMembership
} from '../controllers/membershipController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/memberships - List all membership tiers
router.get('/', asyncHandler(getMemberships));

// GET /api/memberships/:id - Get specific membership tier
router.get('/:id', asyncHandler(getMembershipById));

// POST /api/memberships - Create new membership tier
router.post('/', asyncHandler(createMembership));

// PUT /api/memberships/:id - Update membership tier
router.put('/:id', asyncHandler(updateMembership));

// DELETE /api/memberships/:id - Delete membership tier
router.delete('/:id', asyncHandler(deleteMembership));

// POST /api/memberships/assign - Assign membership to user
router.post('/assign', asyncHandler(assignMembership));

// Note: User membership routes are handled in userRoutes.ts as:
// GET /api/users/:userId/membership
// PUT /api/users/:userId/membership

export default router;