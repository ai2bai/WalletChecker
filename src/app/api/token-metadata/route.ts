
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { assetSlug } = await request.json();

    if (!assetSlug) {
      return NextResponse.json(
        { error: 'assetSlug is required' },
        { status: 400 }
      );
    }

    const query = `
      {
        asset(slug: "${assetSlug}") {
          name
          slug
          marketCapUsd
          priceUsd
          socialVolume {
            twitter
            reddit
          }
          sentiment {
            twitter
            reddit
          }
        }
      }
    `;

    const response = await fetch('https://api.santiment.net/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SANTIMENT_API_KEY}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Santiment API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`Santiment API query error: ${JSON.stringify(data.errors)}`);
    }

    return NextResponse.json(data.data);
  } catch (error: any) {
    console.error('Error in Santiment API Route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Santiment API' },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'edge', 
};
