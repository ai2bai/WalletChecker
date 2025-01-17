import React, { useMemo } from 'react';

interface SolscanTransaction {
  blockTime: number;
  status: string;
  lamport: number;
}

interface TradingActivityProps {
  transactions: SolscanTransaction[];
}

const TradingActivity: React.FC<TradingActivityProps> = ({ transactions }) => {
  const activityData = useMemo(() => {
    const data = Array(52).fill(0).map(() => Array(7).fill(0));
    const now = Date.now() / 1000; 
    transactions.forEach(tx => {
      const secondsAgo = now - tx.blockTime;
      const daysAgo = Math.floor(secondsAgo / (24 * 60 * 60));
      
      if (daysAgo < 365) { 
        const weekIndex = Math.floor(daysAgo / 7);
        const dayIndex = Math.floor(daysAgo % 7);
        
        if (weekIndex < 52) {
          data[weekIndex][dayIndex] += Math.abs(tx.lamport / 1e9);
        }
      }
    });

    const flatData = data.flat().filter(v => v > 0);
    if (flatData.length === 0) return data;

    const maxValue = Math.max(...flatData);
    const minValue = Math.min(...flatData);
    const range = maxValue - minValue;

    return data.map(week =>
      week.map(value => {
        if (value === 0) return 0;
        const normalized = (value - minValue) / range;
        return Math.ceil(normalized * 4);
      })
    );
  }, [transactions]);

  return (
    <div className="bg-[#141414] rounded-lg p-4">
      <div className="text-gray-500 mb-4">Trading Activity</div>
      <div>
        <div className="flex gap-1">
          {activityData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((activity, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-4 h-4 rounded-sm ${
                    activity === 0
                      ? 'bg-[#1A1B1E]'
                      : activity === 1
                      ? 'bg-[#1d392b]'
                      : activity === 2
                      ? 'bg-[#216c45]'
                      : activity === 3
                      ? 'bg-[#25995f]'
                      : 'bg-[#29cc79]'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-500 text-sm">Track your consistency and PnL</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Less</span>
            <div className="flex gap-1">
              {[
                'bg-[#1d392b]',
                'bg-[#216c45]',
                'bg-[#25995f]',
                'bg-[#29cc79]'
              ].map((color, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-sm ${color}`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingActivity;