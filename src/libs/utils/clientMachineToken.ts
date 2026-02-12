// // libs/utils/clientMachineToken.ts
// class ClientMachineTokenManager {
//   private readonly STORAGE_KEY = 'machine_token';
//   private readonly EXPIRES_KEY = 'machine_token_expires';
//   private refreshPromise: Promise<string> | null = null;

//   /**
//    * Get valid token from cache or fetch new one
//    */
//   async getToken(): Promise<string> {
//     // Check if cached token is still valid (with 5min buffer)
//     if (this.isValid()) {
//       console.log('✅ Using cached client token');
//       return sessionStorage.getItem(this.STORAGE_KEY)!;
//     }

//     // Deduplicate concurrent refresh requests
//     if (this.refreshPromise) {
//       console.log('⏳ Client token refresh in progress, waiting...');
//       return this.refreshPromise;
//     }

//     console.log('🔄 Fetching new client token...');
//     this.refreshPromise = this.fetchToken();

//     try {
//       const token = await this.refreshPromise;
//       return token;
//     } finally {
//       this.refreshPromise = null;
//     }
//   }

//   /**
//    * Check if cached token is valid (with 5min safety buffer)
//    */
//   private isValid(): boolean {
//     const token = sessionStorage.getItem(this.STORAGE_KEY);
//     const expiresAt = parseInt(sessionStorage.getItem(this.EXPIRES_KEY) || '0');

//     if (!token || !expiresAt) return false;

//     const buffer = 5 * 60 * 1000; // 5 minutes in ms
//     const valid = Date.now() < (expiresAt - buffer);

//     console.log('🔍 Client token valid check:', {
//       hasToken: !!token,
//       expiresAt: new Date(expiresAt).toLocaleTimeString(),
//       now: new Date(Date.now()).toLocaleTimeString(),
//       valid,
//     });

//     return valid;
//   }

//   /**
//    * Fetch new token from API and cache it
//    */
//   private async fetchToken(): Promise<string> {
//     const response = await fetch('/api/v1/auth/machine-token');

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ Failed to fetch client token:', response.status, errorText);
//       throw new Error(`Failed to fetch machine token: ${response.status}`);
//     }

//     const data = await response.json();

//     // Calculate expiry with 5min buffer
//     const expiresInMs = (data.expires_in || 3600) * 1000;
//     const expiresAt = Date.now() + expiresInMs;

//     // Store in sessionStorage
//     sessionStorage.setItem(this.STORAGE_KEY, data.token);
//     sessionStorage.setItem(this.EXPIRES_KEY, expiresAt.toString());

//     console.log('📊 Client token cached:', {
//       expiresIn: data.expires_in,
//       validUntil: new Date(expiresAt).toLocaleString(),
//     });

//     return data.token;
//   }

//   /**
//    * Clear cached token
//    */
//   clearToken(): void {
//     sessionStorage.removeItem(this.STORAGE_KEY);
//     sessionStorage.removeItem(this.EXPIRES_KEY);
//     console.log('🗑️ Client token cleared');
//   }

//   /**
//    * Get token expiry info (for debugging)
//    */
//   getTokenInfo(): { token: string | null; expiresAt: number; isValid: boolean } {
//     const token = sessionStorage.getItem(this.STORAGE_KEY);
//     const expiresAt = parseInt(sessionStorage.getItem(this.EXPIRES_KEY) || '0');
//     return {
//       token: token ? `${token.substring(0, 20)}...` : null,
//       expiresAt,
//       isValid: this.isValid(),
//     };
//   }
// }

// export const clientMachineTokenManager = new ClientMachineTokenManager();
