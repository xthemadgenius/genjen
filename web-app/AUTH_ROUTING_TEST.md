# Auth Routing Test Guide

## How to Test Login vs Signup Routing

The system now properly distinguishes between new users and existing users based on wallet addresses.

### Test Scenarios

1. **Existing Onboarded User** (should go to `/dashboard`)
   - Use a wallet address that starts with `0x1` (e.g., `0x123...`)
   - Login → Should redirect to `/dashboard`

2. **Existing Non-Onboarded User** (should go to `/onboard`)  
   - Use a wallet address that starts with `0x2` (e.g., `0x234...`)
   - Login → Should redirect to `/onboard`

3. **New User** (should go to `/onboard`)
   - Use any other wallet address (e.g., `0x345...`)
   - Login/Signup → Should redirect to `/onboard`

### Manual Testing with API

You can also simulate user states by calling the API directly:

```bash
# Create an existing onboarded user
curl -X POST http://localhost:3001/api/me \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890",
    "onboarded": true,
    "simulate": true
  }'

# Create an existing non-onboarded user  
curl -X POST http://localhost:3001/api/me \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x2345678901234567890123456789012345678901", 
    "onboarded": false,
    "simulate": true
  }'

# Test user status
curl "http://localhost:3001/api/me?address=0x1234567890123456789012345678901234567890"
```

### Expected Behavior

- ✅ **No redirects** until actual wallet connection is established
- ✅ **New users** → `/onboard`
- ✅ **Existing non-onboarded users** → `/onboard` 
- ✅ **Existing onboarded users** → `/dashboard`
- ✅ **Console logs** show routing decisions for debugging

### Implementation Notes

The `/api/me` endpoint currently uses:
- In-memory storage for demo purposes
- Address pattern matching (0x1* = onboarded, 0x2* = not onboarded, others = new)
- Query parameter passing for wallet address

In production, replace this with your actual database/session logic.