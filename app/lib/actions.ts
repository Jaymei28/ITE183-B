'use server';

import { cookies } from 'next/headers';

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    (await cookies()).set('session_userid', userId, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    (await cookies()).set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    (await cookies()).set('session_userid', '');
    (await cookies()).set('session_access_token', '');
    (await cookies()).set('session_refresh_token', '');
}

//
// Get data

export async function getUserId() {
    const userId = (await cookies()).get('session_userid')?.value
    return userId ? userId : null
}

export async function getRefreshToken() {
    const refreshToken = (await cookies()).get('session_refresh_token')?.value;
    return refreshToken ? refreshToken : null;
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;

    if (!accessToken) {
        const refreshToken = (await cookies()).get('session_refresh_token')?.value;

        if (refreshToken) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refresh: refreshToken
                    })
                });

                if (response.ok) {
                    const json = await response.json();

                    if (json.access) {
                        accessToken = json.access;

                        (await cookies()).set('session_access_token', accessToken as string, {
                            httpOnly: true,
                            secure: false,
                            maxAge: 60 * 60, // 60 minutes
                            path: '/'
                        });

                        return accessToken;
                    }
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        }
    }

    return accessToken;
}