import { useEffect, useState } from 'react';

type MapleData = {
  mapleById: {
    totalValueLockedV2: string;
    totalInterestEarnedV2: string;
    totalInterestEarned: string;
    totalLoanOriginations: string;
  };
  solanaGlobals: {
    totalLiquidityProvided: string;
    totalLoanOriginations: string;
    totalInterestEarned: string;
  };
};

export default function LiveGraphQLClient() {
  const [data, setData] = useState<MapleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapleData = async () => {
      const res = await fetch('https://api.maple.finance/v2/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query mapleAndSolanaById($id: String!) {
              mapleById(id: $id) {
                totalValueLockedV2
                totalInterestEarnedV2
                totalInterestEarned
                totalLoanOriginations
              }
              solanaGlobals {
                totalLiquidityProvided
                totalLoanOriginations
                totalInterestEarned
              }
            }
          `,
          variables: {
            id: '1',
          },
        }),
      });

      const json = await res.json();
      setData(json.data);
      setLoading(false);
    };

    fetchMapleData();
  }, []);

  if (loading) return <p>Loading live data...</p>;
  if (!data) return <p>No data available.</p>;

  const { mapleById, solanaGlobals } = data;

  return (
    <div className='grid gap-4'>
      <h2 className='text-2xl font-bold'>Maple Data</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Value Locked V2:</strong> {mapleById.totalValueLockedV2}
        </li>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Interest Earned V2:</strong>{' '}
          {mapleById.totalInterestEarnedV2}
        </li>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Loan Originations:</strong>{' '}
          {mapleById.totalLoanOriginations}
        </li>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Interest Earned (legacy):</strong>{' '}
          {mapleById.totalInterestEarned}
        </li>
      </ul>

      <h2 className='text-2xl font-bold mt-6'>Solana Data</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Liquidity Provided:</strong>{' '}
          {solanaGlobals.totalLiquidityProvided}
        </li>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Loan Originations:</strong>{' '}
          {solanaGlobals.totalLoanOriginations}
        </li>
        <li className='bg-white shadow rounded p-4'>
          <strong>Total Interest Earned:</strong>{' '}
          {solanaGlobals.totalInterestEarned}
        </li>
      </ul>
    </div>
  );
}
