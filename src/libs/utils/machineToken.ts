// libs/utils/machineToken.ts - 🚨 FIXED DUPLICATE REFRESH & NEXT.JS SINGLETON
class CognitoMachineTokenManager {
  private token: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<string> | null = null;
  private instanceId = Math.random().toString(36).substring(7);

  async getToken(): Promise<string> {
    if (this.isValid()) {
      return this.token as string;
    }

    // 🔑 DEDUPE: If already refreshing, WAIT for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.fetchMachineToken();

    try {
      this.token = await this.refreshPromise;
      return this.token as string;
    } finally {
      this.refreshPromise = null;
    }
  }

  private isValid(): boolean {
    const buffer = 5 * 60 * 1000; // 5min buffer
    const valid = !!this.token && Date.now() < this.expiresAt - buffer;
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
      throw new Error(`Machine token failed: ${response.status}`);
    }

    const data = await response.json();
    // Set expiresAt BEFORE token to avoid race condition
    this.expiresAt = Date.now() + data.expires_in * 1000;
    this.token = data.access_token;

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
}
