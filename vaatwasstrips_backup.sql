--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: AdminUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdminUser" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    name text,
    role text DEFAULT 'admin'::text NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "loginCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AdminUser" OWNER TO postgres;

--
-- Name: AffiliateClick; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AffiliateClick" (
    id text NOT NULL,
    "productId" text NOT NULL,
    supplier text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    referrer text,
    converted boolean DEFAULT false NOT NULL,
    revenue double precision,
    "clickedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AffiliateClick" OWNER TO postgres;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "featuredImage" text,
    "metaTitle" text,
    "metaDescription" text,
    keywords text[],
    published boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    author text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: Guide; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guide" (
    id text NOT NULL,
    slug text NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "featuredImage" text,
    "metaTitle" text,
    "metaDescription" text,
    keywords text[],
    published boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    author text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Guide" OWNER TO postgres;

--
-- Name: PriceAlert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PriceAlert" (
    id text NOT NULL,
    "productId" text NOT NULL,
    email text NOT NULL,
    "targetPrice" double precision NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "lastNotified" timestamp(3) without time zone,
    "notifyCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PriceAlert" OWNER TO postgres;

--
-- Name: PriceHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PriceHistory" (
    id text NOT NULL,
    "productId" text NOT NULL,
    price double precision NOT NULL,
    "pricePerWash" double precision NOT NULL,
    "recordedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PriceHistory" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    supplier text NOT NULL,
    description text,
    "longDescription" text,
    url text,
    "imageUrl" text,
    "currentPrice" double precision,
    "pricePerWash" double precision,
    "washesPerPack" integer DEFAULT 60 NOT NULL,
    currency text DEFAULT 'EUR'::text NOT NULL,
    "inStock" boolean DEFAULT true NOT NULL,
    availability text,
    "lastChecked" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rating double precision,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    sustainability double precision,
    features text[],
    pros text[],
    cons text[],
    "metaTitle" text,
    "metaDescription" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "productId" text NOT NULL,
    rating integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "userName" text NOT NULL,
    "userEmail" text,
    verified boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: ScrapingLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ScrapingLog" (
    id text NOT NULL,
    "productId" text,
    supplier text NOT NULL,
    status text NOT NULL,
    message text,
    "oldPrice" double precision,
    "newPrice" double precision,
    "priceChange" double precision,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    duration integer
);


ALTER TABLE public."ScrapingLog" OWNER TO postgres;

--
-- Name: SiteSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSetting" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteSetting" OWNER TO postgres;

--
-- Name: Subscriber; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscriber" (
    id text NOT NULL,
    email text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "priceAlerts" boolean DEFAULT true NOT NULL,
    newsletter boolean DEFAULT true NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    "verifyToken" text,
    "subscribedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "unsubscribedAt" timestamp(3) without time zone
);


ALTER TABLE public."Subscriber" OWNER TO postgres;

--
-- Data for Name: AdminUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AdminUser" (id, email, "passwordHash", name, role, "lastLogin", "loginCount", "createdAt", "updatedAt") FROM stdin;
cmbhp6ozh00198tqbmhfwuolb	admin@vaatwasstripsvergelijker.nl	$2b$10$97qp/isP/3cVTPEsJAJoZeRbAgX4stIZrmKSbkmf7E8i0pcdmLZ.O	Admin User	admin	\N	0	2025-06-04 08:40:43.518	2025-06-04 08:40:43.518
\.


