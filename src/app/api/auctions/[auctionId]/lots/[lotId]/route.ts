import { NextResponse } from "next/server";
import clientPromise from "@/app/utils/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ auctionId: string; lotId: string }>}
) {
  try {
    const { auctionId, lotId } = await params;
    const client = await clientPromise;
    const db = client.db('data')

    const lot = await db.collection('lots').findOne({
      auction_id: auctionId,
      lot_id: lotId
    })

    if (!lot) {
      return NextResponse.json(
        { error: `Lot ${lotId} not found in auction #${auctionId}.` },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      )
    }

    return NextResponse.json(lot, {
      headers: { "Access-Control-Allow-Origin": "*" }
    })
  } catch (error) {
    console.error(`Failed to fetch lot.`, error);

    return NextResponse.json(
      { error: 'Failed to fetch lot.' },
      { status: 500 }
    )
  }
}
