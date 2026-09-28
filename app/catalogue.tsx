import Link from 'next/link';
import type { Item } from '@/lib/supabase';

const ALL = 'All';

export default function Catalogue({
  items,
  categories,
  active,
}: {
  items: Item[];
  categories: readonly string[];
  active: string;
}) {
  const shown =
    active === ALL ? items : items.filter((i) => i.category === active);

  const buttons = [ALL, ...categories];
  const href = (c: string) => (c === ALL ? '/' : `/?c=${encodeURIComponent(c)}`);

  return (
    <>
      <nav className="filters" aria-label="Shop by category">
        {buttons.map((c) => (
          <Link
            key={c}
            href={href(c)}
            className={`filter-btn ${active === c ? 'active' : ''}`}
            aria-current={active === c ? 'page' : undefined}
            scroll={false}
          >
            {c}
          </Link>
        ))}
      </nav>

      <div className="items">
        {shown.map((i) => (
          <article className="item" key={i.id}>
            {i.image ? (
              <img src={i.image} alt={i.name} loading="lazy" />
            ) : (
              <div className="noimg" />
            )}
            <h3>{i.name}</h3>
            {i.description ? <p>{i.description}</p> : null}
            {i.category ? <span className="cat">{i.category}</span> : null}
            <div className="price">
              ₹{Number(i.price).toLocaleString('en-IN')}
            </div>
          </article>
        ))}

        {shown.length === 0 && (
          <div className="panel empty">
            <h3>Nothing here yet</h3>
            <p>No items are listed under &ldquo;{active}&rdquo; at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}
