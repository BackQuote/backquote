--
-- PostgreSQL database schema
--

--
-- Cleaning up tables and sequences
--
DROP TABLE IF EXISTS algorithm CASCADE;
DROP TABLE IF EXISTS backtest CASCADE;
DROP TABLE IF EXISTS backtest_ticker CASCADE;
DROP TABLE IF EXISTS day CASCADE;
DROP TABLE IF EXISTS quote CASCADE;
DROP TABLE IF EXISTS result CASCADE;
DROP TABLE IF EXISTS simulation CASCADE;
DROP TABLE IF EXISTS ticker CASCADE;
DROP TABLE IF EXISTS trade CASCADE;
DROP TABLE IF EXISTS template CASCADE;

DROP SEQUENCE IF EXISTS algorithm_id_seq CASCADE;
DROP SEQUENCE IF EXISTS backtest_id_seq CASCADE;
DROP SEQUENCE IF EXISTS day_id_seq CASCADE;
DROP SEQUENCE IF EXISTS quote_id_seq CASCADE;
DROP SEQUENCE IF EXISTS result_result_id_seq CASCADE;
DROP SEQUENCE IF EXISTS simulation_id_seq CASCADE;
DROP SEQUENCE IF EXISTS trade_id_seq CASCADE;
DROP SEQUENCE IF EXISTS template_id_seq CASCADE;

--
-- Name: algorithm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE algorithm (
    id bigint NOT NULL,
    name VARCHAR(60)
);


ALTER TABLE algorithm OWNER TO postgres;

--
-- Name: algorithm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE algorithm_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE algorithm_id_seq OWNER TO postgres;

--
-- Name: algorithm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE algorithm_id_seq OWNED BY algorithm.id;


--
-- Name: backtest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE backtest (
    id integer NOT NULL,
    timestamp timestamp without time zone,
    params text,
    success boolean DEFAULT false NOT NULL,
    algorithm_id integer
);


ALTER TABLE backtest OWNER TO postgres;

--
-- Name: backtest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE backtest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE backtest_id_seq OWNER TO postgres;

--
-- Name: backtest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE backtest_id_seq OWNED BY backtest.id;


--
-- Name: backtest_ticker; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE backtest_ticker (
    backtest_id integer,
    ticker character varying(10)
);


ALTER TABLE backtest_ticker OWNER TO postgres;

--
-- Name: day; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE day (
    id integer NOT NULL,
    date date
);


ALTER TABLE day OWNER TO postgres;

--
-- Name: day_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE day_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE day_id_seq OWNER TO postgres;

--
-- Name: day_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE day_id_seq OWNED BY day.id;


--
-- Name: quote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE quote (
    id integer NOT NULL,
    open NUMERIC(7,2) NOT NULL,
    high NUMERIC(7,2) NOT NULL,
    low NUMERIC(7,2) NOT NULL,
    close NUMERIC(7,2) NOT NULL,
    timestamp TIMESTAMP,
    last_of_day boolean DEFAULT false NOT NULL,
    day_id integer,
    ticker VARCHAR(10)
);


ALTER TABLE quote OWNER TO postgres;

--
-- Name: quote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE quote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE quote_id_seq OWNER TO postgres;

--
-- Name: quote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE quote_id_seq OWNED BY quote.id;


--
-- Name: result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE result (
    id integer NOT NULL,
    daily_profit_reset numeric(15,2),
    daily_profit_no_reset numeric(15,2),
    cumulative_profit_reset numeric(15,2),
    cumulative_profit_no_reset numeric(15,2),
    day_id integer,
    simulation_id integer
);


ALTER TABLE result OWNER TO postgres;

--
-- Name: result_result_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE result_result_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE result_result_id_seq OWNER TO postgres;

--
-- Name: result_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE result_result_id_seq OWNED BY result.id;


--
-- Name: simulation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE simulation (
    id integer NOT NULL,
    backtest_id integer,
    ticker VARCHAR(10),
    params text,
    profit_reset numeric(10,2),
    profit_no_reset numeric(10,2)
);


ALTER TABLE simulation OWNER TO postgres;

--
-- Name: simulation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE simulation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE simulation_id_seq OWNER TO postgres;

--
-- Name: simulation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE simulation_id_seq OWNED BY simulation.id;


--
-- Name: template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE template (
    id integer NOT NULL,
    params text
);


ALTER TABLE template OWNER TO postgres;

--
-- Name: template_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE template_id_seq OWNER TO postgres;

--
-- Name: template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE template_id_seq OWNED BY template.id;


