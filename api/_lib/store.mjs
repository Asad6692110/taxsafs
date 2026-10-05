// Storage for enquiries and page views. Two backends behind one interface:
//  - Local preview: JSON files in .data/ (git-ignored).
//  - Production: Upstash Redis over its REST API (no package needed). On Vercel, add the Upstash Redis
//    integration, which sets KV_REST_API_URL and KV_REST_API_TOKEN.
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const hosted = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');

/** Thrown when the site is deployed without a database; the API answers 503 and the form falls back to email. */
export class StoreUnavailable extends Error {}

const EVENT_TTL = 400 * 86400; // page views are kept for 400 days

const redis = async (...commands) => {
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  return (await res.json()).map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
};

const redisStore = {
  async addLead(lead) {
    await redis(['HSET', 'leads', lead.id, JSON.stringify(lead)]);
  },
  async getLeads() {
    const [flat] = await redis(['HGETALL', 'leads']);
    return (flat || []).filter((_, i) => i % 2).map((v) => JSON.parse(v));
  },
  async updateLead(id, patch) {
    const [raw] = await redis(['HGET', 'leads', id]);
    if (!raw) return null;
    const lead = { ...JSON.parse(raw), ...patch };
    await redis(['HSET', 'leads', id, JSON.stringify(lead)]);
    return lead;
  },
  async deleteLead(id) {
    await redis(['HDEL', 'leads', id]);
  },
  async addEvent(day, event) {
    await redis(['RPUSH', `pv:${day}`, JSON.stringify(event)], ['EXPIRE', `pv:${day}`, EVENT_TTL]);
  },
  async getEvents(days) {
    const lists = await redis(...days.map((day) => ['LRANGE', `pv:${day}`, 0, -1]));
    return lists.flat().map((v) => JSON.parse(v));
  },
};

const dir = join(process.cwd(), '.data');
const leadsFile = join(dir, 'leads.json');
const readLeads = async () => JSON.parse(await readFile(leadsFile, 'utf8').catch(() => '{}'));
// Lead writes run one at a time so two requests can't overwrite each other's change.
let queue = Promise.resolve();
const changeLeads = (change) => {
  const run = queue.then(async () => {
    const leads = await readLeads();
    const result = change(leads);
    await mkdir(dir, { recursive: true });
    await writeFile(leadsFile, JSON.stringify(leads, null, 2));
    return result;
  });
  queue = run.catch(() => {});
  return run;
};

const fileStore = {
  addLead: (lead) => changeLeads((leads) => { leads[lead.id] = lead; }),
  getLeads: async () => Object.values(await readLeads()),
  updateLead: (id, patch) => changeLeads((leads) => (leads[id] ? (leads[id] = { ...leads[id], ...patch }) : null)),
  deleteLead: (id) => changeLeads((leads) => { delete leads[id]; }),
  async addEvent(day, event) {
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, `pv-${day}.jsonl`), `${JSON.stringify(event)}\n`);
  },
  async getEvents(days) {
    const files = await Promise.all(days.map((day) => readFile(join(dir, `pv-${day}.jsonl`), 'utf8').catch(() => '')));
    return files.flatMap((text) => text.split('\n').filter(Boolean).map((line) => JSON.parse(line)));
  },
};

const unavailable = () => { throw new StoreUnavailable('No database is configured.'); };
const noStore = Object.fromEntries(Object.keys(fileStore).map((name) => [name, async () => unavailable()]));

export const store = url && token ? redisStore : hosted ? noStore : fileStore;
