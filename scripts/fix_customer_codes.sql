UPDATE customers SET code = CONCAT('CUST-', LPAD(ROW_NUMBER() OVER (ORDER BY created_at), 3, '0')) WHERE code IS NULL;
