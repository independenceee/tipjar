use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction, OutputReference}

validator tipjar {
  mint(_redeemer: Data, _policy_id: PolicyId, _self: Transaction) {
    True
  }

  spend(_datum: Option<Data>, _redeemer: Data, _utxo: OutputReference, _self: Transaction) {
    True
  }
}
