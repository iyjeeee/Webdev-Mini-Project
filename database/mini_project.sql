--
-- PostgreSQL database dump
--

\restrict pLekWHwDV8h8Whmq916xbC6UQVKl13FKc2rU86l4uWdBdcahacMRnl42VDcOSZu

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-04-04 10:38:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 19301)
-- Name: attendance_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_logs (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    log_date date NOT NULL,
    time_in timestamp with time zone,
    time_out timestamp with time zone,
    hours_rendered numeric(5,2) DEFAULT 0 NOT NULL,
    is_late boolean DEFAULT false NOT NULL,
    late_minutes integer DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'Present'::character varying NOT NULL,
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.attendance_logs OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 19300)
-- Name: attendance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 235
-- Name: attendance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_logs_id_seq OWNED BY public.attendance_logs.id;


--
-- TOC entry 244 (class 1259 OID 19443)
-- Name: calendar_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_events (
    id integer NOT NULL,
    title character varying(250) NOT NULL,
    event_type_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    start_time time without time zone,
    end_time time without time zone,
    is_all_day boolean DEFAULT false NOT NULL,
    location character varying(250),
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.calendar_events OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 19442)
-- Name: calendar_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_events_id_seq OWNER TO postgres;

--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 243
-- Name: calendar_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_events_id_seq OWNED BY public.calendar_events.id;


--
-- TOC entry 220 (class 1259 OID 19133)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19132)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 219
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- TOC entry 230 (class 1259 OID 19211)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    employee_no character varying(20) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    middle_name character varying(100),
    birth_date date,
    civil_status character varying(30) DEFAULT 'Single'::character varying,
    contact_number character varying(20),
    residence_address text,
    personal_email character varying(150),
    profile_photo_url text,
    job_position_id integer,
    department_id integer,
    work_arrangement character varying(30) DEFAULT 'On-site'::character varying,
    date_hired date NOT NULL,
    date_regularized date,
    is_active boolean DEFAULT true NOT NULL,
    sss_number character varying(50),
    philhealth_number character varying(50),
    pagibig_number character varying(50),
    tin_number character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 19148)
-- Name: job_positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_positions (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    department_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.job_positions OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 19245)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19487)
-- Name: employee_profile_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.employee_profile_view AS
 SELECT e.id,
    e.employee_no,
    e.first_name,
    e.last_name,
    e.middle_name,
    concat(e.first_name, ' ', COALESCE(((e.middle_name)::text || ' '::text), ''::text), e.last_name) AS full_name,
    jp.title AS job_position,
    d.name AS department,
    e.work_arrangement,
    e.civil_status,
    e.birth_date,
    e.contact_number,
    e.residence_address,
    e.personal_email,
    e.profile_photo_url,
    e.date_hired,
    e.date_regularized,
    e.is_active,
    e.sss_number,
    e.philhealth_number,
    e.pagibig_number,
    e.tin_number,
    u.email AS company_email,
    u.last_login
   FROM (((public.employees e
     LEFT JOIN public.job_positions jp ON ((jp.id = e.job_position_id)))
     LEFT JOIN public.departments d ON ((d.id = e.department_id)))
     LEFT JOIN public.users u ON ((u.employee_id = e.id)));


ALTER VIEW public.employee_profile_view OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19210)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 229
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 228 (class 1259 OID 19194)
-- Name: event_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    color character varying(20) DEFAULT '#000000'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.event_types OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 19193)
-- Name: event_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_types_id_seq OWNER TO postgres;

--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_types_id_seq OWNED BY public.event_types.id;


--
-- TOC entry 221 (class 1259 OID 19147)
-- Name: job_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_positions_id_seq OWNER TO postgres;

--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 221
-- Name: job_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_positions_id_seq OWNED BY public.job_positions.id;


--
-- TOC entry 234 (class 1259 OID 19271)
-- Name: leave_credits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_credits (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    total_days integer DEFAULT 0 NOT NULL,
    used_days integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leave_credits OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19270)
