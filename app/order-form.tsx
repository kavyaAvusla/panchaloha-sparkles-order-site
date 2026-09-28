'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, missingSupabaseSettings, type Item } from '@/lib/supabase';
import { SHOP } from '@/lib/shop';

type Props = { items: Item[]; canSave: boolean };
type Errors = { name?: string; phone?: string; item?: string };

export default function OrderForm({ items, canSave }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [itemId, setItemId] = useState('');
  const [freeItem, setFreeItem] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<{ id: string; message: string } | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const useSelect = items.length > 0;
  const selected = useMemo(
    () => items.find((i) => i.id === itemId) ?? null,
    [items, itemId]
  );

  // Refuses to submit empty, and names the field that is missing.
  function validate(): boolean {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Please enter your name.';

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim()) e.phone = 'Please enter your phone number.';
    else if (digits.length !== 10) e.phone = 'Phone must be 10 digits.';

    if (useSelect) {
      if (!itemId) e.item = 'Please choose an item.';
    } else if (!freeItem.trim()) {
      e.item = 'Please type the item you want.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function send(channel: 'sms' | 'whatsapp') {
    setFailure(null);
    setSaved(null);

    if (!validate()) return;

    const missing = missingSupabaseSettings();
    if (missing.length > 0) {
      setFailure(
        `Not saved: ${missing.join(' and ')} ${
          missing.length > 1 ? 'are' : 'is'
        } not set in .env.local.`
      );
      return;
    }

    const itemName = useSelect ? selected?.name ?? '' : freeItem.trim();
    const price = useSelect && selected ? Number(selected.price) : null;
    const text = `Order from ${name.trim()} (${phone.trim()}): ${itemName} — ${
      price !== null ? `Rs ${price}` : 'price to confirm'
    }. Please confirm.`;

    setBusy(true);
    const supabase = getSupabase();
    if (!supabase) {
      setBusy(false);
      setFailure('Not saved: the Supabase client could not be created.');
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({ name: name.trim(), phone: phone.trim(), item: itemName, price })
      .select('id')
      .single();
    setBusy(false);

    if (error) {
      setFailure(`The order was not saved. Supabase said: ${error.message}`);
      return;
    }

    setSaved({ id: data!.id, message: text });
    router.refresh();

    const enc = encodeURIComponent(text);
    if (channel === 'sms') {
      // Opens the phone's messages app with the order already typed in.
      window.location.href = `sms:+${SHOP.whatsapp}?&body=${enc}`;
    } else {
      window.open(
        `https://wa.me/${SHOP.whatsapp}?text=${enc}`,
        '_blank',
        'noopener'
      );
    }
  }

  const smsHref = saved
    ? `sms:+${SHOP.whatsapp}?&body=${encodeURIComponent(saved.message)}`
    : '#';
  const waHref = saved
    ? `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(saved.message)}`
    : '#';

  return (
    <div className="order">
      <div className={`field ${errors.name ? 'bad' : ''}`}>
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Anjali"
          autoComplete="name"
        />
        {errors.name && <div className="err">{errors.name}</div>}
      </div>

      <div className={`field ${errors.phone ? 'bad' : ''}`}>
        <label htmlFor="phone">Phone (10 digits)</label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 9876543210"
          inputMode="numeric"
          autoComplete="tel"
        />
        {errors.phone && <div className="err">{errors.phone}</div>}
      </div>

      {useSelect ? (
        <div className={`field ${errors.item ? 'bad' : ''}`}>
          <label htmlFor="item">Item you want</label>
          <select
            id="item"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          >
            <option value="">Choose an item…</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} — ₹{Number(i.price).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
          {errors.item && <div className="err">{errors.item}</div>}
        </div>
      ) : (
        <div className={`field ${errors.item ? 'bad' : ''}`}>
          <label htmlFor="itemfree">Item you want</label>
          <input
            id="itemfree"
            value={freeItem}
            onChange={(e) => setFreeItem(e.target.value)}
            placeholder="e.g. Kundan choker set"
          />
          {errors.item && <div className="err">{errors.item}</div>}
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          disabled={busy}
          onClick={() => send('sms')}
        >
          {busy ? 'Sending…' : 'Send my order (SMS)'}
        </button>
        <button
          type="button"
          className="btn ghost"
          disabled={busy}
          onClick={() => send('whatsapp')}
        >
          {busy ? 'Sending…' : 'Send my order (WhatsApp)'}
        </button>
      </div>

      {!canSave && (
        <div className="result failed">
          Orders cannot be saved until the missing setting is added to{' '}
          <code>.env.local</code>.
        </div>
      )}

      {failure && <div className="result failed">{failure}</div>}

      {saved && (
        <div className="result saved">
          <div>
            <strong>Saved.</strong> Order recorded as{' '}
            <code>#{saved.id.slice(0, 8)}</code>.
          </div>
          <div className="msg">{saved.message}</div>
          <div className="actions" style={{ marginTop: 10 }}>
            <a className="btn primary" href={smsHref}>
              Open in SMS
            </a>
            <a
              className="btn ghost"
              href={waHref}
              target="_blank"
              rel="noreferrer"
            >
              Open in WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
