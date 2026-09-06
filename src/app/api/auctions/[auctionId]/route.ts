import { NextResponse } from 'next/server';
import clientPromise from "@/app/utils/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ auctionId: string }> }
) {
  try {
    const { auctionId } = await params;
    const client = await clientPromise;
    const db = client.db('data');

    const auction = await db.collection('auctions').findOne({ auction_id: auctionId});

    if (!auction) {
      return NextResponse.json(
        { error: `Auction ${auctionId} not found.` },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      )
    }

    return NextResponse.json(auction, {
      headers: { "Access-Control-Allow-Origin": "*" }
    })
  } catch (error) {
    console.error("Failed to fetch auction", error)

    return NextResponse.json(
      { error: "Failed to fetch auction." },
      { status: 500 }
    )
  }
}
