import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createPortfolioRepo } from '@/utils/github';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    console.log('Create route - Initial session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasToken: !!session?.accessToken,
      user: session?.user,
      tokenType: typeof session?.accessToken,
      tokenLength: session?.accessToken?.length,
    });

    if (!session?.user) {
      console.error('Create route - No user in session');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!session?.accessToken) {
      console.error('Create route - No access token in session');
      return NextResponse.json({ error: 'GitHub token not found. Please sign in again.' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Create route - Portfolio data:', {
      name: data.name,
      projectCount: data.projects?.length,
    });

    const octokit = new Octokit({ auth: session.accessToken });
    
    // Test the token by getting user info
    try {
      const userResponse = await octokit.users.getAuthenticated();
      console.log('Create route - GitHub user verification:', {
        username: userResponse.data.login,
        tokenValid: true,
      });
    } catch (error) {
      console.error('Create route - GitHub token validation failed:', error);
      return NextResponse.json(
        { error: 'Invalid GitHub token. Please sign in again.' },
        { status: 401 }
      );
    }

    const repo = await createPortfolioRepo(octokit, data);
    console.log('Create route - Repository created:', { url: repo });

    return NextResponse.json({ url: repo });
  } catch (error) {
    console.error('Create route - Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 