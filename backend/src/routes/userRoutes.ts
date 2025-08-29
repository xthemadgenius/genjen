import { Router } from 'express';
import {
  getUsers,
  getUserById,
  registerUser,
  generateWallet,
  updateUser,
  deleteUser
} from '../controllers/userController';
import {
  getUserMembership,
  updateUserMembership
} from '../controllers/membershipController';
import { asyncHandler } from '../middleware/errorHandler';
import {
  validateUserRegistration,
  validateUserUpdate,
  validateWalletGeneration,
  validateUUID,
  validatePagination,
  validateSearch,
  validateMembershipTier,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// Email-first user registration flow (2-step process)
router.post('/register', 
  validateUserRegistration(), 
  handleValidationErrors, 
  asyncHandler(registerUser)
);

router.post('/:id/generate-wallet', 
  validateUUID('id'),
  validateWalletGeneration(), 
  handleValidationErrors, 
  asyncHandler(generateWallet)
);

// User CRUD operations
router.get('/', 
  validatePagination(),
  validateSearch(),
  handleValidationErrors,
  asyncHandler(getUsers)
);

router.get('/:id', 
  validateUUID('id'),
  handleValidationErrors,
  asyncHandler(getUserById)
);

router.put('/:id', 
  validateUUID('id'),
  validateUserUpdate(), 
  handleValidationErrors, 
  asyncHandler(updateUser)
);

router.delete('/:id', 
  validateUUID('id'),
  handleValidationErrors,
  asyncHandler(deleteUser)
);

// User membership routes
router.get('/:userId/membership', 
  validateUUID('userId'),
  handleValidationErrors,
  asyncHandler(getUserMembership)
);

router.put('/:userId/membership', 
  validateUUID('userId'),
  validateMembershipTier(),
  handleValidationErrors,
  asyncHandler(updateUserMembership)
);

export default router;