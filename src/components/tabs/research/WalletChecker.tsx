import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Loader2, AlertTriangle, Clock } from 'lucide-react';

type TransactionType = 'B' | 'S';

interface Transaction {
  age: string;
  type: TransactionType;
  tokenSymbol: string;
  price: string;
  amount: string;
  total: string;
  status: string;
  hash: string;
  timestamp: number;
  fee: number;
}

interface RawTransaction {
  slot: number;
  fee: number;
  status: string;
  block_time: number;
  tx_hash: string;
  time: string;
}

interface Stats {
  totalFees: number;
  successCount: number;
  failCount: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    data: RawTransaction[];
    metadata: any;
    success: boolean;
  };
}

interface WalletData {
  transactions: Transaction[];
  stats: Stats;
}

const WalletAnalyzer: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const formatAge = (timestamp: number): string => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const formatPrice = (fee: number): string => `$${(Math.abs(fee) / 1e9).toFixed(4)}`;
  const formatAmount = (fee: number): string => `${(Math.abs(fee) / 1e6).toFixed(2)}K`;
  const formatTotal = (fee: number): string => `$${(Math.abs(fee) / 1e9).toFixed(2)}`;

  const processTransactions = (response: ApiResponse): Transaction[] => {
    const txs = response.data;
    if (!Array.isArray(txs)) {
      console.error('Invalid transactions data:', txs);
      return [];
    }

    return txs.map(tx => ({
      age: formatAge(tx.block_time),
      type: (tx.fee > 0 ? 'S' : 'B') as TransactionType,
      tokenSymbol: 'SOL',
      price: formatPrice(tx.fee),
      amount: formatAmount(tx.fee),
      total: formatTotal(tx.fee),
      status: tx.status,
      hash: tx.tx_hash.slice(0, 8),
      timestamp: new Date(tx.time).getTime(),
      fee: tx.fee
    })).sort((a, b) => b.timestamp - a.timestamp);
  };

  const calculateStats = (transactions: any[]): Stats => {
    if (!Array.isArray(transactions) || !transactions.length) {
      return {
        totalFees: 0,
        successCount: 0,
        failCount: 0
      };
    }

    return transactions.reduce((acc: Stats, tx) => {
      acc.totalFees += tx.fee / 1e9;
      if (tx.status === 'Success') acc.successCount++;
      if (tx.status === 'Fail') acc.failCount++;
      return acc;
    }, { totalFees: 0, successCount: 0, failCount: 0 });
  };

  const calculateMonthlyActivity = (transactions: Transaction[]) => {
    const activityMap: { [key: string]: number } = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      activityMap[day] = (activityMap[day] || 0) + 1;
    });

    return Object.entries(activityMap).map(([date, count]) => ({ date, count }));
  };

  const fetchWalletData = async (): Promise<void> => {
    if (!walletAddress) {
      setError('Please enter a wallet address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/solscanProxy?address=${walletAddress}&endpoint=account/transactions`);
      const result = await response.json();
      
      console.log('Raw API response:', result);

      const txsArray = result.data.data;
      
      if (!Array.isArray(txsArray)) {
        console.error('Invalid data structure:', result);
        throw new Error('Invalid data structure received');
      }

      const transactions = txsArray.map(tx => ({
        age: formatAge(tx.block_time),
        type: (tx.fee > 0 ? 'S' : 'B') as TransactionType,
        tokenSymbol: 'SOL',
        price: formatPrice(tx.fee),
        amount: formatAmount(tx.fee),
        total: formatTotal(tx.fee),
        status: tx.status,
        hash: tx.tx_hash.slice(0, 8),
        timestamp: tx.block_time * 1000,
        fee: tx.fee
      }));

      const stats = {
        totalFees: txsArray.reduce((acc, tx) => acc + (tx.fee / 1e9), 0),
        successCount: txsArray.filter(tx => tx.status === 'Success').length,
        failCount: txsArray.filter(tx => tx.status === 'Fail').length
      };

      console.log('Processed transactions:', transactions);
      console.log('Calculated stats:', stats);

      setWalletData({ 
        transactions: transactions.sort((a, b) => b.timestamp - a.timestamp),
        stats
      });
      
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartData = (transactions: Transaction[]) => {
    let balance = 0;
    return transactions.map(tx => {
      balance += tx.fee / 1e9;
      return {
        time: tx.timestamp,
        balance: balance.toFixed(4)
      };
    });
  };

  const monthlyActivity = walletData ? calculateMonthlyActivity(walletData.transactions) : [];

  return (
    <div className="w-full p-6 text-white min-h-screen">
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter Solana wallet address"
          className="flex-1 px-4 py-2 bg-black border border-[#B1B762] rounded"
        />
        <button
          onClick={fetchWalletData}
          disabled={isLoading}
          className="px-6 py-2 bg-[#B1B762] text-black rounded disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-900/20 border border-red-800 rounded text-red-500 flex items-center gap-2">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {walletData && walletData.transactions.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#1D281D] rounded">
              <div className="text-sm text-gray-400">Total Fees</div>
              <div className="text-xl text-[#B1B762]">
                {walletData.stats.totalFees.toFixed(6)} SOL
              </div>
            </div>
            <div className="p-4 bg-[#1D281D] rounded">
              <div className="text-sm text-gray-400">Successful Transactions</div>
              <div className="text-xl text-green-500">{walletData.stats.successCount}</div>
            </div>
            <div className="p-4 bg-[#1D281D] rounded">
              <div className="text-sm text-gray-400">Failed Transactions</div>
              <div className="text-xl text-red-500">{walletData.stats.failCount}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#1D281D] rounded-lg p-4">
              <div className="text-[#B1B762] mb-4">Fee History</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateChartData(walletData.transactions)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(177, 183, 98, 0.21)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#B1B762"
                      tickFormatter={(value: number) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis stroke="#B1B762" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1D281D',
                        border: '1px solid rgb(177, 183, 98)',
                        borderRadius: '4px'
                      }}
                      formatter={(value: string) => [`${value} SOL`, 'Fee']}
                      labelFormatter={(label: number) => new Date(label).toLocaleString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#B1B762" 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#1D281D] rounded-lg p-4">
              <div className="text-[#B1B762] mb-4">Transaction Status</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{
                    name: 'Transactions',
                    Success: walletData.stats.successCount,
                    Fail: walletData.stats.failCount
                  }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '4px'
                      }}
                    />
                    <Bar dataKey="Success" fill="#10B981" />
                    <Bar dataKey="Fail" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          

          <div className="bg-[#1D281D] rounded-lg p-4">
            <div className="text-[#B1B762] mb-4">Recent Transactions</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[#B1B762]">
                    <th className="text-left p-2">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Age</span>
                      </div>
                    </th>
                    <th className="text-left p-2">Hash</th>
                    <th className="text-left p-2">Fee</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.transactions.map((tx, i) => (
                    <tr key={i} className="border-t border-[#425030]">
                      <td className="p-2 text-gray-400">{tx.age}</td>
                      <td className="p-2 font-mono">{tx.hash}</td>
                      <td className="p-2">{(tx.fee / 1e9).toFixed(6)} SOL</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          tx.status === 'Success' 
                            ? 'bg-green-900/20 text-green-500' 
                            : 'bg-red-900/20 text-red-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletAnalyzer;