--
-- Data for Name: AffiliateClick; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AffiliateClick" (id, "productId", supplier, "ipAddress", "userAgent", referrer, converted, revenue, "clickedAt") FROM stdin;
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, slug, title, excerpt, content, "featuredImage", "metaTitle", "metaDescription", keywords, published, "publishedAt", author, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Guide; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guide" (id, slug, category, title, excerpt, content, "featuredImage", "metaTitle", "metaDescription", keywords, published, "publishedAt", author, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PriceAlert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PriceAlert" (id, "productId", email, "targetPrice", active, "lastNotified", "notifyCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PriceHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PriceHistory" (id, "productId", price, "pricePerWash", "recordedAt") FROM stdin;
cmbhqq74y0002qaguyoy8sbvi	cmbhqq74t0000qaguaeeoa0qa	12.8	0.16	2025-06-04 09:23:53.122
cmbhqq758000bqaguehtqh25o	cmbhqq7540009qagukrs9a906	10.2	0.17	2025-06-04 09:23:53.132
cmbhqq75m000kqagusk2ddsn0	cmbhqq75h000iqagubs20e1ak	14.08	0.22	2025-06-04 09:23:53.146
cmbhqq75u000tqagu691dtmp1	cmbhqq75t000rqagui60k77hi	15	0.25	2025-06-04 09:23:53.154
cmbhqq75y0012qaguokfiiekc	cmbhqq75w0010qagufkq0q0w1	17.4	0.29	2025-06-04 09:23:53.158
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, slug, name, supplier, description, "longDescription", url, "imageUrl", "currentPrice", "pricePerWash", "washesPerPack", currency, "inStock", availability, "lastChecked", rating, "reviewCount", sustainability, features, pros, cons, "metaTitle", "metaDescription", "createdAt", "updatedAt") FROM stdin;
cmbhqq74t0000qaguaeeoa0qa	wasstrip-nl	Wasstrip.nl	Wasstrip.nl	Milieuvriendelijke vaatwasstrips met natuurlijke ingrediënten	Wasstrip.nl biedt een betaalbaar alternatief voor traditionele vaatwastabletten. Hun strips zijn volledig biologisch afbreekbaar en verpakt in karton.	https://wasstrip.nl	\N	12.8	0.16	80	EUR	t	Online only	2025-06-04 09:23:53.117	4.2	234	8.8	{Hypoallergeen,"Koud & warm water","Biologisch afbreekbaar"}	{"Laagste prijs","Grote verpakkingen"}	{"Minder bekende merk","Beperkte reviews"}	\N	\N	2025-06-04 09:23:53.117	2025-06-04 09:23:53.117
cmbhqq7540009qagukrs9a906	mothers-earth	Mother's Earth	Mother's Earth	Nederlandse kwaliteit met focus op duurzaamheid	Mother's Earth is een van de eerste merken die wasstrips introduceerde in Nederland. Met een sterke focus op duurzaamheid en natuurlijke ingrediënten.	https://mothersearth.nl	\N	10.2	0.17	60	EUR	t	Online only	2025-06-04 09:23:53.129	4.6	1247	9.2	{Plantaardig,"30 dagen garantie","Doneert aan goede doelen"}	{"Goedkoop per wasbeurt","Biologisch afbreekbaar"}	{"Lange levertijd (5-9 dagen)","Verzending vanuit China"}	\N	\N	2025-06-04 09:23:53.129	2025-06-04 09:23:53.129
cmbhqq75h000iqagubs20e1ak	bubblyfy	Bubblyfy	Bubblyfy	Moderne vaatwasstrips met frisse geuren	Bubblyfy richt zich op de moderne consument die waarde hecht aan zowel effectiviteit als beleving.	https://bubblyfy.com	\N	14.08	0.22	64	EUR	t	Online only	2025-06-04 09:23:53.142	4.4	456	9	{"100% natuurlijk","Enzymen uit planten","Geld-terug garantie"}	{"Natuurlijke ingrediënten","Innovatieve formule"}	{"Beperkte beschikbaarheid","Relatief nieuw merk"}	\N	\N	2025-06-04 09:23:53.142	2025-06-04 09:23:53.142
cmbhqq75t000rqagui60k77hi	cosmeau	Cosmeau	Cosmeau	Premium biologische vaatwasstrips	Cosmeau is een Nederlands merk dat zich richt op het maken van duurzame wasproducten zonder concessies te doen aan kwaliteit.	https://cosmeau.nl	\N	15	0.25	60	EUR	t	Online + Winkels	2025-06-04 09:23:53.153	4.3	892	8.5	{Anti-bacterieel,"Enzyme formule","Vrij van parabenen"}	{"Snelle levering","Breed verkrijgbaar"}	{"Hoger prijspunt","Schuimvorming bij kleine vaatwassers"}	\N	\N	2025-06-04 09:23:53.153	2025-06-04 09:23:53.153
cmbhqq75w0010qagufkq0q0w1	bio-suds	Bio-Suds	Bio-Suds	Premium biologische vaatwasstrips	Bio Suds is het premium biologische alternatief in de wasstrips markt. Met 100% natuurlijke en biologische ingrediënten.	https://bio-suds.com	\N	17.4	0.29	60	EUR	f	Online + Bol.com	2025-06-04 09:23:53.157	4.1	189	8.7	{Fosfaatvrij,Chloorvrij,"Premium formule"}	{"Premium kwaliteit","Milieuvriendelijke verpakking"}	{"Duurste optie","Kleinere community"}	\N	\N	2025-06-04 09:23:53.157	2025-06-04 09:23:53.157
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, "productId", rating, title, content, "userName", "userEmail", verified, "createdAt", "updatedAt") FROM stdin;
cmbhqq7500004qagur59e9tpp	cmbhqq74t0000qaguaeeoa0qa	5	Uitstekende wasstrips!	Ik ben zeer tevreden met deze wasstrips. Ze werken goed en zijn makkelijk in gebruik.	Anna de Vries	\N	t	2025-06-04 09:23:53.124	2025-06-04 09:23:53.124
cmbhqq7520006qagu4mj8he8k	cmbhqq74t0000qaguaeeoa0qa	4	Goed product, maar...	De wasstrips werken prima, maar bij hardnekkige vlekken moet je soms twee strips gebruiken.	Peter Jansen	\N	t	2025-06-04 09:23:53.126	2025-06-04 09:23:53.126
cmbhqq7530008qaguigpgpg6l	cmbhqq74t0000qaguaeeoa0qa	4	Milieuvriendelijk alternatief	Fijn dat er een duurzaam alternatief is voor traditionele vaatwastabletten.	Lisa Bakker	\N	f	2025-06-04 09:23:53.128	2025-06-04 09:23:53.128
cmbhqq759000dqaguzbr0i0oe	cmbhqq7540009qagukrs9a906	5	Uitstekende wasstrips!	Ik ben zeer tevreden met deze wasstrips. Ze werken goed en zijn makkelijk in gebruik.	Anna de Vries	\N	t	2025-06-04 09:23:53.133	2025-06-04 09:23:53.133
cmbhqq75a000fqagu9jfxrzje	cmbhqq7540009qagukrs9a906	4	Goed product, maar...	De wasstrips werken prima, maar bij hardnekkige vlekken moet je soms twee strips gebruiken.	Peter Jansen	\N	t	2025-06-04 09:23:53.134	2025-06-04 09:23:53.134
cmbhqq75g000hqagumdkw56la	cmbhqq7540009qagukrs9a906	4	Milieuvriendelijk alternatief	Fijn dat er een duurzaam alternatief is voor traditionele vaatwastabletten.	Lisa Bakker	\N	f	2025-06-04 09:23:53.14	2025-06-04 09:23:53.14
cmbhqq75o000mqagugwksmfbk	cmbhqq75h000iqagubs20e1ak	5	Uitstekende wasstrips!	Ik ben zeer tevreden met deze wasstrips. Ze werken goed en zijn makkelijk in gebruik.	Anna de Vries	\N	t	2025-06-04 09:23:53.148	2025-06-04 09:23:53.148
cmbhqq75o000oqagudqjudksx	cmbhqq75h000iqagubs20e1ak	4	Goed product, maar...	De wasstrips werken prima, maar bij hardnekkige vlekken moet je soms twee strips gebruiken.	Peter Jansen	\N	t	2025-06-04 09:23:53.149	2025-06-04 09:23:53.149
cmbhqq75r000qqagufr9b4qvs	cmbhqq75h000iqagubs20e1ak	4	Milieuvriendelijk alternatief	Fijn dat er een duurzaam alternatief is voor traditionele vaatwastabletten.	Lisa Bakker	\N	f	2025-06-04 09:23:53.152	2025-06-04 09:23:53.152
cmbhqq75v000vqagudmr3ifek	cmbhqq75t000rqagui60k77hi	5	Uitstekende wasstrips!	Ik ben zeer tevreden met deze wasstrips. Ze werken goed en zijn makkelijk in gebruik.	Anna de Vries	\N	t	2025-06-04 09:23:53.155	2025-06-04 09:23:53.155
cmbhqq75v000xqagu9ojlv93o	cmbhqq75t000rqagui60k77hi	4	Goed product, maar...	De wasstrips werken prima, maar bij hardnekkige vlekken moet je soms twee strips gebruiken.	Peter Jansen	\N	t	2025-06-04 09:23:53.156	2025-06-04 09:23:53.156
cmbhqq75w000zqagu3azdp7vg	cmbhqq75t000rqagui60k77hi	4	Milieuvriendelijk alternatief	Fijn dat er een duurzaam alternatief is voor traditionele vaatwastabletten.	Lisa Bakker	\N	f	2025-06-04 09:23:53.156	2025-06-04 09:23:53.156
cmbhqq75z0014qagu6muo2uu1	cmbhqq75w0010qagufkq0q0w1	5	Uitstekende wasstrips!	Ik ben zeer tevreden met deze wasstrips. Ze werken goed en zijn makkelijk in gebruik.	Anna de Vries	\N	t	2025-06-04 09:23:53.16	2025-06-04 09:23:53.16
cmbhqq7600016qaguiiz28b7x	cmbhqq75w0010qagufkq0q0w1	4	Goed product, maar...	De wasstrips werken prima, maar bij hardnekkige vlekken moet je soms twee strips gebruiken.	Peter Jansen	\N	t	2025-06-04 09:23:53.161	2025-06-04 09:23:53.161
cmbhqq7610018qagu4sj5alfx	cmbhqq75w0010qagufkq0q0w1	4	Milieuvriendelijk alternatief	Fijn dat er een duurzaam alternatief is voor traditionele vaatwastabletten.	Lisa Bakker	\N	f	2025-06-04 09:23:53.161	2025-06-04 09:23:53.161
\.


