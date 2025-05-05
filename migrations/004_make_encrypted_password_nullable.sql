-- Migration: Make encrypted_password nullable in customers table
ALTER TABLE customers ALTER COLUMN encrypted_password DROP NOT NULL; 