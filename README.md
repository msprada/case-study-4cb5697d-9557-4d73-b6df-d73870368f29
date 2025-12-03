# case-study-4cb5697d-9557-4d73-b6df-d73870368f29

- [1. Aufgabenstellung](#1-aufgabenstellung)
  - [1.1 Funktionale Anforderungen](#11-funktionale-anforderungen)
  - [1.2 Erwartungen](#12-erwartungen)
- [2. Umsetzung](#2-umsetzung)
  - [2.1 Anamnesebogen Flow (AF)](#21-anamnesebogen-flow-af)
    - [2.1.1 AF - Temporärers Login (TL)](#211-af---temporärers-login-tl)
      - [AF-TL-Prozess](#af-tl-prozess)
    - [2.1.2 Anamnesebogen (AB)](#212-anamnesebogen-ab)
      - [AB - Prozess](#ab---prozess)
    - [2.1.3 Persistierung der Anamnese Daten](#213-persistierung-der-anamnese-daten)
  - [2.2 Back Office](#22-backoffice)
- [3. Konzept](#3-konzept)
  - [3.1 Design der Entitäten](#31-design-der-entitäten--funktionale-anforderung-1)
    - [3.1.1 Tempöres Login](#311-temporäres-login-link-zur-story)
  - [3.2  Konzept Authentifizierung, Authorisierung sowie Security](#32-konzept-authentifizierung-authorisierung-sowie-security--funktionale-anforderung-2)
    - [3.2.1 Öffentlicher Ananmnesebogen Flow](#321-öffentlicher-ananmnesebogen-flow)
    - [3.2.2 Authorisierung mit der DB bzw. Queue](#322-authorisierung-mit-der-db-bzw-queue)
    - [3.2.3 Back Office](#323-back-office)
  - [3.3 Gedanken zu Security](#33-gedanken-zu-security)
    - [3.3.1 Frontend](#331-frontend)
    - [3.3.2 Backend](#332-backend)
  - [3.4 Konzept Performance Pitfalls](#34-konzept-performance-pitfalls--funktionale-anforderung-3)
    - [3.4.1  Pitfalls Performance - Öffentliche Applikation](#341-pitfalls-performance---öffentliche-applikation)
    - [3.4.2  Pitfalls Performance - Backoffice Applikation](#342-pitfalls-performance---backoffice-applikation)
  - [3.5 Backend - Technologie](#35-backend---technologie-funktionale-anforderung-4)
  - [3.6  Front - Technologie](#36-frontend---technologie-funktionale-anforderung-5)
  - [3.7  Infrastruktur && Deployment Setup](#37-infrastruktur--deployment-setup-funktionale-anforderung)
    - [3.7.1 Multiple Stages](#371-multiple-stages)
    - [3.7.2 Deployment](#372-deployment)
    - [3.7.3 Hosting](#373-hosting)
      - [3.7.3.1  VPC und docker compose stack](#3731-option-1---vps-docker-comppose)
      - [3.7.3.2 Kubernetes Cluster](#3732-option-2---kubernetes-cluster)
      - [3.7.3.3 Gemischte Option](#3733-option-3---gemischtes-setup)
- [4. Demo](#4-demo)
  - [4.1 Voraussetzungen](#41-voraussetzungen)
  - [4.2 Starten der Demo](#42-starten-der-demo)
  - [4.3 Testen der UI](#43-testen-der-ui)


## 1. Aufgabenstellung

Aufgabe ist es eine zweiteilige Applikation zu bauen, bestehend aus einem Anamnesebogen der öffentlich für einen Patienten aufrufbar ist und Daten erfasst, welche für den Zweck der Demonstration minimalistisch gehalten werden können. Im Backoffice können authentifizierte Mitarbeitende den Bogen bearbeiten und über ein Statusmodell verwalten.

### 1.1 Funktionale Anforderungen

#### 1.1.1 Muss

<ul>
  <li id="functional-requirements-entities">1. Design der Applikation und Entitäten sollte einem nachvollziehbaren Konzept folgen (DONE)</li> 
  <li id="functional-requirements-security">2.Konzepte für Authentifizierung/Autorisierung und Security für Backoffice Applikation und öffentlichem Anamnesebogen (DONE)</li> 
  <li id="functional-requirements-performance-pitfalls">3.Performance Pitfalls sind entweder markiert als TODO oder entsprechend vermieden (DONE)</li> 
  <li id="functional-requirements-backend-implementation">4.Backend ist implementiert mit NodeJS, TypeScript, MongoDB und einem GraphQL Interface (DONE)</li> 
  <li id="functional-requirements-frontend-implementation">5.Frontend ist implementiert mit React oder Angular (DONE)</li>
</ul>


#### 1.1.2 Optional

- Unit Tests oder Browser/Frontend Tests (OPEN)
- Security Hardening (Web Headers, Audit, Error Abstraction, etc…) (PARTIALLY OPEN)
- Verwendung eines Backend Frameworks wie NestJS (DONE) [siehe Kapitel Backend Technologie](#backend---technologie-funktionale-anforderung-4)
- Verwendung eines Frontend Framework wie NextJS (DONE) [siehe Kapitel Frontend Technologie](#frontend---technologie-funktionale-anforderung-5)
- Monorepo Setup (DONE) [pnpm](https://pnpm.io/workspaces)
<ul>
  <li id="functional-requirements-infra-deployment">Infrastruktur-/Deployment Setup</li>(DONE)
<ul>


### 1.2 Erwartungen

Es ist nicht notwendig die Applikation an allen Stellen zu 100% auszuprogrammieren. Der Fokus liegt auf einem nachhaltigen Anwendungsdesign kombiniert mit der Anwendung gängiger Programmierkonzepte.

## 2. Umsetzung

### 2.1 Anamnesebogen Flow (AF)

- an dem Flow sind vier Systeme beteiligt
  - eine Webanwendung die servers seitig gehostet
  - eine REST API
    - der Client darf nur einen Endpunkt aufrufen der via "scope" geschützt ist
    - hierzu wird oAuth (Machine-to-Machine)
  - ein Service der auf eine Warteschlange lauscht
  - eine Warteschlange (RabbitMQ)

#### 2.1.1 AF - Temporärers Login (TL)

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

#### 2.1.2 Anamnesebogen (AB)

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

### 2.1.3 Persistierung der Anamnese Daten

- via listener auf der queue werden die Nachrichten entpackt und die resultierenden Daten in der MongoDB persisitert
  - Struktur: tbd

### 2.2 Backoffice

- an dem Flow sind zwei Systeme beteiligt
  - zum einen ui.back-office.schoen-klinik (Web Applikation) **und**
  - zum anderen api.schoen-klinik (Web API graphql Interface)

- authentifizierte Benutzer können sich mit gültigem Benutzername und Passwort am System anmelden (OPEN)
- danch gelangen Sie aud die "Homepage"
- dort können Sie via Link die Übersicht der eingegangenen Anamnesebögen aufrufen
- von dort aus gelangen Sie auf das einzelne Formular
- dieses können Sie dann editieren und u.a. den Status setzen **und**
- die Änderung speichern (WIP)

## 3. Konzept

### 3.1 Design der Entitäten -[Funktionale Anforderung-1](#functional-requirements-entities)

#### 3.1.1 Temporäres Login [link zur Story](#temporäres-login-hier)

##### TempLink (SQL Lite)

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

### 3.2 Konzept Authentifizierung, Authorisierung sowie Security -[Funktionale Anforderung-2](#functional-requirements-security)

- genutzt wird ein sog. Secure Token Service - IAM Identity Access Management [Keycloak](https://www.keycloak.org)

#### 3.2.1 Öffentlicher Ananmnesebogen Flow

- da jeder Benutzer diesen aufrufen kann scheint es wichtig die Authentifizierung durch zu führen
- das kann jedoch **nicht**  mit Benutzernamen und zug. Passwort geschen
- um die Identität des Benutzers zu überprüfen muss dieser eine E-Mailadresse bereitstellen auf die er Zugriff hat
- an diese E-Mailadresse wird ein ein eindeutiger Link verschickt (email+guid)
  - dieser Schlüssel wird in einer Datenbank persisiert
  - ein Zeitstempel wird ebenfalls gespeichert
  - der link sollte dann nur für eine gewisse Zeit gültig sein
  - OPTIONAL: zusätzlich zu diesem Link könnte man ein one-time-password in einer separaten E-Mail verwenden
- sobald der Benutzer den Link aus der E-Mail bestätigt, kann er das Anamneseformulat aufrufen

#### 3.2.2 Authorisierung mit der DB bzw. Queue

- der Service der den Öffentlichen Anamnese Bogen bereitstellt hat nur eingeschränkten Zugriff
- der Webclient wird mittels oAuth (Machine-to-Machine Kommunikation (ClientId and Secret)) authentifiziert und via eines scopes auf den Endpunkt "Anamnesis Post" zugelassen
- in der Ausbaustufe greift die API nicht direkt auf die DB zu, sondern kann lediglich Nachrichten in eine Queue schreiben
- ein weiterer Dienst kann dann die Nachricht validieren und die Daten in der DB persistieren

#### 3.2.3 Back Office

- das Backoffice wird durch eine weitere Webapplikation bereit gestellt
- das gibt die Möglichkeit es als Intranet zu konfigurieren und nur in eigenem Netzwerk zu erreichen via VPN (falls notwendig)
- in diesem wird der sg. [Auth Code Flow PKE] (https://oauth.net/2/pkce/) implementiert 
- der Benutzer wird mittels OpenIDConnect authentifiziert und via oAuth authorisiert
- seine Authorisierung wird auf die Webappliaktion delegiert und dann via scopes konfiguriert

### 3.3 Gedanken zu Security

#### 3.3.1 Frontend

- im Frontend werden Mechanismen integriert die Angriffe von außen erschweren und folgende Angriffe vermeiden sollen:
  - Cross Site JavaScript Attacken (XSS)
  - CSP Level 2 und Cross Site Request Forgery Attacken (CSRF)   
  - SQL Injections

#### 3.3.2 Backend

- im Backend werden Mechanismen integriert die Angriffe von außen erschweren
- alle Anfragen sollten auf gültige Werte geprüft werden
- Sonderzeichen sollten nicht zu gelassen werden
- keine direkten Zugriffe auf die Datenbanken mit PLAIN SQL STATEMENTS, sonder store procedures nutzen

### 3.4 Konzept Performance Pitfalls -[Funktionale Anforderung-3](#functional-requirements-performance-pitfalls)


#### 3.4.1 Pitfalls Performance - Öffentliche Applikation

- da der Anamnesebogen öffentlich verfügbar ist können rein theoretisch alle aktuellen Patienten der Schönklinikgruppe zugreigen, als auch potentielle neue Patienten, sowie Personen mit bösen Absichten
- die Anzahl der Benutzer könnte sehr hoch sein
- die Webapplikation kann horizontal skaliert werden und sollte somit der Last stand halten
- der lesende Zugriff auf die Datenbank sollte ebenfalls kein Problem sein und kann bei Bedarf im CQRS Pattern skaliert und im Cluster berebereit gestellt werden (Lesender Zugriff)
- die API die übermittelten Daten entgegen nimmt, kann ebenfalls skaliert werden
- im Zielstatus werden die Daten nicht direkt in der DAtenbank persistiert, sondern in einer Queue abgelegt
- somit sollten keine Performance Engpässe auftreten

#### 3.4.2 Pitfalls Performance - Backoffice Applikation

- das diese Applikation nur von einer begrenzten Anzahl von authorisierten Benutzern genutzt wird, sollten sich hieraus keine Performance Engpässe ergeben

### 3.5 Backend - Technologie [Funktionale Anforderung-4](#functional-requirements-backend-implementation)

- aktuell ist das Backend auf Basis des [fastify](https://fastify.dev) frameworks implementiert
- das framework basiert auf nodeJs und kann mittels typescript implementiert werden
- die API stellt einen Endpunkt via REST bereit und implemeniert einen graphQL Schnittstelle via [mercurius](https://mercurius.dev/#/)
- als Datenbank ist ein mongoDB Atlas Cluster angebunden
- als ORM ist [prisma](https://www.prisma.io) implementiert


### 3.6 Frontend - Technologie [Funktionale Anforderung-5](#functional-requirements-frontend-implementation)

- das front end ist aktuell als [React Router 7](https://reactrouter.com) aka. Remix umgesetzt
- es ist ein fullstack framework und biete unter anderem SSR, CSR, Data Loading, Routing
- es ist ein idiomatisches Framework und versucht Standard Web API zu benutzen
- als Templage Engine verwendet es "React 19"

### 3.7 Infrastruktur && Deployment Setup [Funktionale Anforderung](#functional-requirements-infra-deployment)

#### 3.7.1 Multiple Stages

- generall sollte man ein dreistufiges Konzept implementieren mit drei environments
  - dev environment (lokal)
  - stage.environment ("öffentlich") erreichbar
  - production.environment ("öffentlich)

#### 3.7.2 Deployment

- alle drei Anwendungen können in einem docker container bereit gestellt werden
  - dieser stellt dann einen nginx Server bereit
- je nach SMC (gitLab, gitHub, self-hosted) wird eine CI-CD Pipeline erstellt
- die Container könnte man dann in einer docker registry bereit stellen (Cloud oder self-hosted)

#### 3.7.3 Hosting

- das hosting kann in drei unterschiedlichen Optionen angedacht werden:

##### 3.7.3.1 Option 1 - VPS Docker Comppose
- das hosting kann dann simple über eine (VPS)(Virtuelle Linux Maschine) (Cloud (Bsp. Hetzner)) erfolgen
  - hier könnte man im einfachsten Falle ein docker compose stack aufbauen
  - der nginx Server könnten die Services via [pm2](https://pm2.io) skalieren

##### 3.7.3.2 Option 2 - Kubernetes Cluster
- das hosting der docker container kann ebenfalls über ein [Kubernetes Cluster](https://kubernetes.io/) "orchestriert" werden
- es wird dann ein "POD" mit entsprechendem "Gateway" eingerichte, damit der Container nach außen hin erreichbar ist
- um das Deployment zu automatisieren und zu vereinfachen kann [Pulumi](https://www.pulumi.com) eingesetzt werden um ein yaml file zu kreieren
- dieser wird dann via [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) automatisiert auf das Cluster deployed
- **INFO**: hierzu existiert bereits ein privates Repository in dem ich einen PoC erstellt habe

##### 3.7.3.3 Option 3 - Gemischtes Setup
- da aktuell drei Applikationen beteiligt sind könen diese unterschiedlich "gehosted" werden
- je nach Usecase und Art der Skalierbarkeit, Ausfalsicherheit
- lediglich die Verfügbarkeit der Datenbanken muss gesichert sein

## 4. Demo 

- **INFO**: 
  - das gesamte Setup wurde auf einem Mac bereit gestellt, auf Windows Maschinen könnten einige Komponente fehlen oder Skripte nicht funktionieren da bestimmte Operatoren genutzt wurden (&&, oder rm)
  - die Case Study hat nicht den Anspruch auf Vollständigkeit

### 4.1 Voraussetzungen

- [docker](https://www.docker.com) ist auf dem Rechner verfügbar und docker-compose ist als Erweiterung installiert
- das lokale Datenbankcluster wurde gestartet
  ```
  cd /ops/db
  docker compose up -d //detached mode recommended
  ```

  - details findet man im entsprechenden [Folder](ops/db/README.md)

### 4.2 Starten der Demo  

- um die Applikation bestehend aus drei Applikationen, sowie einem extern bereitgestelltem Service in einer Docker Container und einer shared-ui-lib sind folgende Schritte notwendig:

  - 1. Datenbank für die api.schoen-klinik bereitstellen
  - 2. ORM aktualiesieren und Datenbank mit Schema befüllen
  - 3. api.schoen-klinik starten
  - 4. ui.public-schoen-klinik starten
  - 5. ui.back-office.schoen-klinik starten

 **WICHTIG**: Die Datenbank muss via Docker bereit gesellt sein! [siehe Voraussetzungen](#voraussetzungen)  

- Schritte 2,3,4 sind in einem Script aggregiert. 
  - um die Schritte auszuführen, bitte folgendes im Terminal eingeben
  
  ```
  pnpm start:demo
  ```
  - danach sollten die Applikatinen bereit stellen

### 4.3 Testen der UI

  - aktuell werden keine Daten "generiert" (kein Seed)

  - deshalb erst die [Public Page](http://localhost:3002) aufrufen einen Datensatz erfassen und __danach__ das [Back-Office](http://localhost:3001)





  
  







