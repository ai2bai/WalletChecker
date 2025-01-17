import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.solscan.io/token/meta?token=${token}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY_HERE`, 
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch token metadata' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