-- Name: leave_credits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_credits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_credits_id_seq OWNER TO postgres;

--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 233
-- Name: leave_credits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_credits_id_seq OWNED BY public.leave_credits.id;


--
-- TOC entry 240 (class 1259 OID 19369)
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    reference_no character varying(30) NOT NULL,
    employee_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    date_from date NOT NULL,
    date_to date NOT NULL,
    number_of_days integer DEFAULT 1 NOT NULL,
    reason text,
    status_id integer NOT NULL,
    reviewed_by integer,
    reviewed_at timestamp with time zone,
    remarks text,
    filed_on timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 19368)
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_requests_id_seq OWNER TO postgres;

--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 239
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- TOC entry 224 (class 1259 OID 19165)
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(20) NOT NULL,
    default_days integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19164)
-- Name: leave_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_types_id_seq OWNER TO postgres;

--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 223
-- Name: leave_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_types_id_seq OWNED BY public.leave_types.id;


--
-- TOC entry 246 (class 1259 OID 19467)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    employee_id integer NOT NULL,
    title character varying(250) NOT NULL,
    body text,
    type character varying(50),
    reference_id integer,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19466)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 245
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 238 (class 1259 OID 19330)
-- Name: overtime_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.overtime_requests (
    id integer NOT NULL,
    reference_no character varying(30) NOT NULL,
    employee_id integer NOT NULL,
    ot_date date NOT NULL,
    ot_start time without time zone NOT NULL,
    ot_end time without time zone NOT NULL,
    total_hours numeric(5,2) DEFAULT 0 NOT NULL,
    reason text,
    status_id integer NOT NULL,
    reviewed_by integer,
    reviewed_at timestamp with time zone,
    remarks text,
    filed_on timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.overtime_requests OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 19329)
-- Name: overtime_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.overtime_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.overtime_requests_id_seq OWNER TO postgres;

--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 237
-- Name: overtime_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.overtime_requests_id_seq OWNED BY public.overtime_requests.id;


--
-- TOC entry 226 (class 1259 OID 19183)
-- Name: request_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_statuses (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.request_statuses OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19182)
-- Name: request_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 225
-- Name: request_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_statuses_id_seq OWNED BY public.request_statuses.id;


--
-- TOC entry 242 (class 1259 OID 19413)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    assigned_by integer,
    title character varying(200) NOT NULL,
    description text,
    project_name character varying(200),
    priority character varying(20) DEFAULT 'Medium'::character varying NOT NULL,
    status character varying(30) DEFAULT 'To Do'::character varying NOT NULL,
    due_date date,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 19412)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 241
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 231 (class 1259 OID 19244)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4953 (class 2604 OID 19304)
-- Name: attendance_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_logs ALTER COLUMN id SET DEFAULT nextval('public.attendance_logs_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 19446)
-- Name: calendar_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events ALTER COLUMN id SET DEFAULT nextval('public.calendar_events_id_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 19136)
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 19214)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 19197)
-- Name: event_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_types ALTER COLUMN id SET DEFAULT nextval('public.event_types_id_seq'::regclass);


