# 🚀 Collab Editor — Real-Time Document Collaboration Platform

A modern **real-time collaborative document editor** built with **Next.js, Convex, and React**, enabling users to create, edit, share, and manage documents seamlessly.


## ✨ Features

* 📝 Create and manage documents
* ⚡ Real-time updates using Convex
* 👥 Collaborator support (viewer/editor roles)
* ⭐ Star / favorite important documents
* 🔔 Notification system for collaboration events
* 🕒 Version history tracking
* 🌐 Public & private document access
* 🎯 Clean and responsive UI


## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React
* **Backend:** Convex (serverless database + functions)
* **State Management:** Convex reactive queries
* **Styling:** Tailwind CSS
* **Authentication:** Clerk (if used)


## 📁 Project Structure

```
app/            # Next.js routes
components/     # Reusable UI components
convex/         # Backend (queries, mutations, schema)
lib/            # Utility functions
public/         # Static assets
```


## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/collab-editor.git
cd collab-editor
```


### 2️⃣ Install dependencies

```
npm install
```


### 3️⃣ Setup environment variables

Create a `.env.local` file:

```
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=


# Get these from clerk.com → Create app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=


NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=

GROQ_API_KEY=

```


### 4️⃣ Run Convex backend

```
npx convex dev
```


### 5️⃣ Run frontend

```
npm run dev
```


### 6️⃣ Open in browser

```
http://localhost:3000
```


## 🔄 Core Functionalities

### 📄 Document Management

* Create, update, delete documents
* Auto-save content in real-time

### 👥 Collaboration

* Add users as collaborators
* Assign roles: `viewer` / `editor`

### ⭐ Starred Documents

* Mark important documents
* Quick access filtering

### 🔔 Notifications

* Get notified when:

  * Added as collaborator
  * Document updates

### 🕒 Version Control

* Save document versions
* View last changes
  
