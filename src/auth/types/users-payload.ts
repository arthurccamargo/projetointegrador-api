export interface UserPayload {
  sub: string; // userId
  email: string;
  role: "VOLUNTEER" | "ONG" | "ADMIN";
}
