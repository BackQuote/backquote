ALTER TABLE trade DROP CONSTRAINT trade_result_id_fk;
ALTER TABLE trade ADD CONSTRAINT  trade_result_id_fk FOREIGN KEY (result_id) references result (id) ON DELETE CASCADE;

ALTER TABLE result DROP CONSTRAINT result_day_id_fk;
ALTER TABLE result ADD CONSTRAINT  result_day_id_fk FOREIGN KEY (day_id) references day (id) ON DELETE CASCADE;

ALTER TABLE result DROP CONSTRAINT result_simulation_id_fk;
ALTER TABLE result ADD CONSTRAINT  result_simulation_id_fk FOREIGN KEY (simulation_id) references simulation (id) ON DELETE CASCADE;

ALTER TABLE simulation DROP CONSTRAINT simulation_backtest_id_fk;
ALTER TABLE simulation ADD CONSTRAINT  simulation_backtest_id_fk FOREIGN KEY (backtest_id) references backtest (id)  ON DELETE CASCADE;

ALTER TABLE simulation DROP CONSTRAINT simulation_ticker_ticker_fk;
ALTER TABLE simulation ADD CONSTRAINT  simulation_ticker_ticker_fk FOREIGN KEY (ticker) references ticker (ticker)  ON DELETE CASCADE;

ALTER TABLE backtest_ticker DROP CONSTRAINT backtest_ticker_backtest_id_fk;
ALTER TABLE backtest_ticker ADD CONSTRAINT  backtest_ticker_backtest_id_fk FOREIGN KEY (backtest_id) references backtest (id) ON DELETE CASCADE;

ALTER TABLE backtest_ticker DROP CONSTRAINT backtest_ticker_ticker_ticker_fk;
ALTER TABLE backtest_ticker ADD CONSTRAINT  backtest_ticker_ticker_ticker_fk FOREIGN KEY (ticker) references ticker (ticker) ON DELETE CASCADE;

ALTER TABLE backtest DROP CONSTRAINT backtest_algorithm_id_fk;
ALTER TABLE backtest ADD CONSTRAINT  backtest_algorithm_id_fk FOREIGN KEY (algorithm_id) references algorithm (id) ON DELETE CASCADE;

ALTER TABLE quote DROP CONSTRAINT quotes_day_id_fk;
ALTER TABLE quote ADD CONSTRAINT  quotes_day_id_fk FOREIGN KEY (day_id) references day (id) ON DELETE CASCADE;

ALTER TABLE quote DROP CONSTRAINT quote_ticker_ticker_fk;
ALTER TABLE quote ADD CONSTRAINT  quote_ticker_ticker_fk FOREIGN KEY (ticker) references ticker (ticker) ON DELETE CASCADE;
