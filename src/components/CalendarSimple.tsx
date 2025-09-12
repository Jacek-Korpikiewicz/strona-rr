export default function CalendarSimple() {
  return (
    <section id="calendar" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Kalendarz wydarzeń</h2>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Kalendarz Trójki Klasowej
            </h3>
          </div>
          <div className="relative" style={{ paddingBottom: '75%' }}>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f%40group.calendar.google.com&ctz=Europe%2FWarsaw"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              width="800"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="Kalendarz Trójki Klasowej"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
