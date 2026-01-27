import Link from 'next/link';

export default function YeniPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Yeni</h1>
      <p>This is the Yeni (New) page</p>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/yeni">Yeni</Link></li>
        </ul>
      </nav>
    </main>
  );
}
