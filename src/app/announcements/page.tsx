import Announcements from '@/components/Announcements'

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ogłoszenia</h1>
          <p className="text-lg text-gray-600">
            Wszystkie najważniejsze informacje i ogłoszenia dla rodziców
          </p>
        </div>
        <Announcements />
      </div>
    </div>
  )
}
