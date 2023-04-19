// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      status: number;
      error: string;
    }
    interface Locals {
      user?: {
        userId: bigint;
        username: string;
        admin: boolean;
      } | null;
      player?: {
        playerId: bigint;
        name: string;
      } | null;
    }
    interface PageData {
      flash?: { type?: string; message?: string } | null;
    }
    // interface Platform {}
  }
}

export {};
