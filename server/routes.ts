import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  const httpServer = createServer(app);
  const port = parseInt(process.env.PORT || "5000", 10);
  
  return new Promise((resolve) => {
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`  ➜ Network: http://0.0.0.0:${port}/`);
      resolve(httpServer);
    });
  });
}