--
-- TOC entry 4928 (class 2604 OID 19151)
-- Name: job_positions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions ALTER COLUMN id SET DEFAULT nextval('public.job_positions_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 19274)
-- Name: leave_credits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_credits ALTER COLUMN id SET DEFAULT nextval('public.leave_credits_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 19372)
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 19168)
-- Name: leave_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types ALTER COLUMN id SET DEFAULT nextval('public.leave_types_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 19470)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 19333)
-- Name: overtime_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_requests ALTER COLUMN id SET DEFAULT nextval('public.overtime_requests_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 19186)
-- Name: request_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_statuses ALTER COLUMN id SET DEFAULT nextval('public.request_statuses_id_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 19416)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 19248)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5226 (class 0 OID 19301)
-- Dependencies: 236
-- Data for Name: attendance_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_logs (id, employee_id, log_date, time_in, time_out, hours_rendered, is_late, late_minutes, status, remarks, created_at) FROM stdin;
1	1	2026-04-01	2026-04-01 08:02:00+08	2026-04-01 17:00:00+08	8.00	f	0	Present	\N	2026-04-04 10:22:05.393723+08
2	2	2026-04-01	2026-04-01 08:00:00+08	2026-04-01 17:30:00+08	8.50	f	0	Present	\N	2026-04-04 10:22:05.393723+08
3	3	2026-04-01	2026-04-01 08:15:00+08	2026-04-01 17:00:00+08	7.75	t	15	Present	Slight traffic delay	2026-04-04 10:22:05.393723+08
4	4	2026-04-01	2026-04-01 08:00:00+08	2026-04-01 17:00:00+08	8.00	f	0	Present	\N	2026-04-04 10:22:05.393723+08
5	5	2026-04-01	2026-04-01 09:05:00+08	2026-04-01 18:05:00+08	8.00	t	65	Present	Late — bus issue	2026-04-04 10:22:05.393723+08
6	1	2026-04-02	2026-04-02 08:00:00+08	2026-04-02 17:00:00+08	8.00	f	0	Present	\N	2026-04-04 10:22:05.393723+08
7	2	2026-04-02	2026-04-02 08:10:00+08	2026-04-02 17:30:00+08	8.33	t	10	Present	\N	2026-04-04 10:22:05.393723+08
8	3	2026-04-02	2026-04-02 08:00:00+08	2026-04-02 17:00:00+08	8.00	f	0	Present	\N	2026-04-04 10:22:05.393723+08
9	4	2026-04-02	2026-04-02 08:00:00+08	2026-04-02 17:15:00+08	8.25	f	0	Present	\N	2026-04-04 10:22:05.393723+08
10	5	2026-04-02	2026-04-02 08:30:00+08	2026-04-02 17:30:00+08	8.00	t	30	Present	\N	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5234 (class 0 OID 19443)
-- Dependencies: 244
-- Data for Name: calendar_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_events (id, title, event_type_id, start_date, end_date, start_time, end_time, is_all_day, location, description, is_active, created_at) FROM stdin;
1	Good Friday	1	2026-04-03	2026-04-03	\N	\N	t	N/A	National Holiday — Holy Week	t	2026-04-04 10:22:05.393723+08
4	IT Department Sprint Planning	7	2026-04-01	2026-04-01	09:00:00	11:00:00	f	IT Room	Sprint 14 planning session	t	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5210 (class 0 OID 19133)
-- Dependencies: 220
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, is_active, created_at) FROM stdin;
1	Information Technology	t	2026-04-04 10:22:05.393723+08
2	Human Resources	t	2026-04-04 10:22:05.393723+08
3	Finance	t	2026-04-04 10:22:05.393723+08
4	Operations	t	2026-04-04 10:22:05.393723+08
5	Marketing	t	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5220 (class 0 OID 19211)
-- Dependencies: 230
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, employee_no, first_name, last_name, middle_name, birth_date, civil_status, contact_number, residence_address, personal_email, profile_photo_url, job_position_id, department_id, work_arrangement, date_hired, date_regularized, is_active, sss_number, philhealth_number, pagibig_number, tin_number, created_at, updated_at) FROM stdin;
1	HS-001	John Andrei	Recto	Santos	2002-05-14	Single	09171234567	Batangas City, Batangas	john.recto@gmail.com	\N	1	1	On-site	2024-01-10	2024-07-10	t	34-5678901-2	12-345678901-3	1234-5678-9012	123-456-789-001	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
2	HS-002	Marcus Neo	Rangel	Lopez	2001-09-21	Single	09181234567	Lipa City, Batangas	marcus.rangel@gmail.com	\N	2	1	Hybrid	2023-11-05	2024-05-05	t	34-6789012-3	12-456789012-4	2345-6789-0123	234-567-890-002	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
3	HS-003	Renson	Pena	Garcia	2000-12-11	Single	09191234567	Tanauan City, Batangas	renson.pena@gmail.com	\N	1	1	Remote	2024-02-01	2024-08-01	t	34-7890123-4	12-567890123-5	3456-7890-1234	345-678-901-003	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
4	HS-004	Ken Demetri	Payo	Reyes	2002-03-08	Single	09201234567	Sto. Tomas, Batangas	ken.payo@gmail.com	\N	1	1	On-site	2024-01-20	2024-07-20	t	34-8901234-5	12-678901234-6	4567-8901-2345	456-789-012-004	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
5	HS-005	Rosh Andrei	Lantin	Mendoza	2001-07-30	Single	09211234567	Batangas City, Batangas	rosh.lantin@gmail.com	\N	3	1	Hybrid	2023-10-15	2024-04-15	t	34-9012345-6	12-789012345-7	5678-9012-3456	567-890-123-005	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5218 (class 0 OID 19194)
-- Dependencies: 228
-- Data for Name: event_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_types (id, name, color, is_active, created_at) FROM stdin;
1	Holiday	#3B82F6	t	2026-04-04 10:22:05.393723+08
2	Company Event	#EAB308	t	2026-04-04 10:22:05.393723+08
3	Payroll	#22C55E	t	2026-04-04 10:22:05.393723+08
4	Training	#A855F7	t	2026-04-04 10:22:05.393723+08
5	Deadline	#EF4444	t	2026-04-04 10:22:05.393723+08
6	HR Event	#84CC16	t	2026-04-04 10:22:05.393723+08
7	Department Meeting	#06B6D4	t	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5212 (class 0 OID 19148)
-- Dependencies: 222
-- Data for Name: job_positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_positions (id, title, department_id, is_active) FROM stdin;
1	Junior Software Developer	1	t
2	Senior Software Developer	1	t
3	Project Management Head	1	t
4	HR Officer	2	t
5	HR Manager	2	t
6	Finance Analyst	3	t
7	Operations Manager	4	t
8	Marketing Specialist	5	t
\.


--
-- TOC entry 5224 (class 0 OID 19271)
-- Dependencies: 234
-- Data for Name: leave_credits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_credits (id, employee_id, leave_type_id, total_days, used_days, created_at, updated_at) FROM stdin;
1	1	1	15	2	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
2	1	2	15	1	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
3	1	3	3	0	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
4	2	1	15	5	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
5	2	2	15	2	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
6	2	3	3	1	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
7	3	1	15	1	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
8	3	2	15	0	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
9	3	3	3	0	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
10	4	1	15	3	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
11	4	2	15	1	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
12	4	3	3	0	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
13	5	1	15	7	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
14	5	2	15	4	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
15	5	3	3	1	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5230 (class 0 OID 19369)
-- Dependencies: 240
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_requests (id, reference_no, employee_id, leave_type_id, date_from, date_to, number_of_days, reason, status_id, reviewed_by, reviewed_at, remarks, filed_on, created_at) FROM stdin;
\.


--
-- TOC entry 5214 (class 0 OID 19165)
-- Dependencies: 224
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_types (id, name, code, default_days, is_active) FROM stdin;
1	Vacation Leave	VL	15	t
2	Sick Leave	SL	15	t
3	Emergency Leave	EL	3	t
\.


--
-- TOC entry 5236 (class 0 OID 19467)
-- Dependencies: 246
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, employee_id, title, body, type, reference_id, is_read, created_at) FROM stdin;
3	1	Overtime Approved	Your overtime on Apr 1 (3 hrs) has been approved.	overtime	1	t	2026-04-01 21:35:00+08
4	2	Overtime Approved	Your overtime on Apr 2 (2.5 hrs) has been approved.	overtime	2	t	2026-04-02 20:10:00+08
9	2	New Task Assigned	You have been assigned: Create Employee Directory UI — due Apr 10.	task	7	t	2026-04-01 08:35:00+08
\.


--
-- TOC entry 5228 (class 0 OID 19330)
-- Dependencies: 238
-- Data for Name: overtime_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.overtime_requests (id, reference_no, employee_id, ot_date, ot_start, ot_end, total_hours, reason, status_id, reviewed_by, reviewed_at, remarks, filed_on, created_at) FROM stdin;
1	OT-2026-APR-001	1	2026-04-01	18:00:00	21:00:00	3.00	HRIS Sprint 14 backend integration — urgent deployment	2	5	2026-04-01 21:30:00+08	Approved	2026-04-01 17:50:00+08	2026-04-04 10:22:05.393723+08
2	OT-2026-APR-002	2	2026-04-02	17:30:00	20:00:00	2.50	API bug fixes before client demo	2	5	2026-04-02 20:05:00+08	Approved	2026-04-02 17:20:00+08	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5216 (class 0 OID 19183)
-- Dependencies: 226
-- Data for Name: request_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_statuses (id, name) FROM stdin;
1	Pending
2	Approved
3	Rejected
4	Cancelled
\.


--
-- TOC entry 5232 (class 0 OID 19413)
-- Dependencies: 242
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, employee_id, assigned_by, title, description, project_name, priority, status, due_date, completed_at, created_at, updated_at) FROM stdin;
5	2	5	Redesign Dashboard UI	Update dashboard layout using new design system. Mobile-first, fully responsive.	HRIS System v2	High	Completed	2026-04-08	2026-04-07 17:00:00+08	2026-04-01 08:00:00+08	2026-04-04 10:22:05.393723+08
7	2	5	Create Employee Directory UI	Build a searchable filterable employee directory with profile cards and pagination.	HRIS System v2	Medium	Overdue	2026-04-10	\N	2026-04-01 08:30:00+08	2026-04-04 10:22:05.393723+08
8	3	5	Database Schema Optimization	Analyze slow queries, add indexes, and optimize joins on leave and attendance tables.	HRIS System v2	High	Completed	2026-04-10	2026-04-09 15:00:00+08	2026-04-01 09:00:00+08	2026-04-04 10:22:05.393723+08
11	4	5	Compile Q1 KPI Report	Gather performance data from all departments and compile into Q1 KPI summary report.	Performance	High	Completed	2026-04-07	2026-04-07 16:00:00+08	2026-04-01 08:00:00+08	2026-04-04 10:22:05.393723+08
14	4	5	Submit April Timesheet Summary	Compile and verify April attendance and overtime records for all team members.	HR Admin	Low	Overdue	2026-04-05	\N	2026-04-01 09:00:00+08	2026-04-04 10:22:05.393723+08
15	5	1	Sprint 14 Review and Retrospective	Facilitate sprint review demo and retrospective discussion with the full team.	HRIS System v2	High	Completed	2026-04-11	2026-04-11 16:00:00+08	2026-04-01 08:00:00+08	2026-04-04 10:22:05.393723+08
1	1	5	Implement JWT Authentication	Set up secure JWT token generation and refresh token logic for all API endpoints.	HRIS System v2	High	Completed	2026-04-05	2026-04-04 16:30:00+08	2026-04-01 08:00:00+08	2026-04-04 10:29:22.88953+08
\.


