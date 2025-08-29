import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

export interface VerifySignatureParams {
  message: string;
  signature: string;
  walletAddress: string;
}

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createSiweMessage = (
  walletAddress: string,
  nonce: string,
  chainId: number = 1
): string => {
  const domain = process.env.DOMAIN || 'localhost:4000';
  const uri = process.env.URI || 'http://localhost:4000';
  
  const message = new SiweMessage({
    domain,
    address: walletAddress,
    statement: 'Sign in with Ethereum to the app.',
    uri,
    version: '1',
    chainId,
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  });

  return message.prepareMessage();
};

export const verifyWalletSignature = async ({
  message,
  signature,
  walletAddress
}: VerifySignatureParams): Promise<boolean> => {
  try {
    const siweMessage = new SiweMessage(message);
    const verification = await siweMessage.verify({ signature });
    
    return verification.success && 
            verification.data.address.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying wallet signature:', error);
    return false;
  }
};

export const isValidEthereumAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

export const formatWalletAddress = (address: string): string => {
  if (!isValidEthereumAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getSupportedChainIds = (): number[] => {
  return [
    1,     // Ethereum Mainnet
    137,   // Polygon
    56,    // BSC
    42161, // Arbitrum One
    10,    // Optimism
    43114, // Avalanche
    250,   // Fantom
    8453,  // Base Mainnet
    84532, // Base Sepolia (testnet)
    11155111, // Sepolia (testnet)
  ];
};

export const getChainName = (chainId: number): string => {
  const chainNames: { [key: number]: string } = {
    1: 'Ethereum',
    137: 'Polygon',
    56: 'BSC',
    42161: 'Arbitrum',
    10: 'Optimism',
    43114: 'Avalanche',
    250: 'Fantom',
    8453: 'Base',
    84532: 'Base Sepolia',
    11155111: 'Sepolia'
  };
  
  return chainNames[chainId] || `Chain ${chainId}`;
};