--
-- Name: ticker; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ticker (
    ticker VARCHAR(10) NOT NULL
);


ALTER TABLE ticker OWNER TO postgres;

--
-- Name: trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE trade (
    id integer NOT NULL,
    quantity_reset integer,
    quantity_no_reset integer,
    action varchar(10),
    timestamp timestamp without time zone,
    result_id integer
);


ALTER TABLE trade OWNER TO postgres;

--
-- Name: trade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE trade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE trade_id_seq OWNER TO postgres;

--
-- Name: trade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE trade_id_seq OWNED BY trade.id;


--
-- Name: algorithm id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY algorithm ALTER COLUMN id SET DEFAULT nextval('algorithm_id_seq'::regclass);


--
-- Name: backtest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY backtest ALTER COLUMN id SET DEFAULT nextval('backtest_id_seq'::regclass);


--
-- Name: day id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY day ALTER COLUMN id SET DEFAULT nextval('day_id_seq'::regclass);


--
-- Name: quote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY quote ALTER COLUMN id SET DEFAULT nextval('quote_id_seq'::regclass);


--
-- Name: result id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY result ALTER COLUMN id SET DEFAULT nextval('result_result_id_seq'::regclass);


--
-- Name: simulation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY simulation ALTER COLUMN id SET DEFAULT nextval('simulation_id_seq'::regclass);


--
-- Name: template id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template ALTER COLUMN id SET DEFAULT nextval('template_id_seq'::regclass);


--
-- Name: trade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY trade ALTER COLUMN id SET DEFAULT nextval('trade_id_seq'::regclass);


--
-- Name: trade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('trade_id_seq', 1, false);


--
-- Name: algorithm algorithms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY algorithm
    ADD CONSTRAINT algorithms_pkey PRIMARY KEY (id);


--
-- Name: backtest backtest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY backtest
    ADD CONSTRAINT backtest_pkey PRIMARY KEY (id);


--
-- Name: day day_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY day
    ADD CONSTRAINT day_pkey PRIMARY KEY (id);


--
-- Name: quote quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY quote
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: result result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY result
    ADD CONSTRAINT result_pkey PRIMARY KEY (id);


--
-- Name: simulation simulation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY simulation
    ADD CONSTRAINT simulation_pkey PRIMARY KEY (id);


--
-- Name: template templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY template
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: ticker ticker_ticker_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ticker
    ADD CONSTRAINT ticker_ticker_pk PRIMARY KEY (ticker);


--
-- Name: trade trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY trade
    ADD CONSTRAINT trade_pkey PRIMARY KEY (id);


--
-- Name: backtest backtest_algorithm_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY backtest
    ADD CONSTRAINT backtest_algorithm_id_fk FOREIGN KEY (algorithm_id) REFERENCES algorithm(id);


--
-- Name: backtest_ticker backtest_ticker_backtest_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY backtest_ticker
    ADD CONSTRAINT backtest_ticker_backtest_id_fk FOREIGN KEY (backtest_id) REFERENCES backtest(id);


--
-- Name: backtest_ticker backtest_ticker_ticker_ticker_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY backtest_ticker
    ADD CONSTRAINT backtest_ticker_ticker_ticker_fk FOREIGN KEY (ticker) REFERENCES ticker(ticker);


--
-- Name: quote quote_ticker_ticker_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY quote
    ADD CONSTRAINT quote_ticker_ticker_fk FOREIGN KEY (ticker) REFERENCES ticker(ticker);


--
-- Name: quote quotes_day_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY quote
    ADD CONSTRAINT quotes_day_id_fk FOREIGN KEY (day_id) REFERENCES day(id);


--
-- Name: result result_day_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY result
    ADD CONSTRAINT result_day_id_fk FOREIGN KEY (day_id) REFERENCES day(id);


--
-- Name: result result_simulation_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY result
    ADD CONSTRAINT result_simulation_id_fk FOREIGN KEY (simulation_id) REFERENCES simulation(id);


--
-- Name: simulation simulation_backtest_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY simulation
    ADD CONSTRAINT simulation_backtest_id_fk FOREIGN KEY (backtest_id) REFERENCES backtest(id);


--
-- Name: simulation simulation_ticker_ticker_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY simulation
    ADD CONSTRAINT simulation_ticker_ticker_fk FOREIGN KEY (ticker) REFERENCES ticker(ticker);


--
-- Name: trade trade_result_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY trade
    ADD CONSTRAINT trade_result_id_fk FOREIGN KEY (result_id) REFERENCES result(id);


