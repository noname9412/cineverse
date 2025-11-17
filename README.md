# Cineverse Edge: A Jellyfin-Powered Streaming Experience

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/moaj257/jellyfin-prime-video)

Cineverse Edge is a visually stunning, minimalist web application designed to replicate the premium experience of streaming services like Amazon Prime Video, but powered by a user's own Jellyfin server. It's built as a 'lean-back' experience, optimized for large screens and keyboard/remote navigation, making it perfect for use on a TV browser or a computer connected to a TV. The application will feature a dark-themed, poster-driven interface with smooth transitions and clear focus states. Users will connect to their Jellyfin instance to browse their movie and TV show libraries, view detailed metadata, and stream content directly in the browser.

## Key Features

-   **Jellyfin Integration**: Connects directly to your personal Jellyfin media server.
-   **TV-Optimized UI**: A "lean-back" interface designed for large screens and remote/keyboard navigation.
-   **Elegant Dark Theme**: A minimalist, poster-driven design that puts your media front and center.
-   **Seamless Navigation**: Intuitive keyboard controls for browsing carousels and media details.
-   **Rich Metadata**: View detailed information for movies and TV shows, including synopses, ratings, and genres.
-   **Integrated Player**: Stream content directly in the browser with a clean, full-screen video player.
-   **Privacy-Focused**: Uses a Cloudflare Worker as a proxy to keep your Jellyfin server details secure.

## Technology Stack

-   **Frontend**: React, React Router, Vite
-   **UI**: Tailwind CSS, shadcn/ui, Framer Motion
-   **State Management**: Zustand
-   **Backend**: Cloudflare Workers, Hono
-   **Video Playback**: React Player
-   **Language**: TypeScript

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/cineverse_edge.git
    cd cineverse_edge
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Run the development server:**
    The application will be available at `http://localhost:3000`.
    ```sh
    bun run dev
    ```

## Usage

Once the application is running, you can interact with it as follows:

1.  **Configuration**: On the first launch, you will be directed to the **Settings** page. Here, you will eventually enter your Jellyfin server URL and API Key. (Note: In Phase 1, the application uses mock data, so this step is for UI demonstration only).
2.  **Browsing**: Navigate to the **Home** page to see carousels of your media. Use your keyboard's arrow keys (`Left`/`Right`) to move between items in a carousel and (`Up`/`Down`) to move between carousels.
3.  **View Details**: Press `Enter` on a focused media poster to navigate to its **Media Details** page.
4.  **Playback**: On the details page, navigate to the "Play" button or an episode and press `Enter` to launch the full-screen **Player**.
5.  **Go Back**: Use the `Escape` key to navigate back from the Player to the Details page, and from Details back to Home.

## Development

This project is structured as a monorepo with the frontend React application in `/src` and the Cloudflare Worker backend in `/worker`.

-   **`src/`**: Contains the React frontend application, including pages, components, hooks, and styles.
-   **`worker/`**: Contains the Hono-based Cloudflare Worker code that acts as a proxy to the Jellyfin API.
-   **`shared/`**: Contains types and data structures shared between the frontend and the worker.

### Linting

To check for code quality and style issues, run the linter:
```sh
bun run lint
```

## Deployment

This application is designed for easy deployment to Cloudflare Pages.

1.  **Build the application:**
    This command bundles the frontend and the worker for production.
    ```sh

    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you have the `wrangler` CLI installed and configured. Then, run the deploy command.
    ```sh
    bun run deploy
    ```

Alternatively, you can connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/moaj257/jellyfin-prime-video)

## Project Roadmap

-   **Phase 1: Visual Foundation & Core UI Shell**
    -   Build all UI views (Settings, Home, Details, Player) with static mock data.
    -   Perfect the TV-optimized keyboard navigation and visual polish.

-   **Phase 2: Jellyfin API Integration & State Management**
    -   Implement the Cloudflare Worker proxy.
    -   Replace all mock data with live data from a user's Jellyfin server.
    -   Implement loading, error, and empty states.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.