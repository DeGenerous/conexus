const contracts: Map<SupportedContracts, { name: string; link?: string }> =
  new Map();
contracts.set('Potential', {
  name: 'Potential',
  link: 'https://magiceden.io/collections/ethereum/0xfa511d5c4cce10321e6e86793cc083213c36278e',
});
contracts.set('Apes', {
  name: 'GLMR Ape',
  link: 'https://tofunft.com/collection/glmrapes/items',
});
contracts.set('Ark', {
  name: 'Inception Ark',
});

export default contracts;

export const contractGetter = (
  contract: SupportedContracts,
): { name: string; link?: string } => {
  const contractData = contracts.get(contract);
  if (contractData) {
    return contractData;
  }
  return { name: contract };
};
