interface StatusBadgeProps {
  status: string
  type: 'order' | 'payment'
}

const getStatusStyle = (status: string, type: string) => {
  if (type === 'order') {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  } else {
    // payment_status
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'Beklemede',
    paid: 'Ödendi',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
    failed: 'Başarısız',
  }
  return labels[status as keyof typeof labels] || status
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(status, type)}`}>
      {getStatusLabel(status)}
    </span>
  )
}
