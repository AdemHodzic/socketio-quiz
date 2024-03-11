# Adem's Real-time Trivia Quiz

This project is a simple "Who Want to be a Millionare?" clone

### How to run

#### Backend

Make sure you have Node.js 18 installed. I tried to dockerize everything but new Prisma version has issues with connecting to Postgres when in Docker

```
cd backend
docker-compose up
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend is now running on http://localhost:3000.

#### Frontend

Requires Node.js 18.

```
cd frontend
npm install
npm run dev
```

Frontend is now running on http://localhost:5173.

### Default credentials

Regular user:
```
username: alice
password: password
```

Admin user:
```
username: admin
password: password
```