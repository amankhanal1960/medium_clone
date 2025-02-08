This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

About the authentication

1. User Registration: When a user signs up, the frontend sends their information to `/api/users`. This route checks if the user exists, and if not, creates a new user with a hashed password.

2. User Authentication: When a user logs in, NextAuth handles the authentication. For credentials login, it checks the provided email and password against the stored user data. For Google login, it either finds an existing user or creates a new one.

3. Session Management: After successful authentication, NextAuth creates a session and JWT, which are used to keep the user logged in and to identify them in subsequent requests.

4. Database Operations: All database operations are performed after establishing a connection using the `connect` function from `lib/db.ts`.

5. Data Security: Passwords are hashed before storage, and the hashing is done in the API route rather than in the model, giving more control over the process.

This setup provides a clear separation of concerns:

- User registration is handled by a dedicated API route.
- Authentication is managed by NextAuth.
- The database model focuses on defining the data structure.
- Database connections are managed consistently across all operations.

By separating these concerns and handling each aspect in its appropriate place, the system becomes more maintainable, secure, and easier to understand and debug. This is a key principle in building robust Next.js applications.
