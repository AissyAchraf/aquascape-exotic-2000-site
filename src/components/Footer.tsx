import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-secondary border-t border-border mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-lg font-extrabold mb-1 text-primary">AQUASCAPE</h3>
          <p className="text-xs text-muted-foreground italic mb-4">by Exotic2000</p>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Premium aquascaping supplies for stunning underwater landscapes. Quality products for every aquarist.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground font-body uppercase tracking-wider">Shop</h4>
          <div className="flex flex-col gap-2">
            <Link to="/category/aquariums" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">Aquariums</Link>
            <Link to="/category/hardscape" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">Hardscape</Link>
            <Link to="/category/plants" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">Plants</Link>
            <Link to="/category/equipment" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">Equipment</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground font-body uppercase tracking-wider">Help</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground font-body">Contact Us</span>
            <span className="text-sm text-muted-foreground font-body">Shipping & Returns</span>
            <span className="text-sm text-muted-foreground font-body">Size Guide</span>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-body">© 2025 AQUASCAPE. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
