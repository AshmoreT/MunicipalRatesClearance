import { type Application, type InsertApplication, type Admin, type InsertAdmin } from "@shared/schema";
import { randomUUID } from "crypto";
import mysql from "mysql2/promise";

export interface IStorage {
  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationByReference(referenceNumber: string): Promise<Application | undefined>;
  getAllApplications(): Promise<Application[]>;
  updateApplicationStatus(
    id: string,
    status: "submitted" | "under_review" | "approved" | "rejected",
    reviewedBy?: string,
    adminNotes?: string,
    reason?: string
  ): Promise<Application | undefined>;
  attachDocuments(id: string, documents: string[]): Promise<Application | undefined>; // <-- Added
  
  // Admin operations
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MySQLStorage implements IStorage {
  private connection: mysql.Connection | null = null;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'masvingo_clearance',
        port: parseInt(process.env.DB_PORT || '3306'),
      });

      // Create tables if they don't exist
      await this.createTables();
      
      // Create default admin if not exists
      await this.createDefaultAdmin();
      
      console.log('MySQL storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MySQL storage:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.connection) throw new Error('Database connection not established');

    // Create applications table
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(36) PRIMARY KEY,
        reference_number VARCHAR(255) NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        id_number TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        email TEXT,
        property_address TEXT NOT NULL,
        stand_number TEXT NOT NULL,
        property_type TEXT NOT NULL,
        reason TEXT NOT NULL,
        documents JSON,
        uploaded_documents JSON,
        status VARCHAR(20) NOT NULL DEFAULT 'submitted',
        submitted_date DATETIME NOT NULL,
        review_date DATETIME,
        completed_date DATETIME,
        admin_notes TEXT,
        reviewed_by TEXT
      )
    `);

    // Create admins table
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at DATETIME NOT NULL
      )
    `);
  }

  private async createDefaultAdmin() {
    if (!this.connection) throw new Error('Database connection not established');

    const defaultAdminId = randomUUID();
    const [rows]: any = await this.connection.execute(
      'SELECT * FROM admins WHERE username = ?',
      ['admin']
    );

    if (rows.length === 0) {
      await this.connection.execute(
        `INSERT INTO admins (id, username, password, full_name, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [defaultAdminId, 'admin', 'admin123', 'System Administrator', new Date()]
      );
    }
  }

  // Application methods
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    if (!this.connection) throw new Error('Database connection not established');

    const id = randomUUID();
    const referenceNumber = `RCC-2025-${Math.floor(Math.random() * 900000 + 100000)}`;
    const submittedDate = new Date();
    
    const application: Application = {
      id,
      referenceNumber,
      ...insertApplication,
      email: insertApplication.email || null,
      status: "submitted",
      submittedDate,
      reviewDate: null,
      completedDate: null,
      adminNotes: null,
      reviewedBy: null,
      documents: insertApplication.documents || [],
      uploadedDocuments: insertApplication.uploadedDocuments || [],
    };

    await this.connection.execute(
      `INSERT INTO applications (
        id, reference_number, full_name, id_number, phone_number, email,
        property_address, stand_number, property_type, reason, documents,
        uploaded_documents, status, submitted_date, review_date, completed_date,
        admin_notes, reviewed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        application.id,
        application.referenceNumber,
        application.fullName,
        application.idNumber,
        application.phoneNumber,
        application.email,
        application.propertyAddress,
        application.standNumber,
        application.propertyType,
        application.reason,
        JSON.stringify(application.documents || []),
        JSON.stringify(application.uploadedDocuments || []),
        application.status,
        application.submittedDate,
        application.reviewDate,
        application.completedDate,
        application.adminNotes,
        application.reviewedBy
      ]
    );

    return application;
  }

  async getApplication(id: string): Promise<Application | undefined> {
    if (!this.connection) throw new Error('Database connection not established');

    const [rows]: any = await this.connection.execute(
      'SELECT * FROM applications WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return undefined;

    return this.mapRowToApplication(rows[0]);
  }

  async getApplicationByReference(referenceNumber: string): Promise<Application | undefined> {
    if (!this.connection) throw new Error('Database connection not established');

    const [rows]: any = await this.connection.execute(
      'SELECT * FROM applications WHERE reference_number = ?',
      [referenceNumber]
    );

    if (rows.length === 0) return undefined;

    return this.mapRowToApplication(rows[0]);
  }

  async getAllApplications(): Promise<Application[]> {
    if (!this.connection) throw new Error('Database connection not established');

    const [rows]: any = await this.connection.execute(
      'SELECT * FROM applications ORDER BY submitted_date DESC'
    );

    return rows.map((row: any) => this.mapRowToApplication(row));
  }

  async updateApplicationStatus(
    id: string,
    status: "submitted" | "under_review" | "approved" | "rejected",
    reviewedBy?: string,
    adminNotes?: string,
    reason?: string,
  ): Promise<Application | undefined> {
    if (!this.connection) throw new Error('Database connection not established');

    const application = await this.getApplication(id);
    if (!application) return undefined;

    const now = new Date();
    const reviewDate = application.reviewDate || now;
    const completedDate = (status === "approved" || status === "rejected") ? now : application.completedDate;

    await this.connection.execute(
      `UPDATE applications
       SET status = ?, reviewed_by = ?, admin_notes = ?, reason = ?,
           review_date = ?, completed_date = ?
       WHERE id = ?`,
      [
        status,
        reviewedBy || application.reviewedBy,
        adminNotes || application.adminNotes,
        reason || application.reason,
        reviewDate,
        completedDate,
        id
      ]
    );

    return {
      ...application,
      status,
      reviewedBy: reviewedBy || application.reviewedBy,
      adminNotes: adminNotes || application.adminNotes,
      reason: reason || application.reason,
      reviewDate,
      completedDate,
    };
  }

  async attachDocuments(id: string, documents: string[]): Promise<Application | undefined> {
    if (!this.connection) throw new Error('Database connection not established');

    const application = await this.getApplication(id);
    if (!application) return undefined;

    const currentDocuments = application.documents || [];
    const updatedDocuments = [...currentDocuments, ...documents];
    const now = new Date();

    await this.connection.execute(
      `UPDATE applications
       SET documents = ?, uploaded_documents = ?, status = 'under_review', review_date = ?
       WHERE id = ?`,
      [
        JSON.stringify(updatedDocuments),
        JSON.stringify(updatedDocuments),
        now,
        id
      ]
    );

    return {
      ...application,
      documents: updatedDocuments,
      uploadedDocuments: updatedDocuments,
      status: "under_review",
      reviewDate: now,
    };
  }

  // Admin methods
  async getAdmin(id: string): Promise<Admin | undefined> {
    if (!this.connection) throw new Error('Database connection not established');

    const [rows]: any = await this.connection.execute(
      'SELECT * FROM admins WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return undefined;

    return this.mapRowToAdmin(rows[0]);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    if (!this.connection) throw new Error('Database connection not established');

    const [rows]: any = await this.connection.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) return undefined;

    return this.mapRowToAdmin(rows[0]);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    if (!this.connection) throw new Error('Database connection not established');

    const id = randomUUID();
    const admin: Admin = {
      ...insertAdmin,
      id,
      createdAt: new Date(),
    };

    await this.connection.execute(
      'INSERT INTO admins (id, username, password, full_name, created_at) VALUES (?, ?, ?, ?, ?)',
      [admin.id, admin.username, admin.password, admin.fullName, admin.createdAt]
    );

    return admin;
  }

  private mapRowToApplication(row: any): Application {
    return {
      id: row.id,
      referenceNumber: row.reference_number,
      fullName: row.full_name,
      idNumber: row.id_number,
      phoneNumber: row.phone_number,
      email: row.email,
      propertyAddress: row.property_address,
      standNumber: row.stand_number,
      propertyType: row.property_type,
      reason: row.reason,
      documents: row.documents ? JSON.parse(row.documents) : [],
      uploadedDocuments: row.uploaded_documents ? JSON.parse(row.uploaded_documents) : [],
      status: row.status,
      submittedDate: row.submitted_date,
      reviewDate: row.review_date,
      completedDate: row.completed_date,
      adminNotes: row.admin_notes,
      reviewedBy: row.reviewed_by,
    };
  }

  private mapRowToAdmin(row: any): Admin {
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      fullName: row.full_name,
      createdAt: row.created_at,
    };
  }
}

export const storage = new MySQLStorage();
