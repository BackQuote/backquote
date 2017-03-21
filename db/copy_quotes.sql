delete from ticker;
delete from quote;
delete from day;
ALTER SEQUENCE day_id_seq RESTART with 1;
ALTER SEQUENCE quote_id_seq RESTART with 1;
COPY quote (open, high, low, close, timestamp, day_id, ticker) FROM 'quotes';