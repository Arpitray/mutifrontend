export async function POST(req) {
  try {
    const body = await req.json();
    
    if (!body.topic) {
      return Response.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    console.log(`[API Route] Proxying research request for topic: ${body.topic}`);

    const startTime = Date.now();
    
    const response = await fetch("http://127.0.0.1:8000/api/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Increase timeout to 5 minutes for long-running requests
      timeout: 5 * 60 * 1000,
    });

    const elapsed = Date.now() - startTime;
    console.log(`[API Route] Backend response status: ${response.status} (took ${elapsed}ms)`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Route] Backend error: ${errorText}`);
      return Response.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API Route] Successfully proxied response, response size: ${JSON.stringify(data).length} bytes`);
    
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(`[API Route] Error:`, error.message);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
