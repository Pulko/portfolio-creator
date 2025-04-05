import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createPortfolioRepository } from '@/utils/github';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session && process.env.DEV_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const portfolioData = await request.json();
    const accessToken = session?.accessToken as string;
    const username = session?.user?.name as string;

    const repo = await createPortfolioRepository(
      accessToken,
      username,
      portfolioData
    );

    // Generate Vercel deploy URL
    const vercelDeployUrl = `https://vercel.com/new/git/external?repository-url=https://github.com/${username}/${username}-portfolio`;

    return NextResponse.json({
      success: true,
      repository: repo,
      deployUrl: vercelDeployUrl,
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 