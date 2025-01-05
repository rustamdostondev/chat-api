-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "chat";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "doctor";

-- CreateTable
CREATE TABLE "chat"."profiles" (
    "id" VARCHAR(24) NOT NULL,
    "doctorId" VARCHAR(24),
    "userId" VARCHAR(24),
    "roomId" VARCHAR(24),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."rooms" (
    "id" VARCHAR(24) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."room_profiles" (
    "id" VARCHAR(24) NOT NULL,
    "profileId" VARCHAR(24) NOT NULL,
    "roomId" VARCHAR(24) NOT NULL,

    CONSTRAINT "room_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."messages" (
    "id" VARCHAR(24) NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomProfileId" VARCHAR(24) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_doctorId_key" ON "chat"."profiles"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "chat"."profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "chat"."rooms"("name");

-- AddForeignKey
ALTER TABLE "chat"."profiles" ADD CONSTRAINT "profiles_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat"."rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."room_profiles" ADD CONSTRAINT "room_profiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "chat"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."room_profiles" ADD CONSTRAINT "room_profiles_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."messages" ADD CONSTRAINT "messages_roomProfileId_fkey" FOREIGN KEY ("roomProfileId") REFERENCES "chat"."room_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
