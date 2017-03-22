delete from quote;
COPY quote (open, high, low, close, timestamp, day_id, ticker) FROM 'quotes';