--
-- Data for Name: ScrapingLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ScrapingLog" (id, "productId", supplier, status, message, "oldPrice", "newPrice", "priceChange", "startedAt", "completedAt", duration) FROM stdin;
\.


--
-- Data for Name: SiteSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSetting" (id, key, value, description, "createdAt", "updatedAt") FROM stdin;
cmbhp6ozk001a8tqbdlgfiyeu	site_name	Vaatwasstrips Vergelijker	Site name	2025-06-04 08:40:43.521	2025-06-04 08:40:43.521
cmbhp6ozm001b8tqbgfhnb8s1	site_description	Vergelijk vaatwasstrips van alle Nederlandse aanbieders	Site description	2025-06-04 08:40:43.523	2025-06-04 08:40:43.523
cmbhp6ozn001c8tqbp61173v5	contact_email	info@vaatwasstripsvergelijker.nl	Contact email	2025-06-04 08:40:43.523	2025-06-04 08:40:43.523
\.


--
-- Data for Name: Subscriber; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscriber" (id, email, active, "priceAlerts", newsletter, verified, "verifyToken", "subscribedAt", "unsubscribedAt") FROM stdin;
\.


--
-- Name: AdminUser AdminUser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminUser"
    ADD CONSTRAINT "AdminUser_pkey" PRIMARY KEY (id);


