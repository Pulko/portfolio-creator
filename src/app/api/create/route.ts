import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createPortfolioRepo } from '@/utils/github';
import { Octokit } from '@octokit/rest';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Create route - Initial session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasToken: !!session?.accessToken,
      user: session?.user,
      tokenType: typeof session?.accessToken,
      tokenLength: session?.accessToken?.length,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!session.accessToken) {
      console.error('❌ No access token in session');
      return NextResponse.json(
        { error: 'GitHub token not found. Please sign in again.' },
        { status: 401 }
      );
    }

    const data = await req.json();
    console.log('Create route - Portfolio data:', {
      hasData: !!data,
      projectCount: data.projects?.length,
    });

    // Verify GitHub token is valid
    const octokit = new Octokit({
      auth: session.accessToken,
    });

    try {
      // Test the token by making a simple API call
      await octokit.users.getAuthenticated();
    } catch (error) {
      console.error('❌ GitHub token validation failed:', error);
      return NextResponse.json(
        { error: 'Invalid GitHub token. Please sign in again.' },
        { status: 401 }
      );
    }

    console.log('✅ GitHub token validated successfully');

    const repoUrl = await createPortfolioRepo(octokit, data);
    console.log('✅ Portfolio repository created:', repoUrl);

    return NextResponse.json({ url: repoUrl });
  } catch (error) {
    console.error('❌ Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 