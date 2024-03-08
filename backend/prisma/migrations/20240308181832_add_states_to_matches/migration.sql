/*
  Warnings:

  - Added the required column `state` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchState" AS ENUM ('WAITING', 'PLAYING', 'FINISHED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "state" "MatchState" NOT NULL;
