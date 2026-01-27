import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dental Market</h1>
      <p>Welcome to the dental e-commerce platform</p>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/yeni">Yeni</Link></li>
        </ul>
      </nav>
    </main>
  );
}
