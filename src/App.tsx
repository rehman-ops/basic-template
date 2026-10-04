import React, { useState } from 'react';
import {
  UtensilsCrossed,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Instagram,
  Facebook,
  Share2,
  Calendar,
  Users,
  Check,
  X,
  Menu as MenuIcon,
  Star,
  Camera,
  ArrowRight,
  Info
} from 'lucide-react';

interface DishItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
}

interface ReviewItem {
  id: string;
  quote: string;
  author: string;
  rating: number;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Reservation form state
  const [reserveForm, setReserveForm] = useState({
    name: '',
    phone: '',
    date: '2026-10-15',
    time: '19:00',
    guests: '2',
    notes: ''
  });

  const categories = [
    'ALL',
    '[MENU CATEGORY 1]',
    '[MENU CATEGORY 2]',
    '[MENU CATEGORY 3]',
    '[MENU CATEGORY 4]'
  ];

  const dishes: DishItem[] = [
    {
      id: 'dish-1',
      name: '[DISH 1]',
      category: '[MENU CATEGORY 1]',
      description: '[DISH DESCRIPTION HERE]',
      price: '[PRICE HERE]'
    },
    {
      id: 'dish-2',
      name: '[DISH 2]',
      category: '[MENU CATEGORY 1]',
      description: '[DISH DESCRIPTION HERE]',
      price: '[PRICE HERE]'
    },
    {
      id: 'dish-3',
      name: '[DISH 3]',
      category: '[MENU CATEGORY 2]',
      description: '[DISH DESCRIPTION HERE]',
      price: '[PRICE HERE]'
    },
    {
      id: 'dish-4',
      name: '[DISH 4]',
      category: '[MENU CATEGORY 2]',
      description: '[DISH DESCRIPTION HERE]',
      price: '[PRICE HERE]'
    },
    {
      id: 'dish-5',
      name: '[DISH 5]',
      category: '[MENU CATEGORY 3]',
      description: '[DISH DESCRIPTION HERE]',
      price: '[PRICE HERE]'
    },
    {
      id: 'dish-6',
      name: '[DISH 6]',
      category: '[MENU CATEGORY 4]',
      description: '[DISH DESCRIPTION HERE]',
      price: '[PRICE HERE]'
    }
  ];

  const reviews: ReviewItem[] = [
    {
      id: 'rev-1',
      quote: '[CUSTOMER REVIEW HERE]',
      author: '[CUSTOMER NAME HERE]',
      rating: 5
    },
    {
      id: 'rev-2',
      quote: '[CUSTOMER REVIEW HERE]',
      author: '[CUSTOMER NAME HERE]',
      rating: 5
    },
    {
      id: 'rev-3',
      quote: '[CUSTOMER REVIEW HERE]',
      author: '[CUSTOMER NAME HERE]',
      rating: 5
    }
  ];

