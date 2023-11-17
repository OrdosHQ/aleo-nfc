import axios from 'axios'
import { AleoTransactionResponse } from './aleo.interface'

const rpsUrl = 'https://testnet3.aleorpc.com'

export const getAleoTransaction = async (id: string): Promise<AleoTransactionResponse> => {
  try {
    const response = await axios.post(
      rpsUrl,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'aleoTransaction',
        params: {
          id,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  } catch (error) {
    console.error('Error making aleoTransaction request:', error)
    throw error
  }
}
