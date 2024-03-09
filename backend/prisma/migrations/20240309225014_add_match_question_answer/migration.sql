/*
  Warnings:

  - The primary key for the `MatchQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MatchQuestion" DROP CONSTRAINT "MatchQuestion_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MatchQuestion_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "MatchQuestionAnswer" (
    "matchQuestionId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MatchQuestionAnswer_pkey" PRIMARY KEY ("matchQuestionId","answerId","userId")
);

-- AddForeignKey
ALTER TABLE "MatchQuestionAnswer" ADD CONSTRAINT "MatchQuestionAnswer_matchQuestionId_fkey" FOREIGN KEY ("matchQuestionId") REFERENCES "MatchQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchQuestionAnswer" ADD CONSTRAINT "MatchQuestionAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchQuestionAnswer" ADD CONSTRAINT "MatchQuestionAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