--
-- TOC entry 5222 (class 0 OID 19245)
-- Dependencies: 232
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, employee_id, email, password, is_active, last_login, created_at, updated_at) FROM stdin;
2	2	marcus.neo.rangel@highlysucceed.com	$2b$12$wd8H.FBnQwozu7rGS6qzp.DtbkHnue8qfve4j3iNdwVblK1L.CM9G	t	\N	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
3	3	renson.pena@highlysucceed.com	$2b$12$wd8H.FBnQwozu7rGS6qzp.DtbkHnue8qfve4j3iNdwVblK1L.CM9G	t	\N	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
4	4	ken.demetri.payo@highlysucceed.com	$2b$12$wd8H.FBnQwozu7rGS6qzp.DtbkHnue8qfve4j3iNdwVblK1L.CM9G	t	\N	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
5	5	rosh.andrei.lantin@highlysucceed.com	$2b$12$wd8H.FBnQwozu7rGS6qzp.DtbkHnue8qfve4j3iNdwVblK1L.CM9G	t	\N	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
1	1	john.andrei.recto@highlysucceed.com	$2b$12$wd8H.FBnQwozu7rGS6qzp.DtbkHnue8qfve4j3iNdwVblK1L.CM9G	t	2026-04-04 10:22:51.239653+08	2026-04-04 10:22:05.393723+08	2026-04-04 10:22:05.393723+08
\.


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 235
-- Name: attendance_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_logs_id_seq', 10, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 243
-- Name: calendar_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_events_id_seq', 4, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 219
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 5, true);


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 229
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 5, true);


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_types_id_seq', 7, true);


