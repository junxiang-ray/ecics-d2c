// libs/utils/machineToken.ts - 🚨 FIXED DUPLICATE REFRESH
class CognitoMachineTokenManager {
  private token: string | null = null;
  private expiresAt: number = 0;
  private refreshPromise: Promise<string> | null = null; // 🔑 DEDUPE LOCK

  async getToken(): Promise<string> {
    // ✅ IMMEDIATE RETURN if valid
    if (this.isValid()) {
      console.log('✅ Using cached token');
      return this.token!;
    }

    // 🔑 DEDUPE: If already refreshing, WAIT for it
    if (this.refreshPromise) {
      console.log('⏳ Token refresh in progress, waiting...');
      return this.refreshPromise; // Wait, don't duplicate!
    }

    console.log('🔄 Starting NEW token refresh...');
    this.refreshPromise = this.fetchMachineToken(); // Single refresh
    
    try {
      this.token = await this.refreshPromise;
      console.log('✅ Token refreshed, expires:', new Date(this.expiresAt).toLocaleString());
      return this.token!;
    } finally {
      this.refreshPromise = null; // Release lock
    }
  }

  private isValid(): boolean {
    const buffer = 5 * 60 * 1000; // 5min buffer
    const valid = !!this.token && Date.now() < (this.expiresAt - buffer);
    console.log('🔍 Token valid check:', {
      hasToken: !!this.token,
      expiresAt: new Date(this.expiresAt).toLocaleTimeString(),
      now: new Date(Date.now()).toLocaleTimeString(),
      bufferMs: buffer,
      valid
    });
    return valid;
  }

  private async fetchMachineToken(): Promise<string> {
    const tokenUrl = `https://ap-southeast-13elwe1ija.auth.ap-southeast-1.amazoncognito.com/oauth2/token`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.COGNITO_MACHINE_CLIENT_ID!,
        client_secret: process.env.COGNITO_MACHINE_CLIENT_SECRET!,
        scope: 'default-m2m-resource-server-wbcwoh/read',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token fetch failed:', response.status, errorText);
      throw new Error(`Machine token failed: ${response.status}`);
    }

    const data = await response.json();
    this.expiresAt = Date.now() + (data.expires_in * 1000);
    
    console.log('📊 Token details:', {
      expiresIn: data.expires_in,
      validUntil: new Date(this.expiresAt).toLocaleString()
    });
    
    return data.access_token;
  }
}

export const machineTokenManager = new CognitoMachineTokenManager();
