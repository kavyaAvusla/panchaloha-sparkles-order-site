import { getSupabase, missingSupabaseSettings, SUPABASE_URL, type Item } from '@/lib/supabase';
import { SHOP } from '@/lib/shop';
import Catalogue from './catalogue';
import OrderForm from './order-form';

// Always read from Supabase on each request, so a refresh shows what is really
// stored rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

type Load =
  | { state: 'setup'; missing: string[] }
  | { state: 'failed'; message: string }
  | { state: 'empty' }
  | { state: 'ready'; items: Item[] };

async function loadItems(): Promise<Load> {
  const missing = missingSupabaseSettings();
  if (missing.length > 0) return { state: 'setup', missing };

  const supabase = getSupabase();
  if (!supabase) return { state: 'setup', missing: missingSupabaseSettings() };

  const { data, error } = await supabase
    .from('items')
    .select('id, created_at, name, description, price, image, category')
    .order('price', { ascending: true });

  if (error) return { state: 'failed', message: error.message };
  if (!data || data.length === 0) return { state: 'empty' };
  return { state: 'ready', items: data as Item[] };
}

async function loadOrderCount(): Promise<number | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  if (error) return null;
  return count ?? 0;
}

function StatePanel({ load }: { load: Load }) {
  if (load.state === 'setup') {
    return (
      <div className="panel setup">
        <h3>Setup needed</h3>
        <p>
          The page cannot reach its data because a setting is missing. Add it to{' '}
          <code>.env.local</code> and restart the app:
        </p>
        <ul className="hint">
          {load.missing.map((m) => (
            <li key={m}>
              <code>{m}</code> is not set.
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (load.state === 'failed') {
    return (
      <div className="panel failed">
        <h3>Couldn’t load the shop’s items</h3>
        <p>The call to Supabase failed. The items could not be read.</p>
        <p className="hint">
          Supabase said: <code>{load.message}</code>
        </p>
        <p className="hint">
          Address in use: <code>{SUPABASE_URL ? SUPABASE_URL : '(nothing set)'}</code>
        </p>
        <p className="hint">
          If the table does not exist yet, run the SQL blocks provided with this
          app, then refresh.
        </p>
      </div>
    );
  }

  if (load.state === 'empty') {
    return (
      <div className="panel empty">
        <h3>Nothing listed yet</h3>
        <p>
          The call to Supabase worked, but the items table is empty. Add some
          items and refresh — the page will show them.
        </p>
      </div>
    );
  }

  return null;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ c?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.c) ? sp.c[0] : sp.c;
  const cats: readonly string[] = SHOP.categories;
  const active = raw && cats.includes(raw) ? raw : 'All';

  const [load, orderCount] = await Promise.all([loadItems(), loadOrderCount()]);

  const items = load.state === 'ready' ? load.items : [];
  const byName = new Map(items.map((i) => [i.name, i]));
  const arrivals = SHOP.newArrivals
    .map((n) => byName.get(n))
    .filter((i): i is Item => Boolean(i));

  return (
    <main className="wrap">
      <header className="shop-head">
        <h1 className="shop-name">{SHOP.name}</h1>
        <div className="cats">
          {SHOP.categories.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>
        <div className="shop-facts">
          <div>
            <span className="label">Owner</span>
            <span>{SHOP.owner}</span>
          </div>
          <div>
            <span className="label">Call or WhatsApp</span>
            <a href={`tel:+${SHOP.whatsapp}`}>{SHOP.phoneDisplay}</a>
          </div>
          <div>
            <span className="label">Open</span>
            <span>{SHOP.hours}</span>
          </div>
          <div>
            <span className="label">Address</span>
            <a href={SHOP.mapUrl} target="_blank" rel="noreferrer">
              {SHOP.address}
            </a>
          </div>
        </div>
      </header>

      <StatePanel load={load} />

      {load.state === 'ready' && (
        <>
          <section className="strip">
            <h2 className="section-title">New designs this week</h2>
            <div className="strip-row">
              {arrivals.map((i) => (
                <div className="strip-card" key={i.id}>
                  {i.image ? (
                    <img src={i.image} alt={i.name} loading="lazy" />
                  ) : (
                    <div className="noimg" />
                  )}
                  <div className="strip-name">{i.name}</div>
                  {i.category ? (
                    <span className="cat">{i.category}</span>
                  ) : null}
                  <span className="strip-price">
                    ₹{Number(i.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <h2 className="section-title">What we have</h2>
          <Catalogue items={items} categories={SHOP.categories} active={active} />
        </>
      )}

      <h2 className="section-title">Send your order</h2>
      <OrderForm items={items} canSave={load.state !== 'setup'} />

      {orderCount !== null && (
        <p className="recorded">
          Orders recorded in the shop’s sheet so far: <strong>{orderCount}</strong>
        </p>
      )}

      <footer className="foot">
        <div className="maker">Made by {SHOP.maker}</div>
      </footer>
    </main>
  );
}