--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 221
-- Name: job_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_positions_id_seq', 8, true);


--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 233
-- Name: leave_credits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_credits_id_seq', 15, true);


--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 239
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 1, true);


--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 223
-- Name: leave_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_types_id_seq', 3, true);


--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 245
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 9, true);


--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 237
-- Name: overtime_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.overtime_requests_id_seq', 2, true);


--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 225
-- Name: request_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_statuses_id_seq', 4, true);


--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 241
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 15, true);


--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 5017 (class 2606 OID 19323)
-- Name: attendance_logs attendance_logs_employee_id_log_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_logs
    ADD CONSTRAINT attendance_logs_employee_id_log_date_key UNIQUE (employee_id, log_date);


--
-- TOC entry 5019 (class 2606 OID 19321)
-- Name: attendance_logs attendance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_logs
    ADD CONSTRAINT attendance_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 19460)
-- Name: calendar_events calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 19146)
-- Name: departments departments_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key UNIQUE (name);


--
-- TOC entry 4982 (class 2606 OID 19144)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 19233)
-- Name: employees employees_employee_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key UNIQUE (employee_no);


--
-- TOC entry 5002 (class 2606 OID 19231)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 19209)
-- Name: event_types event_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_types
    ADD CONSTRAINT event_types_name_key UNIQUE (name);


