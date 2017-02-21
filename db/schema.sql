--
-- PostgreSQL database schema
--

--
-- Cleaning up tables and sequences
--
DROP TABLE IF EXISTS algorithms CASCADE;
DROP TABLE IF EXISTS day CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS result CASCADE;
DROP TABLE IF EXISTS trade CASCADE;

DROP SEQUENCE IF EXISTS algorithms_id_seq CASCADE;
DROP SEQUENCE IF EXISTS day_id_seq CASCADE;
DROP SEQUENCE IF EXISTS quotes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS result_result_id_seq CASCADE;
DROP SEQUENCE IF EXISTS trade_id_seq CASCADE;

--
-- Name: algorithms; Type: TABLE; Schema: public; Owner: gatcrpvp
--

CREATE TABLE algorithms (
    id bigint NOT NULL,
    name character varying(60)
);


ALTER TABLE algorithms OWNER TO gatcrpvp;

--
-- Name: algorithms_id_seq; Type: SEQUENCE; Schema: public; Owner: gatcrpvp
--

CREATE SEQUENCE algorithms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE algorithms_id_seq OWNER TO gatcrpvp;

--
-- Name: algorithms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gatcrpvp
--

ALTER SEQUENCE algorithms_id_seq OWNED BY algorithms.id;


--
-- Name: day; Type: TABLE; Schema: public; Owner: gatcrpvp
--

CREATE TABLE day (
    id integer NOT NULL,
    date date
);


ALTER TABLE day OWNER TO gatcrpvp;

--
-- Name: day_id_seq; Type: SEQUENCE; Schema: public; Owner: gatcrpvp
--

CREATE SEQUENCE day_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE day_id_seq OWNER TO gatcrpvp;

--
-- Name: day_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gatcrpvp
--

ALTER SEQUENCE day_id_seq OWNED BY day.id;


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: gatcrpvp
--

CREATE TABLE quotes (
    id integer NOT NULL,
    price numeric(7,2) NOT NULL,
    "timestamp" timestamp without time zone,
    last_of_day boolean DEFAULT false NOT NULL,
    day_id integer
);


ALTER TABLE quotes OWNER TO gatcrpvp;

--
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: gatcrpvp
--

CREATE SEQUENCE quotes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE quotes_id_seq OWNER TO gatcrpvp;

--
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gatcrpvp
--

ALTER SEQUENCE quotes_id_seq OWNED BY quotes.id;


--
-- Name: result; Type: TABLE; Schema: public; Owner: gatcrpvp
--

CREATE TABLE result (
    id integer NOT NULL,
    params text,
    daily_profit_reset numeric(15,2),
    daily_profit_no_reset numeric(15,2),
    cumulative_profit_reset numeric(15,2),
    cumulative_profit_no_reset numeric(15,2),
    day_id integer
);


ALTER TABLE result OWNER TO gatcrpvp;

--
-- Name: result_result_id_seq; Type: SEQUENCE; Schema: public; Owner: gatcrpvp
--

CREATE SEQUENCE result_result_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE result_result_id_seq OWNER TO gatcrpvp;

--
-- Name: result_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gatcrpvp
--

ALTER SEQUENCE result_result_id_seq OWNED BY result.id;


--
-- Name: trade; Type: TABLE; Schema: public; Owner: gatcrpvp
--

CREATE TABLE trade (
    id integer NOT NULL,
    quantity_reset integer,
    quantity_no_reset integer,
    action integer,
    "timestamp" timestamp without time zone,
    result_id integer
);


ALTER TABLE trade OWNER TO gatcrpvp;

--
-- Name: trade_id_seq; Type: SEQUENCE; Schema: public; Owner: gatcrpvp
--

CREATE SEQUENCE trade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE trade_id_seq OWNER TO gatcrpvp;

--
-- Name: trade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gatcrpvp
--

ALTER SEQUENCE trade_id_seq OWNED BY trade.id;


--
-- Name: algorithms id; Type: DEFAULT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY algorithms ALTER COLUMN id SET DEFAULT nextval('algorithms_id_seq'::regclass);


--
-- Name: day id; Type: DEFAULT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY day ALTER COLUMN id SET DEFAULT nextval('day_id_seq'::regclass);


--
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY quotes ALTER COLUMN id SET DEFAULT nextval('quotes_id_seq'::regclass);


--
-- Name: result id; Type: DEFAULT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY result ALTER COLUMN id SET DEFAULT nextval('result_result_id_seq'::regclass);


--
-- Name: trade id; Type: DEFAULT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY trade ALTER COLUMN id SET DEFAULT nextval('trade_id_seq'::regclass);


--
-- Name: algorithms algorithms_pkey; Type: CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY algorithms
    ADD CONSTRAINT algorithms_pkey PRIMARY KEY (id);


--
-- Name: day day_pkey; Type: CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY day
    ADD CONSTRAINT day_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: result result_pkey; Type: CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY result
    ADD CONSTRAINT result_pkey PRIMARY KEY (id);


--
-- Name: trade trade_pkey; Type: CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY trade
    ADD CONSTRAINT trade_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_day_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY quotes
    ADD CONSTRAINT quotes_day_id_fk FOREIGN KEY (day_id) REFERENCES day(id);


--
-- Name: result result_day_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY result
    ADD CONSTRAINT result_day_id_fk FOREIGN KEY (day_id) REFERENCES day(id);


--
-- Name: trade trade_result_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: gatcrpvp
--

ALTER TABLE ONLY trade
    ADD CONSTRAINT trade_result_id_fk FOREIGN KEY (result_id) REFERENCES result(id);
