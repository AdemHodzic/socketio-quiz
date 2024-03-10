import prisma from "../db"

export const cancelMatch = async (matchId: number) => {
    const match = await prisma.match.update({ where: { id: matchId }, data: { state: 'CANCELLED' } });
    return match;
}

export const finishMatch = async (matchId: number) => {
    const userResults = await prisma.$queryRawUnsafe<{
        user_id: number;
        answer_count: number;
    }[]>(`
        SELECT
            u.id AS user_id,
            count(mq.id) AS answer_count
        FROM
            "User" u
        INNER JOIN "MatchQuestion" mq ON mq."userId" = u.id AND mq."matchId" = ${matchId}
        GROUP BY u.id
    `);

    let winnerId = null;


    if (userResults[0]?.answer_count > userResults[1]?.answer_count) {
        winnerId = userResults[0].user_id;
    } else if (userResults[0]?.answer_count < userResults[1]?.answer_count) {
        winnerId = userResults[1].user_id;
    }

    const match = await prisma.match.update({ where: { id: matchId }, data: { state: 'FINISHED', userId: winnerId } });
    return match;
}