import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema } from "@shared/schema";
import session from "express-session";
import fileupload from "express-fileupload";
import multer from "multer";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
    username?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for admin authentication'

  app.use("/uploads", express.static("uploads"));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "masvingo-council-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Middleware to check if admin is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // PUBLIC ROUTES - Application submission and tracking

  // const upload = multer({ dest: "uploads/" }); // Save files to uploads/ directory

  app.use(fileupload());

  // In your route registration
  app.post("/api/applications/upload", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No files were uploaded.",
      });
    }
    // return res.json({ files: req.files?.documents?.map((file) => file.name) });

    const files = req.files?.documents;

    let fileArray: any[] = [];

    if (Array.isArray(files)) {
      fileArray = files;
    } else if (files) {
      fileArray = [files];
    }

    const fileNames = fileArray.map((file) => file.name);

    const fileUrls = fileArray?.map((file) => {
      // Access the uploaded file

      const fileName = file.name;
      const splitExt = fileName.split(".").pop();
      const randomNumber = new Date().getTime().toString();
      const uploadCombinedName = `${randomNumber}.${splitExt}`;

      // Move the file to the desired location
      file.mv(`./uploads/${uploadCombinedName}`, (err: any) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: err,
          });
        }
      });
      return `/uploads/${uploadCombinedName}`;
    });

    if (req?.params?.id) {
      // Attach documents to application
      storage.attachDocuments(req.params.id, fileUrls);
    }
    res.json({ files: fileUrls });
  });

  // Upload files to a specific application
  app.post("/api/applications/upload/:id", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No files were uploaded.",
      });
    }
    // return res.json({ files: req.files?.documents?.map((file) => file.name) });

    const files = req.files?.documents;

    let fileArray: any[] = [];

    if (Array.isArray(files)) {
      fileArray = files;
    } else if (files) {
      fileArray = [files];
    }

    const fileNames = fileArray.map((file) => file.name);

    const fileUrls = fileArray?.map((file) => {
      // Access the uploaded file

      const fileName = file.name;
      const splitExt = fileName.split(".").pop();
      const randomNumber = new Date().getTime().toString();
      const uploadCombinedName = `${randomNumber}.${splitExt}`;

      // Move the file to the desired location
      file.mv(`./uploads/${uploadCombinedName}`, (err: any) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: err,
          });
        }
      });
      return `/uploads/${uploadCombinedName}`;
    });

    if (req?.params?.id) {
      // Attach documents to application
      storage.attachDocuments(req.params.id, fileUrls);
    }
    res.json({ files: fileUrls, id: req?.params?.id });
  });
  // Submit new application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.json(application);
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Invalid application data" });
    }
  });

  // Track application by reference number
  app.get("/api/applications/track/:referenceNumber", async (req, res) => {
    try {
      const application = await storage.getApplicationByReference(
        req.params.referenceNumber
      );

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // ADMIN ROUTES - Authentication and management

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);

      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session.adminId = admin.id;
      req.session.username = admin.username;

      res.json({
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Check admin session
  app.get("/api/admin/session", (req, res) => {
    if (req.session.adminId) {
      res.json({
        authenticated: true,
        adminId: req.session.adminId,
        username: req.session.username,
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Get all applications (admin only)
  app.get("/api/admin/applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Get single application (admin only)
  app.get("/api/admin/applications/:id", requireAuth, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // Update application status (admin only)
  app.patch(
    "/api/admin/applications/:id/status",
    requireAuth,
    async (req, res) => {
      try {
        const { status, adminNotes } = req.body;

        if (
          !["submitted", "under_review", "approved", "rejected"].includes(
            status
          )
        ) {
          return res.status(400).json({ error: "Invalid status" });
        }

        const application = await storage.updateApplicationStatus(
          req.params.id,
          status,
          req.session.username,
          adminNotes
        );

        if (!application) {
          return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
      } catch (error: any) {
        res.status(500).json({ error: "Failed to update application" });
      }
    }
  );

  // Statistics endpoint (admin only)
  app.get("/api/admin/statistics", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();

      const stats = {
        total: applications.length,
        submitted: applications.filter((a) => a.status === "submitted").length,
        under_review: applications.filter((a) => a.status === "under_review")
          .length,
        approved: applications.filter((a) => a.status === "approved").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
        pending: applications.filter(
          (a) => a.status === "submitted" || a.status === "under_review"
        ).length,
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
