import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	// TODO: Implement PDF generation logic
	return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
