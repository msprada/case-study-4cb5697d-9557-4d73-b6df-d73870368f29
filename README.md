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

## Aufgabenstellung

Aufgabe ist es eine zweiteilige Applikation zu bauen, bestehend aus einem Anamnesebogen der öffentlich für einen Patienten aufrufbar ist und Daten erfasst, welche für den Zweck der Demonstration minimalistisch gehalten werden können. Im Backoffice können authentifizierte Mitarbeitende den Bogen bearbeiten und über ein Statusmodell verwalten.

### Funktionale Anforderungen

#### Muss

<ul>
  <li id="functional-requirements-entities">1. Design der Applikation und Entitäten sollte einem nachvollziehbaren Konzept folgen</li>
</ul>
- Design der Applikation und Entitäten sollte einem nachvollziehbaren Konzept folgen
- Konzepte für Authentifizierung/Autorisierung und Security für Backoffice Applikation und öffentlichem Anamnesebogen
- Performance Pitfalls sind entweder markiert als TODO oder entsprechend vermieden
- Backend ist implementiert mit NodeJS, TypeScript, MongoDB und einem GraphQL Interface
- Frontend ist implementiert mit React oder Angular

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
| furtherMedicalDisorder      | String  |        ||
| since      | DateTime  |        ||
| notes      | String  |        ||
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
| birthdate      | DateTime  |        ||
| address      | String  |        ||
| phone      | String  |        ||
| mobile      | String  |        ||
| gender      | string  |        ||
| email      | String (unique)  |        |Identifer of Public User|
| createdAt      | DateTime  | UNIX TIMESTAMP       | Date.Now() |
| updatedAt      | DateTime  | UNIX TIMESTAMP       |Last Change|
| ...      | ...  |     ...   |...|