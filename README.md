This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

You can run the application in different modes using the provided helper script:

```bash
# Run locally with local Supabase (.env.local)
./run-app.sh local dev

# Run locally with remote Supabase (.env.production)
./run-app.sh remote dev

# Build for production with remote Supabase
./run-app.sh remote build
```

Alternatively, use the following npm scripts:

```bash
npm run dev:local    # Dev mode + .env.local
npm run dev:remote   # Dev mode + .env.production
npm run build:local  # Build + .env.local
npm run build:remote # Build + .env.production
```

## Docker

To run the container with a specific environment:

```bash
# Example: Local build
docker compose --env-file .env.local up --build
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
