# Strona Rady Rodziców

Nowoczesna strona internetowa dla Rady Rodziców klasy, stworzona w Next.js z Tailwind CSS.

## Funkcjonalności

- 🏠 **Strona główna** - nowoczesny design z najnowszymi ogłoszeniami
- 📢 **Ogłoszenia** - sekcja z aktualnymi informacjami i komunikatami
- 🔗 **Ważne linki** - formularze, kalendarz szkolny, portale
- 🗳️ **Głosowania** - system głosowań z zabezpieczeniem przed duplikatami
- 📞 **Kontakt** - formularz kontaktowy z walidacją
- 📱 **Responsywny design** - działa na wszystkich urządzeniach

## Technologie

- **Next.js 15** - framework React z App Router
- **TypeScript** - typowanie statyczne
- **Tailwind CSS** - utility-first CSS framework
- **Vercel** - hosting (darmowy tier)

## Instalacja i uruchomienie

1. Zainstaluj zależności:
```bash
npm install
```

2. Uruchom serwer deweloperski:
```bash
npm run dev
```

3. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce

## Skrypty

- `npm run dev` - uruchomienie serwera deweloperskiego
- `npm run build` - budowanie aplikacji produkcyjnej
- `npm run start` - uruchomienie aplikacji produkcyjnej
- `npm run lint` - sprawdzenie kodu ESLint

## Struktura projektu

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # Globalne style
│   ├── layout.tsx         # Główny layout
│   ├── page.tsx           # Strona główna
│   ├── announcements/     # Strona ogłoszeń
│   ├── links/            # Strona linków
│   ├── voting/           # Strona głosowań
│   └── contact/          # Strona kontaktu
├── components/            # Komponenty React
│   ├── Navbar.tsx        # Nawigacja
│   ├── Footer.tsx        # Stopka
│   ├── Hero.tsx          # Sekcja hero
│   ├── Announcements.tsx # Ogłoszenia
│   ├── ImportantLinks.tsx # Ważne linki
│   ├── VotingSection.tsx # Głosowania
│   └── ContactForm.tsx   # Formularz kontaktowy
└── lib/                  # Narzędzia i utilities
```

## Wdrażanie

Aplikacja jest skonfigurowana do eksportu statycznego i może być hostowana na Vercel:

1. Połącz repozytorium z Vercel
2. Ustaw build command: `npm run build`
3. Ustaw output directory: `out`
4. Wdróż!

## Dostosowywanie

- **Kolory**: Edytuj `tailwind.config.js` aby zmienić paletę kolorów
- **Treść**: Aktualizuj dane w komponentach (announcements, links, voting)
- **Styling**: Użyj klas Tailwind CSS lub dodaj własne style w `globals.css`

## Licencja

ISC
