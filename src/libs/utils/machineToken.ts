// libs/utils/machineToken.ts - 🚨 FIXED DUPLICATE REFRESH & NEXT.JS SINGLETON
class CognitoMachineTokenManager {
  private token: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<string> | null = null;
  private instanceId = Math.random().toString(36).substring(7);

  async getToken(): Promise<string> {
    console.log(`[Instance ${this.instanceId}] 🔍 getToken called`, {
      hasToken: !!this.token,
      expiresAt: this.expiresAt
        ? new Date(this.expiresAt).toLocaleTimeString()
        : 'none',
      now: new Date(Date.now()).toLocaleTimeString(),
    });

    // ✅ IMMEDIATE RETURN if valid
    if (this.isValid()) {
      console.log(`[Instance ${this.instanceId}] ✅ Using cached token`);
      // Safe because isValid() checks this.token is not null
      return this.token as string;
    }

    // 🔑 DEDUPE: If already refreshing, WAIT for it
    if (this.refreshPromise) {
      console.log(
        `[Instance ${this.instanceId}] ⏳ Token refresh in progress, waiting...`,
      );
      return this.refreshPromise;
    }

    console.log(
      `[Instance ${this.instanceId}] 🔄 Starting NEW token refresh...`,
    );
    this.refreshPromise = this.fetchMachineToken();

    try {
      this.token = await this.refreshPromise;
      console.log(
        `[Instance ${this.instanceId}] ✅ Token refreshed, expires:`,
        new Date(this.expiresAt).toLocaleString(),
      );
      // Safe because fetchMachineToken returns string
      return this.token as string;
    } finally {
      this.refreshPromise = null;
      console.log(`[Instance ${this.instanceId}] 🧹 Refresh promise cleared`);
    }
  }

  private isValid(): boolean {
    const buffer = 5 * 60 * 1000; // 5min buffer
    const valid = !!this.token && Date.now() < this.expiresAt - buffer;
    console.log(`[Instance ${this.instanceId}] 🔍 Token valid check:`, {
      hasToken: !!this.token,
      expiresAt: this.expiresAt
        ? new Date(this.expiresAt).toLocaleTimeString()
        : 'none',
      now: new Date(Date.now()).toLocaleTimeString(),
      bufferMs: buffer,
      valid,
    });
    return valid;
  }

  private async fetchMachineToken(): Promise<string> {
    // ✅ Validate all required env vars
    const tokenUrl = process.env.COGNITO_MACHINE_AUTH_URL;
    const clientId = process.env.COGNITO_MACHINE_CLIENT_ID;
    const clientSecret = process.env.COGNITO_MACHINE_CLIENT_SECRET;
    const scope = process.env.COGNITO_MACHINE_SCOPE;

    if (!tokenUrl || !clientId || !clientSecret || !scope) {
      throw new Error(
        'Missing required Cognito machine token environment variables',
      );
    }

    console.log(
      `[Instance ${this.instanceId}] 🌐 Fetching token from Cognito...`,
    );

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Instance ${this.instanceId}] ❌ Token fetch failed:`,
        response.status,
        errorText,
      );
      throw new Error(`Machine token failed: ${response.status}`);
    }

    const data = await response.json();

    // Set expiresAt BEFORE token to avoid race condition
    this.expiresAt = Date.now() + data.expires_in * 1000;
    this.token = data.access_token;

    console.log(`[Instance ${this.instanceId}] 📊 Token stored:`, {
      expiresIn: data.expires_in,
      validUntil: new Date(this.expiresAt).toLocaleString(),
      tokenPreview: this.token?.substring(0, 20) + '...',
    });

    return data.access_token;
  }
}

// Use globalThis to ensure single instance across hot reloads and requests
const globalForManager = globalThis as unknown as {
  machineTokenManager?: CognitoMachineTokenManager;
};

export const machineTokenManager =
  globalForManager.machineTokenManager ?? new CognitoMachineTokenManager();

// Store in global for reuse (dev mode only to avoid memory leaks in prod)
if (process.env.NODE_ENV !== 'production') {
  globalForManager.machineTokenManager = machineTokenManager;
  console.log('🌍 Stored machineTokenManager in globalThis (dev mode)');
}

console.log(
  '🏭 machineTokenManager instance created:',
  (machineTokenManager as any).instanceId,
);
