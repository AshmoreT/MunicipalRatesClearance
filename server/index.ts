import crypto from "crypto";

// Simple Blockchain Audit Log
class AuditBlock {
  constructor(
    public index: number,
    public timestamp: string,
    public action: string,
    public data: any,
    public previousHash: string
  ) {
    this.hash = this.computeHash();
  }
  hash: string;
  computeHash() {
    return crypto.createHash("sha256")
      .update(this.index + this.timestamp + this.action + JSON.stringify(this.data) + this.previousHash)
      .digest("hex");
  }
}

class AuditBlockchain {
  chain: AuditBlock[] = [];
  constructor() {
    // Genesis block
    this.chain.push(new AuditBlock(0, new Date().toISOString(), "GENESIS", {}, "0"));
  }
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(action: string, data: any) {
    const prev = this.getLastBlock();
    const block = new AuditBlock(
      prev.index + 1,
      new Date().toISOString(),
      action,
      data,
      prev.hash
    );
    this.chain.push(block);
    return block;
  }
  verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      const prev = this.chain[i - 1];
      if (block.previousHash !== prev.hash || block.hash !== block.computeHash()) {
        return false;
      }
    }
    return true;
  }
}

const auditLog = new AuditBlockchain();
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
      // Blockchain audit log
      auditLog.addBlock("API_CALL", {
        method: req.method,
        path,
        status: res.statusCode,
        duration,
        response: capturedJsonResponse
      });
    }
  });
  next();
});

// Expose audit log endpoint for admins
(async () => {
  app.get("/api/audit-log", (req, res) => {
    res.json({
      chain: auditLog.chain,
      valid: auditLog.verifyChain()
    });
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
