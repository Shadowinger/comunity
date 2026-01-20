# Community Help Hub

Webová platforma pro komunitní pomoc s Discord-like UI

## Popis projektu

Community Help Hub je full-stack webová aplikace vytvořená pomocí frameworku Angular (frontend) a Express.js (backend) s databází PostgreSQL. Cílem projektu je umožnit lidem z jedné komunity vzájemně si pomáhat prostřednictvím jednoduchého online systému.

## Použité technologie

- **Angular 15** – tvorba uživatelského rozhraní, routování, služby, formuláře
- **Express.js (Node.js)** – REST API, autentizace, komunikace s databází
- **PostgreSQL** – ukládání uživatelů, žádostí o pomoc, zpráv
- **Docker** – kontejnerizace databáze a backendu
- **JWT (JSON Web Token)** – bezpečné přihlášení uživatelů
- **Tailwind CSS** – Discord-style styling
- **TypeScript, RXJS**

## Stránky aplikace

- **Home Page** - přehled všech aktuálních žádostí o pomoc
- **Login Page** - přihlášení uživatelů pomocí JWT
- **Register Page** - vytvoření nového účtu
- **Help Requests Page** - výpis všech žádostí s filtry
- **Help Request Detail Page** - detail žádosti
- **Create Request Page** - formulář pro vytvoření nové žádosti
- **User Profile Page** - základní info o uživateli
- **Messages Page** - Discord-style chat mezi uživateli
- **Admin Page** - správa uživatelů a žádostí

## Hlavní funkce aplikace

- Registrace a přihlášení uživatelů
- Vytváření žádostí o pomoc (s textem a kategorií)
- Reakce na žádosti
- Discord-style chat mezi uživateli
- Administrace obsahu
- Bezpečné API s validací a rolemi (user/admin)

## Instalace a spuštění

### Spuštění pomocí Docker (doporučeno)

```bash
# Spuštění databáze a backendu
docker-compose up -d

# Spuštění frontendu
cd frontend
npm install
npm start
```

Aplikace bude dostupná na:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### Přihlašovací údaje

**Admin účet:**
- Email: admin@gmail.com
- Heslo: admin123456

### Ruční spuštění (bez Dockeru)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Databáze
Spusťte PostgreSQL server a vytvořte databázi `community`. Poté spusťte SQL skripty:
```bash
psql -U stanislav -d community -f backend/sql/schema.sql
psql -U stanislav -d community -f backend/sql/seed-admin.sql
```

## Struktura projektu

```
comunity/
├── backend/           # Express.js API
│   ├── src/
│   │   ├── config/    # Konfigurace databáze
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── sql/           # SQL skripty pro inicializaci
├── frontend/          # Angular aplikace
│   └── src/
│       └── app/
│           ├── components/  # Sdílené komponenty
│           ├── core/        # Služby, guards, interceptory
│           ├── pages/       # Stránky aplikace
│           └── shared/      # Modely a utility
└── docker-compose.yml
```


