# Living Dex Tracker by Kkiriya

This is a simple living dex tracker, log-in to save your progress and more.

Uses https://pokeapi.co/api/v2/ for Pokemon data.

I plan to eventually support all generation but for now I'm focusing on getting FireRed & LeafGreen to work flawlessly first.
Only in english for now, maybe will add other languages later down the line

## Database schema
Keeping it simple for now the goal is to just track the Pokemon not all of their stats, types, weaknesses and whatnot.

```mermaid
erDiagram
    USER {
        int user_id PK
        string clerk_id
        string username
        string email
    }

    %% Contains all information for pokemon tracked by a user
    USER_TRACKED_POKEMON {
        int user_id PK, FK
        int poke_id PK, FK
        int game_id PK, FK
        boolean seen
        boolean caught
        boolean shiny
    }

    POKEMON {
        int poke_id PK
        string name
        string sprite_img_link
        
    }

    TYPE { 
        int type_id PK
        string name
    }

    POKEMON_TYPE {
        int poke_id PK, FK
        int type_id PK, FK
        int slot     
    }

    %% Represents each game
    %% One game entry per supported games
    GAME {
        int game_id PK
        string name
    }

    %% The dex order for a pokemon in a given Game
    %% Every game will have the same amount of these as there is dex entries
    POKE_GAME_ORDER {
        int poke_id PK, FK
        int game_id PK, FK
        %% enforce UNQIQUE(game_id, game_order)
        int game_order
    }

    POKEMON ||--o{ POKEMON_TYPE : has
    TYPE ||--o{ POKEMON_TYPE : appears_in

    GAME ||--o{ POKE_GAME_ORDER : appears_in
    POKEMON ||--o{ POKE_GAME_ORDER : has

    USER ||--o{ USER_TRACKED_POKEMON : tracks
    POKE_GAME_ORDER ||--o{ USER_TRACKED_POKEMON : tracked_as

    
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
