// Simple utility to sync announcements between admin panel and main page
export interface Announcement {
  id: number
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  author: string
  category: string
}

export function getAnnouncements(): Announcement[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('announcements')
    if (saved) {
      return JSON.parse(saved)
    }
  }
  
  // Default announcements
  return [
    {
      id: 1,
      title: 'Zebranie Rady Rodziców - 15 stycznia 2024',
      content: 'Serdecznie zapraszamy na zebranie Rady Rodziców, które odbędzie się 15 stycznia 2024 o godzinie 18:00 w sali konferencyjnej szkoły.',
      date: '2024-01-10',
      priority: 'high',
      author: 'Anna Kowalska',
      category: 'Zebrania'
    },
    {
      id: 2,
      title: 'Zmiana terminu wycieczki klasowej',
      content: 'Wycieczka klasowa zaplanowana na 20 stycznia została przeniesiona na 27 stycznia z powodu warunków pogodowych.',
      date: '2024-01-08',
      priority: 'medium',
      author: 'Jan Nowak',
      category: 'Wycieczki'
    },
    {
      id: 3,
      title: 'Nowe zasady dotyczące obiadów',
      content: 'Od lutego wprowadzamy nowe zasady dotyczące zamawiania obiadów. Szczegóły zostaną przesłane w osobnym komunikacie.',
      date: '2024-01-05',
      priority: 'low',
      author: 'Maria Wiśniewska',
      category: 'Obiady'
    }
  ]
}
