/*
  Warnings:

  - You are about to drop the column `createdAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `roomProfileId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `room_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `room_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctor_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room_profile_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `room_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_id` to the `room_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat"."messages" DROP CONSTRAINT "messages_roomProfileId_fkey";

-- DropForeignKey
ALTER TABLE "chat"."profiles" DROP CONSTRAINT "profiles_roomId_fkey";

-- DropForeignKey
ALTER TABLE "chat"."room_profiles" DROP CONSTRAINT "room_profiles_profileId_fkey";

-- DropForeignKey
ALTER TABLE "chat"."room_profiles" DROP CONSTRAINT "room_profiles_roomId_fkey";

-- DropIndex
DROP INDEX "chat"."profiles_doctorId_key";

-- DropIndex
DROP INDEX "chat"."profiles_userId_key";

-- AlterTable
ALTER TABLE "chat"."messages" DROP COLUMN "createdAt",
DROP COLUMN "roomProfileId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(24),
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" VARCHAR(24),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "room_profile_id" VARCHAR(24) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" VARCHAR(24);

-- AlterTable
ALTER TABLE "chat"."profiles" DROP COLUMN "doctorId",
DROP COLUMN "roomId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(24),
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" VARCHAR(24),
ADD COLUMN     "doctor_id" VARCHAR(24),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "room_id" VARCHAR(24),
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" VARCHAR(24),
ADD COLUMN     "user_id" VARCHAR(24);

-- AlterTable
ALTER TABLE "chat"."room_profiles" DROP COLUMN "profileId",
DROP COLUMN "roomId",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(24),
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" VARCHAR(24),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_id" VARCHAR(24) NOT NULL,
ADD COLUMN     "room_id" VARCHAR(24) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" VARCHAR(24);

-- AlterTable
ALTER TABLE "chat"."rooms" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(24),
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" VARCHAR(24),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" VARCHAR(24);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_doctor_id_key" ON "chat"."profiles"("doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "chat"."profiles"("user_id");

-- AddForeignKey
ALTER TABLE "chat"."profiles" ADD CONSTRAINT "profiles_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat"."rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."room_profiles" ADD CONSTRAINT "room_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "chat"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."room_profiles" ADD CONSTRAINT "room_profiles_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."messages" ADD CONSTRAINT "messages_room_profile_id_fkey" FOREIGN KEY ("room_profile_id") REFERENCES "chat"."room_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
