# Vercel Deployment Instructions

## Issue 1: Mongoose in Edge Runtime

When deploying to Vercel, you might encounter the following error:

```
Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime
```

This happens because Mongoose uses dynamic code evaluation, which is not allowed in the Edge Runtime.

## Solution for Issue 1

We've added the following to fix this issue:

1. Added `export const runtime = 'nodejs'` to all API routes that use Mongoose
2. Created a configuration file at `src/app/api/config.ts` to set the default runtime for all API routes

## Issue 2: Mongoose in Middleware

You might also encounter this error:

```
Middleware error: [TypeError: mongoose__WEBPACK_IMPORTED_MODULE_0___default(...).connect is not a function]
```

This happens because the middleware runs in an Edge Runtime environment, which doesn't support Mongoose.

## Solution for Issue 2

We've implemented the following solution:

1. Removed Mongoose usage from the middleware
2. Created a new API endpoint at `/api/user/activity` to update the user's last active time
3. Added a client-side component `UserActivityTracker` that calls this API endpoint periodically

## Deployment Steps

1. Push your changes to GitHub
2. Connect your GitHub repository to Vercel
3. In the Vercel deployment settings, make sure to:
   - Set the Framework Preset to Next.js
   - Set the Node.js version to 18.x or higher
   - Add your environment variables (MONGODB_URI, etc.)

## Environment Variables

Make sure to add the following environment variables in your Vercel project settings:

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js
- `NEXTAUTH_URL`: The URL of your deployed application

## Troubleshooting

If you still encounter issues:

1. Check the Vercel deployment logs for specific errors
2. Make sure all API routes that use Mongoose have the `export const runtime = 'nodejs'` directive
3. Verify that your MongoDB connection string is correct and accessible from Vercel's servers
4. If you see middleware errors, make sure the middleware is not using Mongoose directly 