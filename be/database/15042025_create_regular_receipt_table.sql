CREATE TABLE regular_receipt(
regular_receipt_id UUID PRIMARY KEY NOT NULL, 
transaction TEXT[] NOT NULL  , 
queue_number TEXT NOT NULL , 
date TEXT NOT NULL , 
time TEXT NOT NULL
)




