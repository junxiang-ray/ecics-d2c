export interface LoginResponse {
  state: string;
  nonce: string;
  code_verifier: string;
  url: string;
}

export interface UserInfoPayload {
  nonce: string;
  code_verifier: string;
  state: string;
}