--
-- Name: AffiliateClick AffiliateClick_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AffiliateClick"
    ADD CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Guide Guide_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guide"
    ADD CONSTRAINT "Guide_pkey" PRIMARY KEY (id);


--
-- Name: PriceAlert PriceAlert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceAlert"
    ADD CONSTRAINT "PriceAlert_pkey" PRIMARY KEY (id);


--
-- Name: PriceHistory PriceHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceHistory"
    ADD CONSTRAINT "PriceHistory_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: ScrapingLog ScrapingLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ScrapingLog"
    ADD CONSTRAINT "ScrapingLog_pkey" PRIMARY KEY (id);


--
-- Name: SiteSetting SiteSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSetting"
    ADD CONSTRAINT "SiteSetting_pkey" PRIMARY KEY (id);


--
-- Name: Subscriber Subscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscriber"
    ADD CONSTRAINT "Subscriber_pkey" PRIMARY KEY (id);


--
-- Name: AdminUser_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AdminUser_email_key" ON public."AdminUser" USING btree (email);


--
-- Name: AffiliateClick_productId_clickedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AffiliateClick_productId_clickedAt_idx" ON public."AffiliateClick" USING btree ("productId", "clickedAt");


--
-- Name: AffiliateClick_supplier_clickedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AffiliateClick_supplier_clickedAt_idx" ON public."AffiliateClick" USING btree (supplier, "clickedAt");


