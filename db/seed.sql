--
-- PostgreSQL database seed
--
INSERT INTO public.algorithms (id, name) 
	VALUES (1, 'Algorithm 1');
INSERT INTO public.day (id, date) 
	VALUES (1, '2017-02-21');
INSERT INTO public.quotes (id, price, timestamp, last_of_day, day_id) 
	VALUES (1, 100.00, '2017-02-21 18:00:30.405000', true, 1);
INSERT INTO public.result (id, params, daily_profit_reset, daily_profit_no_reset, cumulative_profit_reset, cumulative_profit_no_reset, day_id) 
	VALUES (1, '{}', 20.00, 50.00, 10.00, 100.00, 1);
INSERT INTO public.trade (id, quantity_reset, quantity_no_reset, action, timestamp, result_id) 
	VALUES (1, 200, 99, 1, '2017-02-21 18:01:16.787000', 1);