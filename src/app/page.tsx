import CalendarEvents from '@/components/CalendarEvents'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <CalendarEvents />
        </div>
      </div>
    </div>
  )
}
