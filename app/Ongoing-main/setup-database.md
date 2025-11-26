# Database Setup Instructions

## Step 1: Create Environment File
Create a `.env.local` file in your project root with:

```
DATABASE_URL="postgresql://neondb_owner:npg_7sRXiAOTJKC8@ep-jolly-rain-a8eqceic-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Generate Prisma Client
Run this command:
```bash
pnpm exec prisma generate
```

## Step 3: Push Schema to Database
Run this command:
```bash
pnpm exec prisma db push
```

## Step 4: Seed the Database (Optional)
Once the schema is pushed, you can run:
```bash
pnpm exec prisma db seed
```

## Troubleshooting
- If you get "prisma not found" errors, try `npx prisma` instead of `pnpm prisma`
- Make sure your `.env.local` file is in the project root
- Verify your Neon database connection string is correct
