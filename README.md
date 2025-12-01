# Community Help Hub

Webová platforma pro komunitní pomoc

## Popis projektu

Community Help Hub je full-stack webová aplikace vytvořená pomocí frameworku Angular (frontend) a PHP (backend) s databází MySQL. Cílem projektu je umožnit lidem z jedné komunity vzájemně si pomáhat prostřednictvím jednoduchého online systému.

## Použité technologie

- **Angular** – tvorba uživatelského rozhraní, routování, služby, formuláře
- **PHP (REST API)** – autentizace, komunikace s databází, správa dat
- **MySQL** – ukládání uživatelů, žádostí o pomoc, komentářů, zpráv
- **JWT (JSON Web Token)** – bezpečné přihlášení uživatelů
- **HTML, SCSS, TypeScript, RXJS**

## Stránky aplikace

- **Home Page** - přehled všech aktuálních žádostí o pomoc
- **Login Page** - přihlášení uživatelů pomocí JWT
- **Register Page** - vytvoření nového účtu
- **Help Requests Page** - výpis všech žádostí
- **Help Request Detail Page** - detail žádosti s komentáři
- **Create Request Page** - formulář pro vytvoření nové žádosti
- **User Profile Page** - základní info o uživateli
- **Messages (Chat) Page** - jednoduchý chat mezi žadatelem a pomocníkem
- **Admin Page** - správa uživatelů, žádostí a komentářů

## Hlavní funkce aplikace

- Registrace a přihlášení uživatelů
- Vytváření žádostí o pomoc (s textem, kategorií a fotografií)
- Komentáře a nabídky pomoci
- Jednoduchý chat mezi uživateli
- Administrace obsahu
- Bezpečné API s validací a rolemi (user/admin)

## Instalace a spuštění

### Backend
```bash
cd backend
composer install
```

### Frontend
```bash
cd frontend
npm install
ng serve
```


