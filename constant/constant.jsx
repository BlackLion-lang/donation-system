import ReferralABI from './Referral.json'
import USDTABI from './USDT.json'

// Contract addresses
export const CONTRACTS = {

  Referral_ADDRESS: '0x42972c3d25f99c8ab19f2f6ef3ea762d7c454785',
  USDT_ADDRESS: '0x774bccb917a7634b857c9499061167d256721490'
};

// Contract ABIs
export const ABIS = {
  Referral: ReferralABI,
  USDT: USDTABI
};

export const DECIMAL = 10 ** 18;
