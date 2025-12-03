# case-study-4cb5697d-9557-4d73-b6df-d73870368f29

- 1. [Aufgabenstellung](#aufgabenstellung)
  - 1.1 [Funktionale Anforderungen](#funktionale-anforderungen)
  - 1.2 [Erwartungen](#erwartungen)
- 2.[Umsetzung](#umsetzung)
  - 2.1 [Anamnesebogen Flow (AF)](#anamnesebogen-flow-af)
    - 2.1.1 [AF - Temporärers Login (TL)](#af---temporärers-login-tl)
      - [AF-TL-Prozess](#af-tl-prozess)
    - 2.1.2 [Anamnesebogen (AB)](#anamnesebogen-ab)
      - [AB - Prozess](#ab---prozess)
    - 2.1.3[Persistierung der Anamnese Daten](#persistierung-der-anamnese-daten)
- 3.[Konzept](#konzept)
  - 3.1 [Design der Entitäten](#design-der-entitäten--funktionale-amnforderung-1)
    - 3.1.1 [Tempöres Login](#temporäres-login-hier)
  - 3.2 [Konzept Authentifizierung, Authorisierung sowie Security](#konzept-authentifizierung-authorisierung-sowie-security--funktionale-anforderung-2)
    - 3.2.1 [Öffentlicher Ananmnesebogen Flow](#öffentlicher-ananmnesebogen-flow)
    - 3.2.2 [Authorisierung mit der DB bzw. Queue](#authorisierung-mit-der-db-bzw-queue)
    - 3.2.3 [Back Office](#back-office)
  - 3.3 [Gedanken zu Security](#gedanken-zu-security)
    - 3.3.1 [Frontend](#frontend)
    - 3.3.2 [Backend](#backend)
  - 3.4 [Konzept Performance Pitfalls](#konzept-performance-pitfalls--funktionale-anforderung-3)
    - 3.4.1 [Pitfalls Performance - Öffentliche Applikation](#pitfalls-performance---öffentliche-applikation)
    - 3.4.2 [Pitfalls Performance - Backoffice Applikation](#pitfalls-performance---backoffice-applikation)
  - 3.5 [Backend - Technologie](#backend---technologie-funktionale-anforderung-4)
  - 3.6 [Front - Technologie](#frontend---technologie-funktionale-anforderung-5)
  4. [Demo](#demo)

## Aufgabenstellung

Aufgabe ist es eine zweiteilige Applikation zu bauen, bestehend aus einem Anamnesebogen der öffentlich für einen Patienten aufrufbar ist und Daten erfasst, welche für den Zweck der Demonstration minimalistisch gehalten werden können. Im Backoffice können authentifizierte Mitarbeitende den Bogen bearbeiten und über ein Statusmodell verwalten.

### Funktionale Anforderungen

#### Muss

<ul>
  <li id="functional-requirements-entities">1. Design der Applikation und Entitäten sollte einem nachvollziehbaren Konzept folgen (DONE)</li> 
  <li id="functional-requirements-security">2.Konzepte für Authentifizierung/Autorisierung und Security für Backoffice Applikation und öffentlichem Anamnesebogen (DONE)</li> 
  <li id="functional-requirements-performance-pitfalls">3.Performance Pitfalls sind entweder markiert als TODO oder entsprechend vermieden (DONE)</li> 
  <li id="functional-requirements-backend-implementation">4.Backend ist implementiert mit NodeJS, TypeScript, MongoDB und einem GraphQL Interface (DONE)</li> 
  <li id="functional-requirements-frontend-implementation">5.Frontend ist implementiert mit React oder Angular (WIP)</li>
</ul>


#### Optional

- Unit Tests oder Browser/Frontend Tests
- Security Hardening (Web Headers, Audit, Error Abstraction, etc…)
- Verwendung eines Backend Frameworks wie NestJS
- Verwendung eines Frontend Framework wie NextJS
- Monorepo Setup
- Infrastruktur-/Deployment Setup

### Erwartungen

Es ist nicht notwendig die Applikation an allen Stellen zu 100% auszuprogrammieren. Der Fokus liegt auf einem nachhaltigen Anwendungsdesign kombiniert mit der Anwendung gängiger Programmierkonzepte.

## Umsetzung

### Anamnesebogen Flow (AF)

- an dem Flow sind vier Systeme beteiligt
  - eine Webanwendung die servers seitig gehostet
  - eine REST API
    - der Client darf nur einen Endpunkt aufrufen der via "scope" geschützt ist
    - hierzu wird oAuth (Machine-to-Machine)
  - ein Service der auf eine Warteschlange lauscht
  - eine Warteschlange (RabbitMQ)

#### AF - Temporärers Login (TL)

- es wird eine öffentlich Seite "zum Bogen" eingererichtet, welche ohne Authentifizerung erreichbar ist
- auf dieser Seite wird eine Möglichkeit geschaffene eine "E-Mailadress" einzugeben und das Formular zu versenden
  - input type email
  - Validierung server seitig auf Sonderzeichen (SQL Injection)
- sobald das Formular versendet wurde, erscheint die Meldung "Bitte prüfen Sie ihren Posteingang..."
- Aktuell: Debug Mode (magic link) wird direkt angezeigt

##### AF-TL-Prozess

- es wird ein sog. magic link erstellt und in einer Datenbank persisitert
  - gültig_bis, guid, benutzt werden als Felder vorgesehen
- im Anschluss wird eine E-Mail an diese Adresse inklusive link verschickt

#### Anamnesebogen (AB)

- der Benutzer kann mit Hilfe des magic links aus der e-Email eine weiter Seite "Anamnesebogen" aufrufen
  - diese Seite ist nur mit gültigem magic link aufrufbar und "authentifiziert" den Benutzer temporär
  - auf dieser Seite ist ein Formular angeordnet
    - Felder: tbd
  - das Formular selbst wird client-seitig und server-seitig validiert
  - Nach Absenden des Formular erscheint die Meldung "Daten wurden erfolgreich empfangen...."

##### AB - Prozess

- die Daten aus dem Formular werden mittels REST Interface an die API versendet
  - der client hat nur Zugriff auf diesen Endpunkt der API und wird mittels "scop" abgetrennt
  - Body: tbd
  - die Daten werden zur weiteren Verarbeitung in eine Warteschlange persistiert (RabbitMQ)
  - wurden die Daten erfolgreich in die Queue geschrieben, wird der "magic link" als "genutzt" markiert und ist somit nicht mehr gültig

### Persistierung der Anamnese Daten

- via listener auf der queue werden die Nachrichten entpackt und die resultierenden Daten in der MongoDB persisitert
  - Struktur: tbd

## Konzept

### Design der Entitäten -[Funktionale Anforderung-1](#functional-requirements-entities)

#### Temporäres Login [link zur Story](#temporäres-login-hier)

#### TempLink (SQL Lite)

| Spalte         | Typ     | Format | Info|
|--------------|-----------|------------|--------|
| id | String      | UUID (PK)        |identifier of templink |
| tempLink      | String  |  Full Qualified Url      |Debug Only"|
| email      | String  | Email       |Identifer of Public User|
| processed      | Boolean  |        |Set to true if Anamnesis Document was submitted|
| createdAt      | DateTime  | UNIX TIMESTAMP       | Date.Now() |
| updatedAt      | DateTime  | UNIX TIMESTAMP       |Last Change|

#### Anamnesebogen (mongoDB)

#### AnamnesisDocument

| Spalte         | Typ     | Format | Info|
|--------------|-----------|------------|--------|
| id | String      | UUID (PK)        | |
| mainMedicalDisorder      | String  |        ||
| furtherMedicalDisorder      | String?  |        ||
| since      | DateTime  |        ||
| notes      | String?  |        ||
| User      | Object  |        |Relation to User Document|
| createdAt      | DateTime  | UNIX TIMESTAMP       | Date.Now() |
| updatedAt      | DateTime  | UNIX TIMESTAMP       |Last Change|
| ...      | ...  |     ...   |...|

#### User

| Spalte         | Typ     | Format | Info|
|--------------|-----------|------------|--------|
| id | String      | UUID (PK)        |auto-creation |
| firstname      | String  |        ||
| lastname      | String  |        ||
| birthdate      | DateTime?  |        ||
| address      | String  |        ||
| phone      | String?  |        ||
| mobile      | String?  |        ||
| gender      | string?  |        ||
| email      | String (unique)  |        |Identifer of Public User|
| createdAt      | DateTime  | UNIX TIMESTAMP       | Date.Now() |
| updatedAt      | DateTime  | UNIX TIMESTAMP       |Last Change|
| ...      | ...  |     ...   |...|

### Konzept Authentifizierung, Authorisierung sowie Security -[Funktionale Anforderung-2](#functional-requirements-security)

- genutzt wird ein sog. Secure Token Service - IAM Identity Access Management [Keycloak](https://www.keycloak.org)

#### Öffentlicher Ananmnesebogen Flow

- da jeder Benutzer diesen aufrufen kann scheint es wichtig die Authentifizierung durch zu führen
- das kann jedoch **nicht**  mit Benutzernamen und zug. Passwort geschen
- um die Identität des Benutzers zu überprüfen muss dieser eine E-Mailadresse bereitstellen auf die er Zugriff hat
- an diese E-Mailadresse wird ein ein eindeutiger Link verschickt (email+guid)
  - dieser Schlüssel wird in einer Datenbank persisiert
  - ein Zeitstempel wird ebenfalls gespeichert
  - der link sollte dann nur für eine gewisse Zeit gültig sein
  - OPTIONAL: zusätzlich zu diesem Link könnte man ein one-time-password in einer separaten E-Mail verwenden
- sobald der Benutzer den Link aus der E-Mail bestätigt, kann er das Anamneseformulat aufrufen

#### Authorisierung mit der DB bzw. Queue

- der Service der den Öffentlichen Anamnese Bogen bereitstellt hat nur eingeschränkten Zugriff
- der Webclient wird mittels oAuth (Machine-to-Machine Kommunikation (ClientId and Secret)) authentifiziert und via eines scopes auf den Endpunkt "Anamnesis Post" zugelassen
- in der Ausbaustufe greift die API nicht direkt auf die DB zu, sondern kann lediglich Nachrichten in eine Queue schreiben
- ein weiterer Dienst kann dann die Nachricht validieren und die Daten in der DB persistieren

#### Back Office

- das Backoffice wird durch eine weitere Webapplikation bereit gestellt
- das gibt die Möglichkeit es als Intranet zu konfigurieren und nur in eigenem Netzwerk zu erreichen via VPN (falls notwendig)
- in diesem wird der sg. [Auth Code Flow PKE] (https://oauth.net/2/pkce/) implementiert 
- der Benutzer wird mittels OpenIDConnect authentifiziert und via oAuth authorisiert
- seine Authorisierung wird auf die Webappliaktion delegiert und dann via scopes konfiguriert

### Gedanken zu Security

#### Frontend

- im Frontend werden Mechanismen integriert die Angriffe von außen erschweren und folgende Angriffe vermeiden sollen:
  - Cross Site JavaScript Attacken (XSS)
  - CSP Level 2 und Cross Site Request Forgery Attacken (CSRF)   
  - SQL Injections

#### Backend

- im Backend werden Mechanismen integriert die Angriffe von außen erschweren
- alle Anfragen sollten auf gültige Werte geprüft werden
- Sonderzeichen sollten nicht zu gelassen werden
- keine direkten Zugriffe auf die Datenbanken mit PLAIN SQL STATEMENTS, sonder store procedures nutzen

### Konzept Performance Pitfalls -[Funktionale Anforderung-3](#functional-requirements-performance-pitfalls)


#### Pitfalls Performance - Öffentliche Applikation

- da der Anamnesebogen öffentlich verfügbar ist können rein theoretisch alle aktuellen Patienten der Schönklinikgruppe zugreigen, als auch potentielle neue Patienten, sowie Personen mit bösen Absichten
- die Anzahl der Benutzer könnte sehr hoch sein
- die Webapplikation kann horizontal skaliert werden und sollte somit der Last stand halten
- der lesende Zugriff auf die Datenbank sollte ebenfalls kein Problem sein und kann bei Bedarf im CQRS Pattern skaliert und im Cluster berebereit gestellt werden (Lesender Zugriff)
- die API die übermittelten Daten entgegen nimmt, kann ebenfalls skaliert werden
- im Zielstatus werden die Daten nicht direkt in der DAtenbank persistiert, sondern in einer Queue abgelegt
- somit sollten keine Performance Engpässe auftreten

#### Pitfalls Performance - Backoffice Applikation

- das diese Applikation nur von einer begrenzten Anzahl von authorisierten Benutzern genutzt wird, sollten sich hieraus keine Performance Engpässe ergeben

### Backend - Technologie [Funktionale Anforderung-4](#functional-requirements-backend-implementation)

- aktuell ist das Backend auf Basis des [fastify](https://fastify.dev) frameworks implementiert
- das framework basiert auf nodeJs und kann mittels typescript implementiert werden
- die API stellt einen Endpunkt via REST bereit und implemeniert einen graphQL Schnittstelle via [mercurius](https://mercurius.dev/#/)
- als Datenbank ist ein mongoDB Atlas Cluster angebunden
- als ORM ist [prisma](https://www.prisma.io) implementiert


### Frontend - Technologie [Funktionale Anforderung-5](#functional-requirements-frontend-implementation)

- das front end ist aktuell als [React Router 7](https://reactrouter.com) aka. Remix umgesetzt
- es ist ein fullstack framework und biete unter anderem SSR, CSR, Data Loading, Routing
- es ist ein idiomatisches Framework und versucht Standard Web API zu benutzen
- als Templage Engine verwendet es "React 19"

## Demo 
- um die Applikation bestehend aus drei Applikationen, sowie einem extern bereitgestelltem Service in einer Docker Container und einer shared-ui-lib sind folgende Schritte notwendig:

  - 1. Datenbank für die api.schoen-klinik bereitstellen
  - 2. ORM aktualiesieren und Datenbank mit Schema befüllen
  - 3. api.schoen-klinik starten
  - 4. ui.public-schoen-klinik starten
  - 5. ui.back-office.schoen-klinik starten

- Schritte 2,3,4 sind in einem Script aggregiert. **WICHTIG**: Die Datenbank muss via Docker bereit gesellt sein! 
  - dazu bitte folgendes im Terminal eingeben
  
  ```
  pnpm start:demo
  ```
  - danach sollten die Applikatinen bereit stellen

  - aktuell werden keine Daten "generiert" (kein Seed)

  - deshalb erst die [Public Page](http://localhost:3002) aufrufen einen Datensatz erfassen und __danach__ das [Back-Office](http://localhost:3001)


### Voraussetzungen

- **INFO**: 
  - das gesamte Setup wurde auf einem Mac bereit gestellt, auf Windows Maschinen könnten einige Komponente fehlen oder Skripte nicht funktionieren da bestimmte Operatoren genutzt wurden (&&, oder rm)
  - die Case Study hat nicht den Anspruch auf Vollständigkeit

- [docker](https://www.docker.com) ist auf dem Rechner verfügbar und docker-compose ist als Erweiterung installiert
- das lokale Datenbankcluster wurde gestartet
  ```
  cd /ops/db
  docker compose up -d //detached mode recommended
  ```

  - details findet man im entsprechenden [Folder](ops/db/README.md)


  
  







