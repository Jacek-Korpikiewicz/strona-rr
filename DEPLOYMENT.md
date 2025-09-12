# Przewodnik wdrażania

## Wdrażanie na Vercel (Zalecane)

### Opcja 1: Przez Vercel CLI

1. Zainstaluj Vercel CLI:
```bash
npm i -g vercel
```

2. Zaloguj się do Vercel:
```bash
vercel login
```

3. Wdróż projekt:
```bash
vercel
```

4. Skonfiguruj domenę (opcjonalnie):
```bash
vercel domains add twoja-domena.pl
```

### Opcja 2: Przez GitHub + Vercel Dashboard

1. Wypchnij kod do repozytorium GitHub
2. Przejdź do [vercel.com](https://vercel.com)
3. Kliknij "New Project"
4. Połącz repozytorium GitHub
5. Vercel automatycznie wykryje Next.js i skonfiguruje projekt
6. Kliknij "Deploy"

### Konfiguracja domeny

1. W panelu Vercel przejdź do ustawień projektu
2. W sekcji "Domains" dodaj swoją domenę
3. Skonfiguruj DNS u swojego dostawcy domeny:
   - Dodaj rekord CNAME: `www` → `cname.vercel-dns.com`
   - Dodaj rekord A: `@` → `76.76.19.61`

## Wdrażanie na inne platformy

### Netlify

1. Zbuduj projekt: `npm run build`
2. Prześlij folder `out` do Netlify
3. Skonfiguruj redirects w `_redirects` file

### GitHub Pages

1. Zbuduj projekt: `npm run build`
2. Wdróż folder `out` do branch `gh-pages`
3. Włącz GitHub Pages w ustawieniach repozytorium

## Zmienne środowiskowe

Jeśli używasz zewnętrznych usług (Formspree, Google Forms), dodaj klucze API w:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

## Monitoring

- Vercel automatycznie monitoruje wydajność
- Sprawdzaj logi w panelu Vercel
- Ustaw alerty dla błędów 500+

## Aktualizacje

Po każdej zmianie w kodzie:
1. Wypchnij zmiany do GitHub
2. Vercel automatycznie wdroży nową wersję
3. Sprawdź czy wszystko działa poprawnie
