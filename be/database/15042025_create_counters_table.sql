-- ADD THIS FIRST: 
CREATE TYPE counter_status AS ENUM ('available', 'inuse');


-- THEN THIS:
CREATE TABLE counters (
    counter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counter_name TEXT, 
    status counter_status NOT NULL DEFAULT 'available', 
    regular_receipt_id UUID,
    priority_receipt_id UUID,
    open_account_receipt_id UUID,
    FOREIGN KEY (regular_receipt_id) REFERENCES regular_receipt(regular_receipt_id) ON DELETE SET NULL ,
    FOREIGN KEY (priority_receipt_id) REFERENCES priority_receipt(priority_receipt_id) ON DELETE SET NULL,
    FOREIGN KEY (open_account_receipt_id) REFERENCES open_account_receipt(open_account_receipt_id) ON DELETE SET NULL)


-- INSERT THESE: 

INSERT INTO counters(counter_name)
VALUES
    ('counter_1'), 
    ('counter_2'), 
    ('counter_3'), 
    ('counter_4'), 
    ('counter_A1'), 
    ('counter_P1')