import { NAV_ROUTES } from './routes';

const contracts: Map<SupportedContracts, { name: string; link?: string }> =
  new Map();
contracts.set('Potential', {
  name: 'Potential',
  link: NAV_ROUTES.MAGIC_EDEN,
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
