import { NAV_ROUTES } from './routes';

// Central registry for supported contract types → display name (and optional external link)
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
  // fall back to the raw enum label if we don't have a friendlier mapping yet
  const contractData = contracts.get(contract);
  if (contractData) {
    return contractData;
  }
  return { name: contract };
};
