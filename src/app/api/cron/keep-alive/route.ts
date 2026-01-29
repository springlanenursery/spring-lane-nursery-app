import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

/**
 * MongoDB Keep-Alive Cron Job
 *
 * Purpose: Prevents MongoDB Atlas free tier (M0) clusters from auto-pausing
 * after 60 days of inactivity. This endpoint is called every 10 days by
 * Vercel Cron to keep the cluster active.
 *
 * Schedule: "0 0 *\/10 * *" (midnight UTC every 10 days)
 * Path: /api/cron/keep-alive
 */

export async function GET(request: NextRequest) {
  // Verify authorization using CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    console.error("CRON_SECRET environment variable is not configured");
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error",
      },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn("Unauthorized keep-alive attempt");
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  // Create a fresh MongoDB client for this ping operation
  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    await client.connect();

    const db = client.db(process.env.MONGODB_DB_NAME || "nursery_app");

    // Execute ping command to keep the cluster active
    const result = await db.command({ ping: 1 });

    if (result.ok === 1) {
      console.log(
        `MongoDB keep-alive ping successful at ${new Date().toISOString()}`
      );

      return NextResponse.json(
        {
          success: true,
          message: "MongoDB cluster pinged successfully",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      throw new Error("Ping command did not return ok: 1");
    }
  } catch (error) {
    console.error("MongoDB keep-alive ping failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to ping MongoDB cluster",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // Always close the connection to clean up resources
    await client.close();
  }
}