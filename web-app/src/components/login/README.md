# JenGen Reown (WalletConnect) Integration

This directory contains the Reown (WalletConnect) integration for JenGen's social authentication system.

## 📂 Files Overview

- `reownConfig.ts` - Core Reown configuration and social login utilities
- `ReownProvider.tsx` - React context provider for Reown state management
- `LoginModal.tsx` - Updated login modal with Reown integration
- `SignupModal.tsx` - Updated signup modal with Reown integration
- `.env.local.example` - Environment variables template

## 🔑 Setup Instructions

1. **Environment Variables**: Copy `.env.local.example` to `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
   REOWN_SECRET_KEY=your_secret_key_here
   ```

2. **Reown Project Configuration**:
   - Project Name: JenGen
   - Supported Social Providers: Google, Facebook, Apple
   - Wallet authentication: **DISABLED**

## 🚀 Features

### ✅ Implemented
- Social login integration (Google, Facebook, Apple)
- Wallet authentication disabled
- Accessibility compliant (44px minimum touch targets)
- Responsive design (mobile-first)
- TypeScript support with proper types
- Error handling and loading states
- Branded styling consistent with JenGen design

### 🔧 Configuration
- **Social Providers**: Limited to Google, Facebook, Apple only
- **Theme**: Matches JenGen branding (`#8b5cf6` accent color)
- **Features**: Analytics enabled, wallets disabled
- **Redirects**: Successful auth redirects to `/onboard`

## 🎨 UI/UX Features

### Accessibility
- ✅ Minimum 44px touch targets
- ✅ Keyboard navigation support
- ✅ Proper ARIA labels
- ✅ Screen reader announcements
- ✅ Focus management

### Responsiveness
- ✅ Mobile-first design
- ✅ Scales to desktop/tablet
- ✅ Touch-friendly interactions
- ✅ Consistent spacing

### Brand Consistency
- ✅ JenGen color palette
- ✅ Inter font family
- ✅ Consistent button styling
- ✅ JenGen logo integration

## 🔐 Security Notes

- Session tokens are handled by Reown's secure infrastructure
- No wallet private keys are stored or managed
- Social authentication uses OAuth 2.0 flows
- HTTPS required for production

## 📱 Testing

To test the integration:

1. Set up your `.env.local` with valid Reown credentials
2. Run `npm run dev`
3. Navigate to `/login` or `/signup`
4. Click on social login buttons
5. Verify proper error handling and loading states

## 🏗 Architecture

```
LoginModal/SignupModal
    ↓
socialLogin.loginWith[Provider]()
    ↓
reownConfig.ts
    ↓
Reown AppKit
    ↓
OAuth Provider (Google/Facebook/Apple)
    ↓
Redirect to /onboard
```

## 📋 TODO

- [ ] Replace placeholder social login implementations with actual Reown SDK calls
- [ ] Implement session token storage and validation
- [ ] Add user profile management
- [ ] Set up analytics tracking
- [ ] Add unit tests for authentication flows

## 🐛 Known Issues

- Social login methods currently contain placeholder implementations
- Real Reown SDK integration needs to be completed with actual API calls
- Session management is stubbed and needs implementation

## 📖 References

- [Reown Documentation](https://docs.reown.com/)
- [WalletConnect AppKit](https://docs.walletconnect.com/appkit/overview)
- [Next.js Integration Guide](https://docs.reown.com/appkit/next)