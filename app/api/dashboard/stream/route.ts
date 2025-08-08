import { NextRequest } from 'next/server';

const NATUREOS_API_BASE = process.env.NATUREOS_API_URL || 'https://natureos-api.mycosoft.com';
const API_KEY = process.env.NATUREOS_API_KEY;

// Helper to transform dashboard payload into shape expected by website components
async function fetchDashboardData() {
  const response = await fetch(`${NATUREOS_API_BASE}/api/mycosoft/website/dashboard`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`NatureOS API error: ${response.status}`);
  }

  const dashboardData = await response.json();

  return {
    stats: {
      totalEvents: dashboardData.totalEvents,
      activeDevices: dashboardData.activeDevices,
      speciesDetected: dashboardData.speciesDetected,
      onlineUsers: dashboardData.onlineUsers,
    },
    liveData: {
      readings: dashboardData.liveReadings.map((reading: any) => ({
        device: reading.deviceId,
        value: reading.value,
        timestamp: reading.timestamp,
        status: 'active',
      })),
      lastUpdate: new Date().toISOString(),
    },
    insights: {
      trendingCompounds: dashboardData.trendingCompounds,
      recentDiscoveries: dashboardData.recentDiscoveries,
    },
    networkHealth: {
      status: 'optimal',
      connections: dashboardData.activeDevices,
      throughput: '2.4 MB/s',
    },
  };
}

export async function GET(_request: NextRequest) {
  const encoder = new TextEncoder();

  let interval: NodeJS.Timeout;
  const stream = new ReadableStream({
    async start(controller) {
      async function pushUpdate() {
        try {
          const data = await fetchDashboardData();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (err: any) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${err.message}\n\n`));
        }
      }

      // Send initial update immediately
      await pushUpdate();

      interval = setInterval(pushUpdate, 5000);
    },
    cancel() {
      if (interval) clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
