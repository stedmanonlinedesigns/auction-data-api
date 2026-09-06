import { NextResponse } from 'next/server';
import clientPromise from "@/app/utils/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('auctionId');
    const limit = parseInt(searchParams.get('limit') ?? "50", 10);
    const page = parseInt(searchParams.get('page') ?? "1", 10);
    const skip = (page -1) * limit;

    const client = await clientPromise;
    const db = client.db('data');

    const query = auctionId ? { auction_id: auctionId } : {};

    const [lots, total ] = await Promise.all([
      db.collection('lots').find(query).skip(skip).limit(limit).toArray(),
      db.collection('lots').countDocuments(query)
    ]);

    return NextResponse.json(
      {
        data:lots,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      },
      { headers: { "Acces-Control-Allow-Origin": "*" } }
    )
  } catch (error) {
    console.error(`Failed to fetch lots: ${error}`, error);

    return NextResponse.json(
      { error: "Failed to fetch lost." },
      { status: 500 }
    )
  }
}
