import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config() // project root
dotenv.config({ path: join(process.cwd(), '../../.env') }) // workspace root

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  DEPLOYER_KEY: process.env.DEPLOYER_KEY ?? '',
  INFURA_API_KEY: process.env.INFURA_API_KEY ?? '',

  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY ?? '',
  BASESCAN_API_KEY: process.env.BASESCAN_API_KEY ?? process.env.ETHERSCAN_API_KEY ?? '',
}
;(() => {
  if (!process.env.DEPLOYER_KEY) {
    console.warn('DEPLOYER_KEY not found in .env file. Running with default config')
  }
  if (!process.env.INFURA_API_KEY) {
    console.warn('INFURA_API_KEY not found in .env file.')
  }
  if (!process.env.ETHERSCAN_API_KEY && !process.env.BASESCAN_API_KEY) {
    console.warn('ETHERSCAN_API_KEY or BASESCAN_API_KEY not found in .env file. Contract verification might fail')
  }
})()
