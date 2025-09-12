import Hero from '@/components/Hero'
// import Announcements from '@/components/Announcements' // Hidden for now, might be used later
import CalendarEvents from '@/components/CalendarEvents'
import VotingSection from '@/components/VotingSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      {/* Main Content - Split Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Voting */}
          <div className="flex flex-col">
            <VotingSection />
          </div>
          
          {/* Right Column - Calendar */}
          <div className="flex flex-col">
            <CalendarEvents />
          </div>
        </div>
      </div>
    </div>
  )
}