--
-- TOC entry 4998 (class 2606 OID 19207)
-- Name: event_types event_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_types
    ADD CONSTRAINT event_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4984 (class 2606 OID 19158)
-- Name: job_positions job_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 19289)
-- Name: leave_credits leave_credits_employee_id_leave_type_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_credits
    ADD CONSTRAINT leave_credits_employee_id_leave_type_id_key UNIQUE (employee_id, leave_type_id);


--
-- TOC entry 5015 (class 2606 OID 19287)
-- Name: leave_credits leave_credits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_credits
    ADD CONSTRAINT leave_credits_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 19389)
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 19391)
-- Name: leave_requests leave_requests_reference_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_reference_no_key UNIQUE (reference_no);


--
-- TOC entry 4986 (class 2606 OID 19181)
-- Name: leave_types leave_types_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_code_key UNIQUE (code);


--
-- TOC entry 4988 (class 2606 OID 19179)
-- Name: leave_types leave_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_name_key UNIQUE (name);


--
-- TOC entry 4990 (class 2606 OID 19177)
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- TOC entry 5042 (class 2606 OID 19481)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 19350)
-- Name: overtime_requests overtime_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 19352)
-- Name: overtime_requests overtime_requests_reference_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_reference_no_key UNIQUE (reference_no);


--
-- TOC entry 4992 (class 2606 OID 19192)
-- Name: request_statuses request_statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_statuses
    ADD CONSTRAINT request_statuses_name_key UNIQUE (name);


--
-- TOC entry 4994 (class 2606 OID 19190)
-- Name: request_statuses request_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_statuses
    ADD CONSTRAINT request_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 5036 (class 2606 OID 19431)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 19264)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5009 (class 2606 OID 19262)
-- Name: users users_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5011 (class 2606 OID 19260)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 1259 OID 19495)
-- Name: idx_att_emp_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_att_emp_date ON public.attendance_logs USING btree (employee_id, log_date);


