import Link from 'next/link';

// 内联 SVG 图标
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"></path>
    <polyline points="16 17 12 13 8 17"></polyline>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 18c-4.5 0-6-3-6-6V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v5c0 3-1.5 6-6 6z"></path>
    <path d="M17 8a5 5 0 0 0-10 0"></path>
    <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
  </svg>
);

const BarChart3Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Next-Gen Web3 Commerce
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block">Autonomous</span>
                <span className="block mt-2">
                  <span className="gradient-text">Data Sovereignty</span> for
                </span>
                <span className="block mt-2">E-Commerce
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Experience the future of shopping with AI-powered recommendations and 0G storage verification. Your data, your control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/concierge" className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all text-center">
                  Try AI Concierge
                </Link>
                <Link href="#" className="px-6 py-3 border border-border rounded-md hover:border-primary transition-all text-center">
                  Explore Features
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass p-8 rounded-xl">
                <BrainIcon  />
                <h2 className="text-2xl font-semibold mb-2">AI-Powered Shopping</h2>
                <p className="text-muted-foreground">
                  Our AI assistant helps you find the best products with real-time price comparisons and 0G storage verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass p-6 rounded-xl hover:neon-glow transition-all">
              <BrainIcon />
              <h3 className="text-xl font-semibold mb-2">AI Concierge</h3>
              <p className="text-muted-foreground">
                Intelligent shopping assistant with real-time recommendations and price comparisons.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass p-6 rounded-xl hover:neon-glow transition-all">
              <BarChart3Icon  />
              <h3 className="text-xl font-semibold mb-2">Omni-Monitor</h3>
              <p className="text-muted-foreground">
                Cross-platform asset monitoring with price alerts and 0G storage snapshots.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass p-6 rounded-xl hover:neon-glow transition-all">
              <LockIcon  />
              <h3 className="text-xl font-semibold mb-2">Data Sovereignty</h3>
              <p className="text-muted-foreground">
                Complete control over your shopping data with encryption and selective monetization.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="glass p-6 rounded-xl hover:neon-glow transition-all">
              <DollarSignIcon  />
              <h3 className="text-xl font-semibold mb-2">Autonomous Settlement</h3>
              <p className="text-muted-foreground">
                Automated transactions and rewards distribution with blockchain integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of shoppers who are taking control of their data and getting the best deals.
          </p>
          <Link href="/concierge" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all">
            Start Shopping with AI
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <ShoppingBagIcon  />
              <h2 className="text-xl font-bold">0G-ShopMate</h2>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/concierge" className="hover:text-primary transition-colors">AI Concierge</Link>
              <Link href="/omni-monitor" className="hover:text-primary transition-colors">Omni-Monitor</Link>
              <Link href="/data-vault" className="hover:text-primary transition-colors">Data Sovereignty</Link>
              <Link href="/settlement" className="hover:text-primary transition-colors">Settlement</Link>
              <Link href="#" className="hover:text-primary transition-colors">About</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© 2026 0G-ShopMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
