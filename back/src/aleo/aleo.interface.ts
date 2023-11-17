export interface AleoTransactionResult {
  status: string
  type: string
  index: number
  transaction: {
    type: string
    id: string
    execution: {
      transitions: Array<{
        id: string
        program: string
        function: string
        inputs: Array<{
          type: string
          id: string
          value: string
        }>
        outputs: Array<{
          type: string
          id: string
          checksum?: string
          value: string
        }>
        tpk: string
        tcm: string
      }>
      global_state_root: string
      proof: string
    }
    fee: {
      transition: {
        id: string
        program: string
        function: string
        inputs: Array<{
          type: string
          id: string
          value: string
        }>
        outputs: Array<{
          type: string
          id: string
          value: string
        }>
        tpk: string
        tcm: string
      }
      global_state_root: string
      proof: string
    }
  }
  finalizedAt: string
}

export interface AleoTransactionResponse {
  jsonrpc: string
  id: number
  result: AleoTransactionResult | null
}
