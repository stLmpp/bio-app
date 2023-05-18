import { SCORE_LEADERBOARD_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import {
  ScoreGetLeaderboardSchema,
  type ScoreGetLeaderboardQuery,
} from '../schemas/score-get-leaderboard.schema';

export class ScoreService {
  private constructor(private readonly _fetch: typeof fetch) {}

  getLeaderboard(platformGameMiniGameModeId: string, query: ScoreGetLeaderboardQuery) {
    return httpServer(SCORE_LEADERBOARD_END_POINT, {
      fetch: this._fetch,
      query: {
        platformGameMiniGameModeId,
        page: query.page,
      },
      schema: ScoreGetLeaderboardSchema,
    });
  }

  static create(_fetch: typeof fetch) {
    return new ScoreService(_fetch);
  }
}
