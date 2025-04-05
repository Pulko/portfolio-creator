import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createPortfolioRepo } from '@/utils/github';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || !session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const octokit = new Octokit({ auth: session.accessToken });
    const repo = await createPortfolioRepo(octokit, data);

    return NextResponse.json({ url: repo });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 