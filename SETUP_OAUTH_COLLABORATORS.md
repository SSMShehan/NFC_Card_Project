# 🚨 How to Fix Google Authentication Error (`Error 401: invalid_client`) After `git pull`

If you pulled this repository from GitHub and are seeing **`Access blocked: Authorization Error - Error 401: invalid_client (The OAuth client was not found)`** when trying to log in with Google, **don't worry! There is no bug in the code.**

## 💡 Why did this happen?
Environment variable files (`.env`, `.env.local`) contain sensitive API keys and secrets. Because of security best practices, **they are never uploaded to GitHub (`.gitignore`)**. 
When you cloned or pulled (`git pull`) the project to your computer, you received the code, but your local computer **did not get the `.env.local` file containing the Google Client ID**. Without it, Next.js falls back to a demo placeholder, causing Google's server to reject the login request (`Error 401: invalid_client`).

---

## 🛠️ EXACT 3-STEP FIX FOR COLLABORATORS

### Step 1: Create `.env.local` in `packages/web/`
Open your terminal or IDE, navigate to the `packages/web/` directory, and create a new file named **`.env.local`**:

```bash
cd packages/web
cp .env.example .env.local
```

Inside `packages/web/.env.local`, make sure you have the exact Google Client ID configured:
```ini
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Google OAuth Client ID ──
NEXT_PUBLIC_GOOGLE_CLIENT_ID=543254844488-38h35hddtfnmajai6mnr8hatu3cnniva.apps.googleusercontent.com
```

---

### Step 2: Create `.env` in `packages/backend/`
Navigate to the `packages/backend/` directory, and create a new file named **`.env`**:

```bash
cd ../backend
cp .env.example .env
```

Inside `packages/backend/.env`, make sure the backend also has the Google Client ID and JWT parameters set:
```ini
NODE_ENV=development
PORT=4000
DATABASE_URL="your-postgresql-database-url-here"

JWT_SECRET="tagit-super-secret-jwt-key-2026"
GOOGLE_CLIENT_ID=543254844488-38h35hddtfnmajai6mnr8hatu3cnniva.apps.googleusercontent.com
```

---

### Step 3: Add Collaborator's Local URL to Google Cloud Console (If using a custom port/IP)
If the collaborator is accessing the app via `http://localhost:3000` or `http://127.0.0.1:3000`, verify that these URLs are listed under your **Google Cloud Console OAuth App**:
1. Go to [Google Cloud Console -> APIs & Services -> Credentials](https://console.cloud.google.com/apis/credentials).
2. Click on your OAuth 2.0 Client ID (`TAGIT Web App` / `54325484...`).
3. Under **Authorized JavaScript origins**, make sure **BOTH** of the following are added:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
4. Under **Authorized redirect URIs**, ensure `http://localhost:3000` and `http://127.0.0.1:3000` are also listed if required.
5. Click **Save** (Note: Google sometimes takes 2-5 minutes to propagate changes).

---

### 🔄 Finally: Restart the Dev Servers!
After creating `.env.local` and `.env`, **you MUST restart your Next.js and Backend servers** for the new environment variables to load into memory:

```bash
# Terminal 1 (Backend)
cd packages/backend
npm run dev

# Terminal 2 (Web Frontend)
cd packages/web
npm run dev
```

Now refresh your browser (`http://localhost:3000/login`) and click **"Continue with Google"** — it will work seamlessly! 🎉
