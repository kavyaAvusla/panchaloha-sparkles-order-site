import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Panchaloha Sparkles Jewellery — order online',
  description:
    'Panchloham collections, one gram gold, imitation, GJ, gold covering and beads jewellery from Panchaloha Sparkles Jewellery, Narayanakhed. See what we have with prices, and send your order.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
