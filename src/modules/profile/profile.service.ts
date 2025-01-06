import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';
import { IApiResponse } from '@common/interfaces/api-response.interface';
import { CustomApiResponse } from '@common/utils/api-response.util';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(user: any) {
    const data = await this.prisma.$queryRawUnsafe(
      `
      select 
        cp.id                      as profile_id,
        coalesce(au.name, dd.name) as name,
        coalesce(au.role, dd.role) as role,
        au.id                      as user_id,
        dd.id                      as doctor_id
      from chat.profiles as cp
        left join auth.users as au on au.id = cp."user_id" and au.is_deleted is false
        left join doctor.doctors as dd on dd.id = cp."doctor_id" and dd.is_deleted is false
      where cp."user_id" = $1
    `,
      user.id,
    );

    return CustomApiResponse.success(data);
  }

  async getProfiles() {
    const data = await this.prisma.$queryRawUnsafe(`
      select 
        cp.id                      as profile_id,
        coalesce(au.name, dd.name) as name,
        coalesce(au.role, dd.role) as role,
        au.id                      as user_id,
        dd.id                      as doctor_id
      from chat.profiles as cp
        left join auth.users as au on au.id = cp."user_id" and au.is_deleted is false
        left join doctor.doctors as dd on dd.id = cp."doctor_id" and dd.is_deleted is false
    `);

    return CustomApiResponse.success(data);
  }

  async getProfileById(id: string): Promise<IApiResponse<Profile>> {
    const data = await this.prisma.profile.findFirst({
      where: { id },
    });

    return CustomApiResponse.success(data);
  }
}
