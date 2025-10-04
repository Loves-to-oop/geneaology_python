# Family Genealogy - Next.js

A modern, professional genealogy website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **GEDCOM file support** - Import your family tree from Ancestry, FamilySearch, etc.
- Modern, responsive design with Tailwind CSS
- Fast page navigation
- Family member profiles with relationships (parents, spouses, children)
- Full birth/death dates displayed
- Free deployment on Vercel

## Setup & Run

```bash
cd nextjs-genealogy
./setup_and_run.sh
```

Or manually:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Add Your Family Data

### Option 1: Use a GEDCOM file (Recommended)

1. Export your family tree as a GEDCOM file (.ged) from:
   - Ancestry.com
   - FamilySearch
   - MyHeritage
   - Any other genealogy software
2. Replace `data/family.ged` with your GEDCOM file
3. Restart the server

### Option 2: Edit manually

Edit the sample data in `lib/gedcomParser.ts` (fallback data)

## Deployment (FREE)

1. Push to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (takes ~2 minutes)

Your site will be live with a free `.vercel.app` domain!
