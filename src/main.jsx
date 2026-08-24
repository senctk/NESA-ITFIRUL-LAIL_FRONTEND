import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
})
const dateFormat = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormat.format(date)
}

function statusClass(status) {
  return `status status--${status.toLowerCase().replaceAll('_', '-')}`
}

function useApi(resource) {
  const [state, setState] = React.useState({ data: [], loading: true, error: '' })

  const load = React.useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const response = await fetch(`${API_BASE_URL}/dummy/${resource}`)
      if (!response.ok) throw new Error(`Server merespons dengan status ${response.status}`)
      setState({ data: await response.json(), loading: false, error: '' })
    } catch (error) {
      setState({ data: [], loading: false, error: error.message })
    }
  }, [resource])

  React.useEffect(() => { load() }, [load])
  return { ...state, reload: load }
}

function ProductCard({ product }) {
  return <article className="product-card">
    <div className="product-image-wrap">
      <img src={product.gambarUrl} alt={product.nama} className="product-image" />
      <span className={`availability ${product.aktif ? 'availability--active' : 'availability--inactive'}`}>
        {product.aktif ? 'Aktif' : 'Nonaktif'}
      </span>
    </div>
    <div className="product-content">
      <p className="eyebrow">{product.kategori}</p>
      <h3>{product.nama}</h3>
      <p className="description">{product.deskripsi}</p>
      <div className="product-footer">
        <strong>{rupiah.format(product.harga)}</strong>
        <span className={product.stok > 0 ? 'stock' : 'stock stock--empty'}>
          {product.stok > 0 ? `${product.stok} stok` : 'Stok habis'}
        </span>
      </div>
    </div>
  </article>
}

function Products() {
  const { data, loading, error, reload } = useApi('produk')
  return <section aria-labelledby="products-title">
    <SectionHeading title="Katalog produk" count={data.length} description="Pilihan terbaik yang tersedia di toko hari ini." />
    <DataState loading={loading} error={error} retry={reload} />
    {!loading && !error && <div className="product-grid">{data.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
  </section>
}

function TransactionCard({ transaction }) {
  return <article className="transaction-card">
    <div className="transaction-top">
      <div>
        <p className="eyebrow">Pesanan #{String(transaction.id).padStart(4, '0')}</p>
        <h3>{formatDate(transaction.tanggal)}</h3>
      </div>
      <span className={statusClass(transaction.status)}>{transaction.status.replaceAll('_', ' ')}</span>
    </div>
    <div className="transaction-summary">
      <div><span>Total pembayaran</span><strong>{rupiah.format(transaction.total)}</strong></div>
      <div><span>Metode pembayaran</span><strong>{transaction.metodePembayaran.replaceAll('_', ' ')}</strong></div>
      <div><span>Alamat pengiriman</span><strong>{transaction.alamatPengiriman}</strong></div>
      {transaction.nomorResi && <div><span>Nomor resi</span><strong>{transaction.nomorResi}</strong></div>}
    </div>
    <div className="items" aria-label={`Item pesanan ${transaction.id}`}>
      <h4>{transaction.items.length} item pesanan</h4>
      {transaction.items.map((item) => <div className="order-item" key={item.id}>
        <img src={item.produk.gambarUrl} alt={item.produk.nama} />
        <div><strong>{item.produk.nama}</strong><span>{item.jumlah} × {rupiah.format(item.harga)}</span></div>
        <strong>{rupiah.format(item.jumlah * item.harga)}</strong>
      </div>)}
    </div>
    {transaction.catatanPembeli && <p className="note"><span>Catatan pembeli:</span> {transaction.catatanPembeli}</p>}
  </article>
}

function Transactions() {
  const { data, loading, error, reload } = useApi('transaksi')
  return <section aria-labelledby="transactions-title">
    <SectionHeading title="Pesanan terbaru" count={data.length} description="Pantau status dan detail setiap pesanan." />
    <DataState loading={loading} error={error} retry={reload} />
    {!loading && !error && <div className="transaction-list">{data.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)}</div>}
  </section>
}

function SectionHeading({ title, count, description }) {
  return <div className="section-heading"><div><p className="eyebrow">Marketplace</p><h2>{title}</h2><p>{description}</p></div><span className="count">{count} data</span></div>
}

function DataState({ loading, error, retry }) {
  if (loading) return <div className="data-state">Memuat data…</div>
  if (error) return <div className="data-state data-state--error"><p>Data belum dapat dimuat. Pastikan backend berjalan di port 8055.</p><small>{error}</small><button onClick={retry}>Coba lagi</button></div>
  return null
}

function App() {
  const [page, setPage] = React.useState('products')
  return <><header className="site-header"><a className="brand" href="#top"><span>H</span> Hokky Store</a><nav aria-label="Navigasi utama"><button className={page === 'products' ? 'active' : ''} onClick={() => setPage('products')}>Produk</button><button className={page === 'transactions' ? 'active' : ''} onClick={() => setPage('transactions')}>Transaksi</button></nav></header>
    <main id="top"><div className="hero"><p className="eyebrow">Belanja lebih mudah</p><h1>Semua kebutuhan, <em>satu tempat.</em></h1><p>Jelajahi katalog pilihan kami dan lihat detail pesanan Anda dengan cepat.</p></div>{page === 'products' ? <Products /> : <Transactions />}</main>
    <footer>© 2026 Hokky Store · Frontend technical test</footer></>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
