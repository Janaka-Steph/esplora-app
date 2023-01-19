import {useQuery} from "@tanstack/react-query";
import { crypto } from 'liquidjs-lib';
import {ElectrumWS} from "../ws/ws-electrs";

const BroadcastTransaction = 'blockchain.transaction.broadcast'; // returns txid
const EstimateFee = 'blockchain.estimatefee'; // returns fee rate in sats/kBytes
const GetBlockHeader = 'blockchain.block.header'; // returns block header as hex string
const GetHistoryMethod = 'blockchain.scripthash.get_history';
const GetTransactionMethod = 'blockchain.transaction.get'; // returns hex string
const ListUnspentMethod = 'blockchain.scripthash.listunspent'; // returns array of Outpoint
const SubscribeStatusMethod = 'blockchain.scripthash'; // ElectrumWS automatically adds '.subscribe'

export type GetHistoryResponse = Array<{
  tx_hash: string;
  height: number;
}>;

export type ListUnspentResponse = Array<{
  tx_hash: string;
  tx_pos: number;
  height: number; // if 0 = unconfirmed
}>;

const ws = new ElectrumWS('wss://blockstream.info/liquid/electrum-websocket/api')

const fetchTransactions = async (txids: string[]): Promise<{ txID: string; hex: string }[]> => {
  const responses = await ws.batchRequest<string[]>(
    ...txids.map((txid) => ({ method: GetTransactionMethod, params: [txid] }))
  );
  return responses.map((hex, i) => ({ txID: txids[i], hex }));
};

export const useFetchTransactions = (txids: string[]) => {
  return useQuery({
    queryKey: [GetTransactionMethod, txids],
    queryFn: () => fetchTransactions(txids),
    retry: 1,
    staleTime: Infinity,
    cacheTime: Infinity
  });
};

const fetchUnspentOutputs = async (scripts: Buffer[]): Promise<ListUnspentResponse[]> => {
  const scriptsHashes = scripts.map(toScriptHash);
  return ws.batchRequest<ListUnspentResponse[]>(
    ...scriptsHashes.map((s) => ({ method: ListUnspentMethod, params: [s] }))
  );
}

export const useFetchUnspentOutputs = (scripts: Buffer[]) => {
  return useQuery({
    queryKey: [ListUnspentMethod, scripts],
    queryFn: () => fetchUnspentOutputs(scripts),
    retry: 1,
    staleTime: Infinity,
    cacheTime: Infinity
  });
};

function toScriptHash(script: Buffer): string {
  return crypto.sha256(script).reverse().toString('hex');
}