--
-- TOC entry 5039 (class 1259 OID 19502)
-- Name: idx_cal_start_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cal_start_date ON public.calendar_events USING btree (start_date);


--
-- TOC entry 5003 (class 1259 OID 19492)
-- Name: idx_emp_department; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emp_department ON public.employees USING btree (department_id);


--
-- TOC entry 5004 (class 1259 OID 19493)
-- Name: idx_emp_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emp_is_active ON public.employees USING btree (is_active);


--
-- TOC entry 5027 (class 1259 OID 19498)
-- Name: idx_leave_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_employee ON public.leave_requests USING btree (employee_id);


--
-- TOC entry 5028 (class 1259 OID 19499)
-- Name: idx_leave_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_status ON public.leave_requests USING btree (status_id);


--
-- TOC entry 5040 (class 1259 OID 19503)
-- Name: idx_notif_emp_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notif_emp_unread ON public.notifications USING btree (employee_id, is_read);


--
-- TOC entry 5021 (class 1259 OID 19496)
-- Name: idx_ot_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ot_employee ON public.overtime_requests USING btree (employee_id);


--
-- TOC entry 5022 (class 1259 OID 19497)
-- Name: idx_ot_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ot_status ON public.overtime_requests USING btree (status_id);


--
-- TOC entry 5033 (class 1259 OID 19500)
-- Name: idx_tasks_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_employee ON public.tasks USING btree (employee_id);


--
-- TOC entry 5034 (class 1259 OID 19501)
-- Name: idx_tasks_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);


--
-- TOC entry 5005 (class 1259 OID 19494)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 5049 (class 2606 OID 19324)
-- Name: attendance_logs attendance_logs_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_logs
    ADD CONSTRAINT attendance_logs_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5059 (class 2606 OID 19461)
-- Name: calendar_events calendar_events_event_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_events_event_type_id_fkey FOREIGN KEY (event_type_id) REFERENCES public.event_types(id) ON DELETE RESTRICT;


--
-- TOC entry 5044 (class 2606 OID 19239)
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5045 (class 2606 OID 19234)
-- Name: employees employees_job_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_job_position_id_fkey FOREIGN KEY (job_position_id) REFERENCES public.job_positions(id) ON DELETE SET NULL;


--
-- TOC entry 5043 (class 2606 OID 19159)
-- Name: job_positions job_positions_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE RESTRICT;


--
-- TOC entry 5047 (class 2606 OID 19290)
-- Name: leave_credits leave_credits_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_credits
    ADD CONSTRAINT leave_credits_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5048 (class 2606 OID 19295)
-- Name: leave_credits leave_credits_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_credits
    ADD CONSTRAINT leave_credits_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE RESTRICT;


--
-- TOC entry 5053 (class 2606 OID 19392)
-- Name: leave_requests leave_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 19397)
-- Name: leave_requests leave_requests_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE RESTRICT;


--
-- TOC entry 5055 (class 2606 OID 19407)
-- Name: leave_requests leave_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- TOC entry 5056 (class 2606 OID 19402)
-- Name: leave_requests leave_requests_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.request_statuses(id) ON DELETE RESTRICT;


--
-- TOC entry 5060 (class 2606 OID 19482)
-- Name: notifications notifications_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5050 (class 2606 OID 19353)
-- Name: overtime_requests overtime_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 19363)
-- Name: overtime_requests overtime_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- TOC entry 5052 (class 2606 OID 19358)
-- Name: overtime_requests overtime_requests_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.request_statuses(id) ON DELETE RESTRICT;


--
-- TOC entry 5057 (class 2606 OID 19437)
-- Name: tasks tasks_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- TOC entry 5058 (class 2606 OID 19432)
-- Name: tasks tasks_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5046 (class 2606 OID 19265)
-- Name: users users_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


-- Completed on 2026-04-04 10:38:58

--
-- PostgreSQL database dump complete
--

\unrestrict pLekWHwDV8h8Whmq916xbC6UQVKl13FKc2rU86l4uWdBdcahacMRnl42VDcOSZu

