import { NextResponse } from 'next/server';

const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    const endpoint = searchParams.get('endpoint');
  
    if (!address || !endpoint) {
      return NextResponse.json({ error: 'Address and endpoint are required' }, { status: 400 });
    }
  
    try {
      let apiUrl = `https://pro-api.solscan.io/v2.0/${endpoint}?address=${address}`;
      if (endpoint === 'account/token-accounts') {
        apiUrl += `&type=token`;
      }
      const response = await fetch(apiUrl, {
        headers: {
          accept: 'application/json',
          token: SOLSCAN_API_KEY!,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Solscan API request failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in solscanProxy API:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
