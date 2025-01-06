import { PrismaClient } from '@prisma/client';
import { objectId } from '../src/utils';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.profile.deleteMany();
  await prisma.room.deleteMany();
  await prisma.message.deleteMany();
  await prisma.roomProfile.deleteMany();

  await prisma.$executeRawUnsafe(`
    delete from "auth"."users";
  `);

  await prisma.$executeRawUnsafe(`
    delete from "doctor"."doctors";
  `);

  // Create "auth.users" table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "auth"."users" (
      "id" VARCHAR(24) NOT NULL PRIMARY KEY,
      name TEXT,
      role TEXT,
      token TEXT,
      "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  // Create "doctor.doctors" table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "doctor"."doctors" (
      "id" VARCHAR(24) NOT NULL PRIMARY KEY,
      name TEXT,
      role TEXT,
      token TEXT,
      "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await prisma.$executeRawUnsafe(`
  insert into "auth"."users" (id, name, role, token) values ('661e77cd00fead1dad4ba273','Simple User','user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWU3N2NkMDBmZWFkMWRhZDRiYTI3MyIsImlzX3ZlcmlmaWVkIjp0cnVlLCJjcmVhdGVkX2F0IjoiMjAyNC0wNC0xNlQxMzowNjoyMS41NTVaIiwicm9sZSI6InVzZXIiLCJpc19kZWxldGVkIjpmYWxzZSwiY3JlYXRlZF9ieSI6bnVsbCwibGFuZyI6bnVsbCwicGhvbmVfbnVtYmVyIjoiOTk4OTA5OTIzMTI2IiwiZmlyc3RfbmFtZSI6bnVsbCwibGFzdF9uYW1lIjpudWxsLCJiaXJ0aF9kYXRlIjpudWxsLCJmaWxlX2lkIjpudWxsLCJ2ZXJpZmljYXRpb25fYXR0ZW1wdCI6IjEiLCJibG9ja2VkX2F0IjpudWxsLCJhdHRlbXB0X2NvdW50IjowLCJpYXQiOjE3MTMyNzM3NTd9.Bmdxsm5L3bauRUd8bWEd_0wnOLyGP389bSfCjzwe27o');
`);

  await prisma.$executeRawUnsafe(`
  insert into "doctor"."doctors" (id, name, role, token) values ('66ffbde09dafdb0001b809b8','Simple Doctor','doctor', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmZiZGUwOWRhZmRiMDAwMWI4MDliOCIsImlzX2RlbGV0ZWQiOmZhbHNlLCJvcmdfaWQiOiI2NjRlMmM5MzBiMDBlYzNkMTE4NjhlMzkiLCJwaG9uZV9udW1iZXIiOiI5OTg5MDg5MDk0OTQiLCJwYXNzd29yZCI6IiQyYiQxMCRLaks1WDVqOHJNaFloTHRVVi4ya1FPRWQ0eDkvcXVvZVZMVWM3LjAubDEzaWNwUy9hdndrUyIsImNyZWF0ZWRfYXQiOiIyMDI0LTEwLTA0VDEwOjA1OjIwLjQ3NFoiLCJpc192ZXJpZmllZCI6dHJ1ZSwiYmxvY2tlZF9hdCI6bnVsbCwidmVyaWZpY2F0aW9uX2F0dGVtcHQiOiIwIiwiYmlydGhfZGF0ZSI6IjE5OTAtMDYtMDEiLCJnZW5kZXIiOiJtYWxlIiwiZmlsZV9wYXRoIjpudWxsLCJmaXJzdF9uYW1lIjoiVGltdXIiLCJsYXN0X25hbWUiOiJUZXN0Iiwic3BlY2lhbHR5X2lkIjpudWxsLCJyb2xlIjoiZG9jdG9yIiwicm9vbSI6IjEwMyIsImZsb29yIjoiMSIsInNwZWNpYWx0eV9pZHMiOlsiNWViM2Q2NjhiMzFkZTVkNTg4ZjQyOTMxIiwiNWViM2Q2NjhiMzFkZTVkNTg4ZjQyOTJjIl0sImlhdCI6MTczNDM0NDMzNX0.ItHBLwsLIv5LQjhLjQjwQN1urd5lDMksI0Fg1jla_eo');
`);

  // Create test users (profiles)
  const user1 = await prisma.profile.create({
    data: {
      id: objectId(),
      userId: '661e77cd00fead1dad4ba273',
      createdBy: 'SYSTEM',
    },
  });

  const doctor1 = await prisma.profile.create({
    data: {
      id: objectId(),
      doctorId: '66ffbde09dafdb0001b809b8',
      createdBy: 'SYSTEM',
    },
  });

  // Create test rooms
  const room1 = await prisma.room.create({
    data: {
      id: objectId(),
      name: 'General',
      createdBy: 'SYSTEM',
    },
  });

  // Create room profiles (connecting users to rooms)
  const roomProfile1 = await prisma.roomProfile.create({
    data: {
      id: objectId(),
      profileId: user1.id,
      roomId: room1.id,
      createdBy: 'SYSTEM',
    },
  });

  const roomProfile2 = await prisma.roomProfile.create({
    data: {
      id: objectId(),
      profileId: doctor1.id,
      roomId: room1.id,
      createdBy: 'SYSTEM',
    },
  });

  // Create some test messages
  await prisma.message.create({
    data: {
      id: objectId(),
      text: 'Hello everyone!',
      roomProfileId: roomProfile1.id,
      createdBy: user1.id,
    },
  });

  await prisma.message.create({
    data: {
      id: objectId(),
      text: 'Hi there!',
      roomProfileId: roomProfile2.id,
      createdBy: doctor1.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
