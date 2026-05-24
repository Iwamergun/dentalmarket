import { redirect } from 'next/navigation'

export default function SupplierYeniUrunRedirectPage() {
  redirect('/admin/products/new')
}
