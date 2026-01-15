# Optimist - Premium Washing Machines

A high-end 3D e-commerce platform for premium washing machines, built with Next.js, React Three Fiber, GSAP, and Lenis.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

First, install dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── canvas/            # React Three Fiber components
│   ├── layout/            # Navigation, Footer, SmoothScroll
│   └── ui/                # Standard HTML/Tailwind components
├── hooks/                 # Custom animation and 3D hooks
└── lib/                   # GSAP and Three.js utilities
```

## Available Scripts

```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP](https://gsap.com/docs)
- [Lenis](https://github.com/darkroomengineering/lenis)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
