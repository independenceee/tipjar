import { UTxO } from "@meshsdk/core";

export function getUtxosOnlyLovelace(utxos: UTxO[], total: number, minLovelace = 5_000_000, amount_per_tx = 10) {
  const validUtxos = utxos
    .filter((utxo) => utxo.output.amount.every((amount) => amount.unit === "lovelace"))
    .sort((a, b) => Number(b.output.amount[0].quantity) - Number(a.output.amount[0].quantity));

  const groupCount = Math.floor(total / amount_per_tx);
  const remainder = total % amount_per_tx;

  const groupTargets = [];

  for (let i = 0; i < groupCount; i++) {
    groupTargets.push(amount_per_tx * minLovelace);
  }

  if (remainder > 0) {
    groupTargets.push(remainder * minLovelace);
  }

  const groupedUtxos = [];

  for (const target of groupTargets) {
    const currentGroup = [];
    let sumLovelace = 0;

    let i = 0;
    while (i < validUtxos.length) {
      if (validUtxos[i] === undefined) {
        i++;
        continue;
      }

      currentGroup.push(validUtxos[i]);
      sumLovelace += Number(validUtxos[i].output.amount[0].quantity);
      validUtxos.splice(i, 1);

      if (sumLovelace > target) break;
    }

    if (sumLovelace > target) {
      groupedUtxos.push(currentGroup);
    } else {
      return null;
    }
  }
  return groupedUtxos;
}
