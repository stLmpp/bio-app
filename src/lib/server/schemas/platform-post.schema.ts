import { PlatformSchema } from './platform.schema';

export const PlatformPostSchema = PlatformSchema;

export interface PlatformPostBody {
  name: string;
  shortName: string;
}
