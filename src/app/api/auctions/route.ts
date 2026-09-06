import { NextResponse } from 'next/server';
import clientPromise from "@/app/utils/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('data')
    const auctions = await db.collection('auctions').find({}).toArray();

    return NextResponse.json(auctions, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    })
  } catch (error) {
    console.error(`Failed to fetch auctions: ${error}`);

    return NextResponse.json(
      { error: 'Failed to fetch auctions.'},
      { status: 500 }
    )
  }
}
