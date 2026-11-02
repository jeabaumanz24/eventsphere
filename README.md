# EventSphere — AI-Powered Multicultural Event Planning & Vendor Discovery

EventSphere is an AI-powered multicultural event planning and vendor discovery platform based in Adelaide, South Australia. The platform combines intelligent vendor matching, smart event budgeting calculators, timeline generation, cultural event checklists, and a curated vendor marketplace within one unified ecosystem.

---

## 🌟 Key Features

- **Top Bar Contract**: Sticky, responsive navigation with brand lockup, smooth anchor jumping, and mobile drawer.
- **Hero Showcase**: Luxury Adelaide vineyard & botanical wedding imagery with animated floating badges and quick search.
- **Audited Metrics**: 500+ verified Adelaide vendors, 2,000+ events planned, 50+ cultural celebration categories, 95% satisfaction.
- **Why EventSphere (About)**: Narrative problem/solution spotlight with high-res 3D ecosystem architecture visual.
- **Service Pillars**: AI Vendor Matching, Budget Planning Tools, Event Resources, and Analytics Insights.
- **Interactive 3-Step Process**: Event setup, AI-driven recommendations, and direct vendor introduction.
- **Live Vendor Marketplace**: Interactive filtering by category (Photography, Planning, Catering, Floral Design, Makeup, Cultural Specialists), search bar, live price tiers, and detailed inquiry modal.
- **Interactive AI Event Planner Studio**: Live budget calculator with interactive category sliders, custom multicultural timeline generator, cost forecasting, and instant AI planning insights.
- **Customer & Vendor Persona Cards**: Diwata dela Cruz (Customer) & Maria Santos (Vendor).
- **Client & Vendor Testimonials**: Authentic experiences highlighting time savings, quality, and cultural inclusivity.
- **Curated Editorial / Blog**: Multicultural guides, Adelaide vendor guides, and budgeting advice with full reader preview modal.
- **Contact & Adelaide Region Map**: Fully validated inquiry form with instant submission confirmation and interactive Adelaide event district explorer (CBD, Adelaide Hills, Barossa, McLaren Vale, Glenelg).

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/jeabaumanz24/eventsphere.git
cd eventsphere

# Install dependencies (use --legacy-peer-deps if needed)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Building & GitHub Pages Deployment

### 1. Manual Build
```bash
npm run build
```
The output will be in the `dist/` directory configured with the base path `/eventsphere/` (or customized via `VITE_BASE_PATH`).

### 2. Automated GitHub Pages Deployment
A pre-configured GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

To deploy:
1. Push your code to the `main` branch of your GitHub repository `jeabaumanz24/eventsphere`.
2. On GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The workflow will automatically install dependencies, build the Vite app with `VITE_BASE_PATH=/eventsphere/`, and deploy the production bundle to:
   **https://jeabaumanz24.github.io/eventsphere/**

---

## 🎨 Brand Design Tokens

- **Primary Background**: `#F2CCC3`
- **Primary Text**: `#724319`
- **Accent Soft Cream**: `#FFF8F6`
- **Accent Soft Blush**: `#EBC1B6`
- **Accent Rich Terracotta**: `#8A5A44`
- **Clean White**: `#FFFFFF`
- **Display Typography**: *Playfair Display*
- **Body Typography**: *Poppins / Inter*
