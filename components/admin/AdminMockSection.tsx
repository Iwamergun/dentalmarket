import type { AdminListSection } from '@/lib/admin/mock-data'

interface AdminMockSectionProps {
  section: AdminListSection
}

export default function AdminMockSection({ section }: AdminMockSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{section.description}</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {section.apiTodo}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {section.columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {section.rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.values.map((value, index) => (
                    <td key={`${row.id}-${section.columns[index] ?? index}`} className="px-6 py-4 text-gray-700">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
