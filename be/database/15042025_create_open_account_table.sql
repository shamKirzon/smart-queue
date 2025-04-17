CREATE TABLE open_account_receipt(
open_account_receipt_id UUID PRIMARY KEY NOT NULL, 
transaction TEXT DEFAULT 'open_account' , 
queue_number TEXT NOT NULL , 
date TEXT NOT NULL , 
time TEXT NOT NULL
)

