-- Optional Stripe Payment Link or hosted-invoice URL shown to clients as "Pay now".
-- Plain ADD COLUMN: invoices cascades from clients, so never rebuild this table.
ALTER TABLE invoices ADD COLUMN payment_url TEXT;
