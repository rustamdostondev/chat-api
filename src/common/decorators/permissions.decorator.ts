import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(
    PERMISSIONS_KEY,
    permissions.map((p) => p.toLowerCase()),
  );
