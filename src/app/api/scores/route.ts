import { NextResponse } from 'next/server';
import { getScore, updateScore } from '@/lib/store';

export async function GET() {
    const score = getScore();
    return NextResponse.json({ score });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        updateScore(body);
        return NextResponse.json({ success: true, score: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