--
-- Name: BlogPost_published_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_published_publishedAt_idx" ON public."BlogPost" USING btree (published, "publishedAt");


--
-- Name: BlogPost_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_slug_idx" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: Guide_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guide_category_idx" ON public."Guide" USING btree (category);


--
-- Name: Guide_published_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guide_published_publishedAt_idx" ON public."Guide" USING btree (published, "publishedAt");


--
-- Name: Guide_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guide_slug_idx" ON public."Guide" USING btree (slug);


--
-- Name: Guide_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Guide_slug_key" ON public."Guide" USING btree (slug);


--
-- Name: PriceAlert_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PriceAlert_email_idx" ON public."PriceAlert" USING btree (email);


--
-- Name: PriceAlert_productId_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PriceAlert_productId_active_idx" ON public."PriceAlert" USING btree ("productId", active);


--
-- Name: PriceHistory_productId_recordedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PriceHistory_productId_recordedAt_idx" ON public."PriceHistory" USING btree ("productId", "recordedAt");


--
-- Name: Product_currentPrice_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_currentPrice_idx" ON public."Product" USING btree ("currentPrice");


--
-- Name: Product_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_slug_idx" ON public."Product" USING btree (slug);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Product_supplier_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_supplier_idx" ON public."Product" USING btree (supplier);


--
-- Name: Review_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_productId_idx" ON public."Review" USING btree ("productId");


--
-- Name: Review_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_rating_idx" ON public."Review" USING btree (rating);


--
-- Name: ScrapingLog_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ScrapingLog_status_idx" ON public."ScrapingLog" USING btree (status);


--
-- Name: ScrapingLog_supplier_startedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ScrapingLog_supplier_startedAt_idx" ON public."ScrapingLog" USING btree (supplier, "startedAt");


--
-- Name: SiteSetting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SiteSetting_key_key" ON public."SiteSetting" USING btree (key);


--
-- Name: Subscriber_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscriber_email_key" ON public."Subscriber" USING btree (email);


--
-- Name: Subscriber_verifyToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscriber_verifyToken_key" ON public."Subscriber" USING btree ("verifyToken");


--
-- Name: PriceAlert PriceAlert_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceAlert"
    ADD CONSTRAINT "PriceAlert_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PriceHistory PriceHistory_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceHistory"
    ADD CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScrapingLog ScrapingLog_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ScrapingLog"
    ADD CONSTRAINT "ScrapingLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