  const filteredDishes =
    activeCategory === 'ALL'
      ? dishes
      : dishes.filter((d) => d.category === activeCategory);

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
  };

  const closeReservationModal = () => {
    setIsReserveModalOpen(false);
    setReservationSuccess(false);
  };

  return (
    <div className="restaurant-template">
      {/* Top Template Notification Bar */}
      <div className="template-badge-bar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={14} />
            <strong>RESTAURANT SITE TEMPLATE</strong> — Replace placeholders with your restaurant information
          </span>
          <span className="placeholder-field" style={{ fontSize: '0.72rem' }}>
            TEMPLATE READY
          </span>
        </div>
      </div>

      {/* Site Header */}
      <header className="site-header">
        <div className="container header-container">
          {/* Brand Logo & Name */}
          <a href="#" className="brand-wrap">
            <div className="brand-logo-frame">
              [RESTAURANT LOGO HERE]
            </div>
            <div className="brand-text">
              <span className="brand-name placeholder-field plain">
                [RESTAURANT NAME HERE]
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              About
            </a>
            <a href="#menu" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Menu
            </a>
            <a href="#reviews" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Reviews
            </a>
            <a href="#gallery" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Gallery
            </a>
            <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="header-actions">
            <button
              onClick={() => setIsReserveModalOpen(true)}
              className="btn btn-primary"
            >
              Book a Table
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Hero Content */}
            <div className="hero-content">
              <div className="hero-tagline-box">
                <span className="placeholder-field">
                  [RESTAURANT TAGLINE HERE]
                </span>
              </div>

              <h1 className="hero-title">
                Welcome to{' '}
                <span className="placeholder-field" style={{ fontSize: '0.8em', padding: '0.2rem 0.6rem' }}>
                  [RESTAURANT NAME HERE]
                </span>
              </h1>

              <p className="hero-desc">
                <span className="placeholder-field block-field" style={{ textAlign: 'left', lineHeight: 1.8 }}>
                  [RESTAURANT DESCRIPTION HERE]
                </span>
              </p>

              <div className="hero-actions">
                <a href="#menu" className="btn btn-primary">
                  Explore Menu
                </a>
                <button
                  onClick={() => setIsReserveModalOpen(true)}
                  className="btn btn-outline"
                >
                  Reserve a Table
                </button>
              </div>
            </div>

            {/* Right Hero Image Slot */}
            <div className="hero-image-slot">
              <div className="image-placeholder" style={{ height: '100%' }}>
                <Camera size={44} />
                <span className="ph-label">[RESTAURANT PHOTO HERE]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="quick-info-bar">
        <div className="container">
          <div className="quick-info-grid">
            <div className="quick-info-item">
              <MapPin size={22} />
              <div>
                <div className="quick-info-title">Location</div>
                <div className="quick-info-val">
                  <span className="placeholder-field">
                    [RESTAURANT ADDRESS HERE]
                  </span>
                </div>
              </div>
            </div>

            <div className="quick-info-item">
              <Clock size={22} />
              <div>
                <div className="quick-info-title">Opening Hours</div>
                <div className="quick-info-val">
                  <span className="placeholder-field">
                    [OPENING HOURS HERE]
                  </span>
                </div>
              </div>
            </div>

            <div className="quick-info-item">
              <Phone size={22} />
              <div>
                <div className="quick-info-title">Reservations</div>
                <div className="quick-info-val">
                  <span className="placeholder-field">
                    [PHONE NUMBER HERE]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section section-alt">
        <div className="container">
          <div className="about-grid">
            {/* Left Photo */}
            <div className="about-image-slot">
              <div className="image-placeholder" style={{ height: '100%' }}>
                <Camera size={44} />
                <span className="ph-label">[RESTAURANT PHOTO HERE]</span>
              </div>
            </div>

            {/* Right Content */}
            <div className="about-content">
              <div className="section-tag">Our Story</div>
              <h2 className="section-title">
                <span className="placeholder-field plain">
                  [ABOUT RESTAURANT HERE]
                </span>
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8' }}>
                <span className="placeholder-field block-field" style={{ textAlign: 'left', lineHeight: 1.8 }}>
                  [RESTAURANT DESCRIPTION HERE]
                </span>
              </p>

              <div className="about-features">
                <div className="about-feature-card">
                  <h4>
                    <span className="placeholder-field">
                      [CULINARY PHILOSOPHY HERE]
                    </span>
                  </h4>
                  <p>
                    <span className="placeholder-field" style={{ fontSize: '0.78rem' }}>
                      [PHILOSOPHY DESCRIPTION HERE]
                    </span>
                  </p>
                </div>

                <div className="about-feature-card">
                  <h4>
                    <span className="placeholder-field">
                      [EXECUTIVE CHEF HERE]
                    </span>
                  </h4>
                  <p>
                    <span className="placeholder-field" style={{ fontSize: '0.78rem' }}>
                      [CHEF BIO HERE]
                    </span>
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <a href="#menu" className="btn btn-outline">
                  View Full Menu <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Culinary Selection</div>
            <h2 className="section-title">Our Menu</h2>
            <p className="section-desc">
              <span className="placeholder-field">
                [MENU SUBTITLE HERE]
              </span>
            </p>
          </div>

          {/* Menu Category Filter Tabs */}
          <div className="menu-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`menu-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="menu-grid">
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="dish-card">
                <div className="dish-image-wrapper">
                  <div className="image-placeholder" style={{ height: '100%', borderRadius: 0 }}>
                    <UtensilsCrossed size={32} />
                    <span className="ph-label">[DISH IMAGE HERE]</span>
                  </div>
                </div>

                <div className="dish-content">
                  <div className="dish-header">
                    <h3 className="dish-title">
                      <span className="placeholder-field">
                        {dish.name}
                      </span>
                    </h3>
                    <div className="dish-price">
                      <span className="placeholder-field">
                        {dish.price}
                      </span>
                    </div>
                  </div>

                  <p className="dish-desc">
                    <span className="placeholder-field" style={{ textAlign: 'left', display: 'block' }}>
                      {dish.description}
                    </span>
                  </p>

                  <div className="dish-footer">
                    <span className="dish-category-tag">
                      <span className="placeholder-field" style={{ fontSize: '0.7rem' }}>
                        {dish.category}
                      </span>
                    </span>

                    <button
                      onClick={() => setIsReserveModalOpen(true)}
                      className="btn btn-ghost"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    >
                      Order / Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Testimonials</div>
            <h2 className="section-title">Guest Impressions</h2>
            <p className="section-desc">
              Feedback and reviews from patrons who have dined with us.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div>
                  <div className="review-stars">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="review-body">
                    &ldquo;
                    <span className="placeholder-field" style={{ fontStyle: 'italic' }}>
                      {rev.quote}
                    </span>
                    &rdquo;
                  </blockquote>
                </div>

                <div className="reviewer-info">
                  <div className="reviewer-avatar-placeholder">
                    [USER]
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      <span className="placeholder-field" style={{ fontSize: '0.75rem' }}>
                        {rev.author}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      <span className="placeholder-field" style={{ fontSize: '0.7rem' }}>
                        [VERIFIED DINER]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section id="gallery" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Ambiance & Atmosphere</div>
            <h2 className="section-title">Photo Gallery</h2>
            <p className="section-desc">
              Take a visual tour through our dining room and kitchen creations.
            </p>
          </div>

          <div className="gallery-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="gallery-slot">
                <div className="image-placeholder" style={{ height: '100%' }}>
                  <Camera size={36} />
                  <span className="ph-label">[RESTAURANT PHOTO HERE]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Reservation Section */}
      <section id="contact" className="section section-alt">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Contact Info & Socials */}
            <div className="contact-info-cards">
              <div>
                <div className="section-tag">Get in Touch</div>
                <h2 className="section-title">Visit & Connect</h2>
                <p className="section-desc">
                  We look forward to welcoming you to{' '}
                  <span className="placeholder-field plain">[RESTAURANT NAME HERE]</span>.
                </p>
              </div>

              {/* Address Card */}
              <div className="info-card">
                <MapPin size={24} />
                <div>
                  <h4>Physical Address</h4>
                  <div style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>
                    <span className="placeholder-field">
                      [RESTAURANT ADDRESS HERE]
                    </span>
                  </div>
                </div>
              </div>

              {/* Opening Hours Card */}
              <div className="info-card">
                <Clock size={24} />
                <div>
                  <h4>Opening Hours</h4>
                  <div style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>
                    <span className="placeholder-field">
                      [OPENING HOURS HERE]
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp Card */}
              <div className="info-card">
                <Phone size={24} />
                <div>
                  <h4>Phone & Inquiries</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '0.5rem' }}>Phone:</span>
                      <span className="placeholder-field">
                        [PHONE NUMBER HERE]
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '0.5rem' }}>WhatsApp:</span>
                      <span className="placeholder-field">
                        [WHATSAPP NUMBER HERE]
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="info-card">
                <Share2 size={24} />
                <div>
                  <h4>Follow Our Socials</h4>
                  <div className="social-links-grid">
                    <a href="#" className="social-link-btn">
                      <Instagram size={16} />
                      <span>[INSTAGRAM LINK HERE]</span>
                    </a>
                    <a href="#" className="social-link-btn">
                      <Facebook size={16} />
                      <span>[FACEBOOK LINK HERE]</span>
                    </a>
                    <a href="#" className="social-link-btn">
                      <MessageSquare size={16} />
                      <span>[TIKTOK LINK HERE]</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reservation Form */}
            <div className="reservation-form-container">
              <h3 className="form-title">Table Reservation</h3>
              <p className="form-subtitle">
                Reserve your table at <span className="placeholder-field plain">[RESTAURANT NAME HERE]</span>.
              </p>

              <form onSubmit={handleReservationSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="[YOUR NAME HERE]"
                      className="form-control"
                      value={reserveForm.name}
                      onChange={(e) => setReserveForm({ ...reserveForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="[PHONE NUMBER HERE]"
                      className="form-control"
                      value={reserveForm.phone}
                      onChange={(e) => setReserveForm({ ...reserveForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reservation Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={reserveForm.date}
                      onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      required
                      className="form-control"
                      value={reserveForm.time}
                      onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Number of Guests</label>
                    <select
                      className="form-control"
                      value={reserveForm.guests}
                      onChange={(e) => setReserveForm({ ...reserveForm, guests: e.target.value })}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6+ Guests (Private Dining)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea
                      placeholder="[SPECIAL REQUESTS OR DIETARY RESTRICTIONS HERE]"
                      className="form-control"
                      value={reserveForm.notes}
                      onChange={(e) => setReserveForm({ ...reserveForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit Reservation Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="brand-wrap" style={{ marginBottom: '1rem' }}>
                <div className="brand-logo-frame">
                  [RESTAURANT LOGO HERE]
                </div>
                <div className="brand-text">
                  <span className="brand-name placeholder-field plain">
                    [RESTAURANT NAME HERE]
                  </span>
                </div>
              </div>

              <p className="footer-brand-desc">
                <span className="placeholder-field block-field" style={{ textAlign: 'left' }}>
                  [RESTAURANT TAGLINE HERE]
                </span>
              </p>
            </div>

            <div>
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links-list">
                <li><a href="#about">About Us</a></li>
                <li><a href="#menu">Our Menu</a></li>
                <li><a href="#reviews">Guest Reviews</a></li>
                <li><a href="#gallery">Photo Gallery</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Menu Categories</h4>
              <ul className="footer-links-list">
                <li><a href="#menu">[MENU CATEGORY 1]</a></li>
                <li><a href="#menu">[MENU CATEGORY 2]</a></li>
                <li><a href="#menu">[MENU CATEGORY 3]</a></li>
                <li><a href="#menu">[MENU CATEGORY 4]</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Contact & Location</h4>
              <ul className="footer-links-list">
                <li><span className="placeholder-field" style={{ fontSize: '0.78rem' }}>[RESTAURANT ADDRESS HERE]</span></li>
                <li><span className="placeholder-field" style={{ fontSize: '0.78rem' }}>[PHONE NUMBER HERE]</span></li>
                <li><span className="placeholder-field" style={{ fontSize: '0.78rem' }}>[OPENING HOURS HERE]</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()}{' '}
              <span className="placeholder-field plain">[RESTAURANT NAME HERE]</span>. All rights reserved.
            </div>
            <div>
              <span>Clean Template Architecture · Standard CSS · React & TypeScript</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Reservation Modal Dialog */}
      {isReserveModalOpen && (
        <div className="modal-overlay" onClick={closeReservationModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeReservationModal}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {!reservationSuccess ? (
              <div>
                <h3 className="form-title" style={{ marginBottom: '0.75rem' }}>
                  Reserve a Table
                </h3>
                <p className="form-subtitle">
                  at <span className="placeholder-field plain">[RESTAURANT NAME HERE]</span>
                </p>

                <form onSubmit={handleReservationSubmit} style={{ marginTop: '1.5rem' }}>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="[YOUR NAME HERE]"
                        className="form-control"
                        value={reserveForm.name}
                        onChange={(e) => setReserveForm({ ...reserveForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="[PHONE NUMBER HERE]"
                        className="form-control"
                        value={reserveForm.phone}
                        onChange={(e) => setReserveForm({ ...reserveForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={reserveForm.date}
                        onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input
                        type="time"
                        required
                        className="form-control"
                        value={reserveForm.time}
                        onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Party Size</label>
                      <select
                        className="form-control"
                        value={reserveForm.guests}
                        onChange={(e) => setReserveForm({ ...reserveForm, guests: e.target.value })}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="6">6+ People (Group)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    Confirm Table Request
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ padding: '1rem 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--gold-dim)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: 'var(--gold)'
                  }}
                >
                  <Check size={28} />
                </div>
                <h3 className="form-title" style={{ marginBottom: '0.75rem' }}>
                  Reservation Request Received
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Thank you! Your table request at{' '}
                  <span className="placeholder-field plain">[RESTAURANT NAME HERE]</span> for{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{reserveForm.guests} guests</strong> on{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{reserveForm.date} at {reserveForm.time}</strong> has been logged.
                </p>
                <button onClick={closeReservationModal} className="btn btn-primary">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
