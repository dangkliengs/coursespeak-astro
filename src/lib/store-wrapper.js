// JavaScript wrapper for store.ts functions
import { readDealsFromFile, writeDealsToFile, updateDeal as updateDealTS, deleteDeal as deleteDealTS, sortByRecency } from './store.ts';

export async function readDeals() {
  const deals = await readDealsFromFile();
  return sortByRecency(deals);
}

export async function writeDeals(allDeals) {
  await writeDealsToFile(allDeals);
}

export async function updateDeal(id, patch) {
  return await updateDealTS(id, patch);
}

export async function deleteDeal(id) {
  await deleteDealTS(id);
}
