import { NextResponse } from 'next/server';
import clientPromise from "@/app/utils/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('data');

    const lot = await db.collection('lots').findOne({ lot_id: id });

    if (!lot) {
      return NextResponse.json(
        { error: `Lot ${id} not found.`},
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      )
    }

    return NextResponse.json(lot, {
      headers: { "Allow-Control-Allow-Origin": "*" }
    })
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: `Failed to fetch lot.`},
      { status: 500 }
    )
  }
}
