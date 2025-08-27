# JenGen - Reown AppKit Integration Setup

## Overview

JenGen uses Reown AppKit with Wagmi adapter for social and email authentication. **No wallet connections** are allowed - only email signup and social login (Google, Apple, Facebook).

## Environment Variables

### Required Variables

Add these to your `.env.local` file:

```env
# Reown (WalletConnect) Configuration for JenGen
# Project ID for AppKit integration
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
REOWN_SECRET_KEY=your_secret_key_here
```

### Getting Your Credentials

1. Go to [Reown Cloud Dashboard](https://cloud.reown.com/)
2. Create or select your project
3. Copy the **Project ID** and **Secret Key**
4. Add them to your `.env.local` file

## Local Development Checklist

- [ ] Environment variables set in `.env.local`
- [ ] `npm install` completed with Wagmi dependencies
- [ ] Dev server running on `http://localhost:3000`
- [ ] AppKit modal opens with **only** email/social options (no wallets)
- [ ] Google/Apple/Facebook buttons work without showing wallet list
- [ ] Email OTP flow completes in-modal
- [ ] Successful auth redirects to `/onboarding`

## Production Deployment Checklist

- [ ] `NEXT_PUBLIC_PROJECT_ID` set in production environment
- [ ] `REOWN_SECRET_KEY` set in production environment  
- [ ] Reown project configured with production domain
- [ ] OAuth providers (Google/Apple/Facebook) configured with production redirects
- [ ] Test all social login flows on production URL
- [ ] Verify embedded wallet creation works for authenticated users

## Key Features

### Enabled
- ✅ **Email signup/login** with OTP
- ✅ **Google OAuth** login
- ✅ **Apple OAuth** login  
- ✅ **Facebook OAuth** login
- ✅ **Embedded wallet creation** for authenticated users
- ✅ **Wagmi integration** for web3 functionality

### Disabled
- ❌ **Direct wallet connections** (MetaMask, etc.)
- ❌ **Wallet selection modal**
- ❌ **Web3 wallet imports**

## AppKit Configuration

```typescript
createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  networks: [mainnet, arbitrum],
  features: {
    email: true,
    socials: ['google','apple','facebook'],
    emailShowWallets: false
  },
  allWallets: 'HIDE' // Completely hide wallet options
})
```

## Authentication Flow

1. **User clicks signup/login button** → `useAppKit().open()` called
2. **AppKit modal shows** → Email field + social buttons (Google/Apple/Facebook)
3. **User selects option** → OAuth flow or email OTP handled by AppKit
4. **Authentication succeeds** → Embedded wallet created + `useAppKitAccount` updates
5. **App detects connection** → Redirect to `/onboarding`

## Troubleshooting

### Modal shows wallets instead of email/social
- Check `allWallets: 'HIDE'` in AppKit config
- Verify `emailShowWallets: false` in features
- Ensure `socials` array is properly configured

### Environment variable not found
- Verify `.env.local` file exists in project root
- Check variable name is `NEXT_PUBLIC_PROJECT_ID` (not REOWN_PROJECT_ID)
- Restart dev server after changing env vars

### OAuth redirect fails
- Verify redirect URIs in OAuth provider settings
- Check production domain matches Reown project settings
- Ensure HTTPS is used in production

### Build/compilation errors
- Run `npm install @reown/appkit-adapter-wagmi wagmi viem`
- Clear `.next` folder: `rm -rf .next && npm run build`
- Check TypeScript errors in AppKitProvider.tsx

## Support

- [Reown AppKit Documentation](https://docs.reown.com/appkit/next/core/installation)
- [Wagmi Documentation](https://wagmi.sh/)
- [Social Login Configuration](https://docs.reown.com/appkit/next/core/socials)