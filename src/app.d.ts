// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      status: number;
      error: string;
      errorCode: string;
    }
    interface Locals {
      user?: {
        userId: string;
        username: string;
        admin: boolean;
      } | null;
      player?: {
        playerId: string;
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
