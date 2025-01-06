import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}
  async getProfiles(): Promise<Profile[]> {
    return this.prisma.$queryRawUnsafe(`
      select 
        cp.id                      as profile_id,
        coalesce(au.name, dd.name) as name,
        coalesce(au.role, dd.role) as role,
        au.id                      as user_id,
        dd.id                      as doctor_id
      from chat.profiles as cp
        left join auth.users as au on au.id = cp."userId" and au.is_deleted is false
        left join doctor.doctors as dd on dd.id = cp."doctorId" and dd.is_deleted is false
    `);
  }

  async getProfileById(id: string): Promise<Profile> {
    return this.prisma.profile.findFirst({
      where: { id },
    });
  }

  async deleteProfile(id: string): Promise<Profile> {
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}
