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
      user: {
        id: string;
        username: string;
      };
      player: {
        id: string;
        name: string;
      };
    }
    interface PageData {
      flash?: { type?: string; message?: string } | null;
    }
    // interface Platform {}
  }
}

export {};
