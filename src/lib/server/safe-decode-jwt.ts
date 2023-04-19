import jwtDecode, { type JwtPayload } from 'jwt-decode';

export function safeDecode(jwt: string): JwtPayload | null {
  try {
    return jwtDecode(jwt);
  } catch {
    return null;
  }
}
