// api/cron.js

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("🕒 Cron job executed at", new Date());

  // Example: Do some real task here like calling the processor
  // await runProcessorTask();

  return new Response("✅ Cron job ran at " + new Date().toISOString());
}
