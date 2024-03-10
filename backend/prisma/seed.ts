import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'alice',
    password: 'password',
  },
  {
    username: 'bob',
    password: 'password',
  },
  {
    username: 'car',
    password: 'password',
  },
  {
    username: 'admin',
    password: 'password',
  }
]

// write me 7 questions with 4 answers each
const questionData: Prisma.QuestionCreateInput[] = [
  {
    body: 'What is the capital of France?',
    answers: {
      create: [
        { body: 'Paris', is_correct: true },
        { body: 'London', is_correct: false },
        { body: 'Berlin', is_correct: false },
        { body: 'Madrid', is_correct: false },
      ],
    },
  },
  {
    body: 'What is the capital of Germany?',
    answers: {
      create: [
        { body: 'Paris', is_correct: false },
        { body: 'London', is_correct: false },
        { body: 'Berlin', is_correct: true },
        { body: 'Madrid', is_correct: false },
      ],
    },
  },
  {
    body: 'What is the capital of Spain?',
    answers: {
      create: [
        { body: 'Paris', is_correct: false },
        { body: 'London', is_correct: false },
        { body: 'Berlin', is_correct: false },
        { body: 'Madrid', is_correct: true },
      ],
    },
  },
  {
    body: 'What is the capital of Italy?',
    answers: {
      create: [
        { body: 'Paris', is_correct: false },
        { body: 'London', is_correct: false },
        { body: 'Rome', is_correct: true },
        { body: 'Madrid', is_correct: false },
      ],
    },
  },
  {
    body: 'What is the capital of the United Kingdom?',
    answers: {
      create: [
        { body: 'Paris', is_correct: false },
        { body: 'London', is_correct: true },
        { body: 'Berlin', is_correct: false },
        { body: 'Madrid', is_correct: false },
      ],
    },
  },
  {
    body: 'What is the capital of the United States?',
    answers: {
      create: [
        { body: 'Washington D.C.', is_correct: true },
        { body: 'New York', is_correct: false },
        { body: 'Los Angeles', is_correct: false },
        { body: 'Chicago', is_correct: false },
      ],
    },
  }
]


async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  for (const q of questionData) {
    const question = await prisma.question.create({
      data: q,
    })
    console.log(`Created question with id: ${question.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
