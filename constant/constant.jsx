import ReferralABI from './Referral.json'
import USDTABI from './USDT.json'

// Contract addresses
export const CONTRACTS = {

  Referral_ADDRESS: '0x1AC6246e751D8d017Fd9FC4fA94088a70682c4ac',
  USDT_ADDRESS: '0x774bccb917a7634b857c9499061167d256721490'
};

// Contract ABIs
export const ABIS = {
  Referral: ReferralABI,
  USDT: USDTABI
};

export const DECIMAL = 10 ** 18;
