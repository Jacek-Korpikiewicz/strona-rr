export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Szybkie linki</h3>
            <div className="space-y-2">
              <a href="/announcements" className="block text-gray-300 hover:text-white transition-colors">
                Ogłoszenia
              </a>
              <a href="/voting" className="block text-gray-300 hover:text-white transition-colors">
                Głosowania
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informacje</h3>
            <div className="space-y-2 text-gray-300">
              <p>Strona dla rodziców Klasa I b - SP 398</p>
              <p>Centralne miejsce informacji</p>
              <p>i głosowań</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
