/**
 * Christmas Holiday Store - Products Catalog Data
 * Optimized for US & EU Holiday Shoppers
 * Prices in USD and EUR with discount badges, ratings, and recipient filters
 */

const CHRISTMAS_PRODUCTS = [
  {
    id: "prod-candle",
    name: "Winter Spice & Pine Luxury Candle",
    subtitle: "Hand-poured 100% natural soy wax | 65-hour burn time",
    priceUSD: 38.00,
    originalPriceUSD: 48.00,
    priceEUR: 35.00,
    originalPriceEUR: 45.00,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Best Seller",
    badgeType: "bestseller",
    category: "decor",
    recipient: "her",
    priceTier: "under-50",
    image: "assets/images/product-candle.jpg",
    secondaryImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    description: "Infused with authentic Fraser fir pine needle, warm crushed cinnamon bark, spiced clove, and Madagascar vanilla bean. Features an embossed emerald glass jar with an antique gold lid.",
    stock: 14,
    shippingInfo: "Ships within 24h - Guaranteed Pre-Christmas Delivery",
    features: [
      "100% Natural Coconut-Soy Wax Blend",
      "Lead-Free Organic Cotton & Crackling Wood Dual Wick",
      "Embossed Emerald Keepsake Jar with Brass Lid",
      "Hand-Poured in Small Artisan Batches"
    ]
  },
  {
    id: "prod-ornaments",
    name: "Aethelred Heirloom Glass Baubles (Set of 6)",
    subtitle: "Handcrafted mouth-blown glass with 24K gilded filigree",
    priceUSD: 64.00,
    originalPriceUSD: 78.00,
    priceEUR: 59.00,
    originalPriceEUR: 72.00,
    rating: 5.0,
    reviewsCount: 98,
    badge: "Holiday Exclusive",
    badgeType: "exclusive",
    category: "decor",
    recipient: "home",
    priceTier: "under-100",
    image: "assets/images/product-ornaments.jpg",
    secondaryImage: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80",
    description: "Centuries-old European artisan tradition brought to life. Each ornament is individually mouth-blown, hand-lacquered in festive ruby, emerald, and champagne gold, and housed in an ivory satin-lined presentation box.",
    stock: 9,
    shippingInfo: "Ships in secure reinforced gift packaging",
    features: [
      "Set of 6 Unique Hand-Blown Shapes",
      "24K Gold Hand-Painted Filigree Lacquer",
      "Deluxe Velvet Green Presentation Keepsake Box",
      "Passed Down Family Heirloom Quality"
    ]
  },
  {
    id: "prod-blanket",
    name: "Nordic Chunky Merino Wool Throw Blanket",
    subtitle: "Ultra-cozy Scandinavian cable knit | 100% Organic Wool",
    priceUSD: 89.00,
    originalPriceUSD: 120.00,
    priceEUR: 82.00,
    originalPriceEUR: 110.00,
    rating: 4.8,
    reviewsCount: 215,
    badge: "26% OFF",
    badgeType: "sale",
    category: "home",
    recipient: "him",
    priceTier: "under-100",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80",
    description: "The ultimate fireside comfort. Crafted from sustainably sourced 21-micron merino wool, offering cloud-like softness, breathable warmth, and an elegant Nordic cable pattern.",
    stock: 6,
    shippingInfo: "Free Express Shipping included",
    features: [
      "100% Pure Non-Itch Australian Merino Wool",
      "Dimensions: 50\" x 70\" (127cm x 178cm)",
      "Naturally hypoallergenic and temperature regulating",
      "Comes tied with festive red satin grosgrain ribbon"
    ]
  },
  {
    id: "prod-chocolate",
    name: "Artisanal Holiday Truffle & Praline Box (24pcs)",
    subtitle: "Master Chocolatier Selection | Belgian & Swiss Cacao",
    priceUSD: 42.00,
    originalPriceUSD: 50.00,
    priceEUR: 38.00,
    originalPriceEUR: 46.00,
    rating: 4.9,
    reviewsCount: 310,
    badge: "Staff Pick",
    badgeType: "bestseller",
    category: "gourmet",
    recipient: "her",
    priceTier: "under-50",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
    description: "An exquisite box of 24 handcrafted pralines featuring holiday flavors: Spiced Eggnog Ganache, Dark Chocolate Peppermint, Champagne Truffle, and Salted Caramel Pecan.",
    stock: 22,
    shippingInfo: "Temperature-controlled insulated shipping",
    features: [
      "24 Unique Chocolates with Festive Gold Leaf Flakes",
      "Ethically Sourced Single-Origin Cacao",
      "Gold Embossed Luxury Velvet Touch Gift Box",
      "Vegetarian & Alcohol-Free Options Included"
    ]
  },
  {
    id: "prod-cottage",
    name: "Illuminated Ceramic Winter Village Cottage",
    subtitle: "Warm ambient LED glow | Hand-glazed porcelain stoneware",
    priceUSD: 48.00,
    originalPriceUSD: 58.00,
    priceEUR: 44.00,
    originalPriceEUR: 54.00,
    rating: 4.7,
    reviewsCount: 86,
    badge: "Trending",
    badgeType: "trending",
    category: "decor",
    recipient: "home",
    priceTier: "under-50",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=800&q=80",
    description: "Transform your mantle or tabletop into a cozy Alpine Christmas scene. Casts warm starry light patterns through its miniature carved windows and roof cutouts.",
    stock: 11,
    shippingInfo: "Batteries and remote timer included",
    features: [
      "High-fired durable matte white ceramic",
      "Warm 2700K fairy glow LED interior with 6-hour auto timer",
      "Dimensions: 8.5\" H x 5.2\" W x 4.8\" D",
      "Safe cordless operation (2x AA batteries included)"
    ]
  },
  {
    id: "prod-stocking",
    name: "Personalized Heirloom Velvet Christmas Stocking",
    subtitle: "Deep Ruby Velvet with Faux Fur & Gold Monogram",
    priceUSD: 24.50,
    originalPriceUSD: 32.00,
    priceEUR: 22.00,
    originalPriceEUR: 29.00,
    rating: 4.9,
    reviewsCount: 420,
    badge: "Under $25",
    badgeType: "budget",
    category: "decor",
    recipient: "kids",
    priceTier: "under-25",
    image: "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80",
    description: "A beloved tradition for generations. Hand-tailored from thick velvet with a plush faux-fur folded cuff. Includes custom embroidered name tag in metallic gold thread.",
    stock: 35,
    shippingInfo: "Personalized & shipped within 48h",
    features: [
      "Custom Gold Thread Monogramming Included",
      "Generous 20-inch diagonal length to hold plenty of treats",
      "Reinforced hanging loop supports up to 10 lbs",
      "Machine washable on delicate cycle"
    ]
  },
  {
    id: "prod-wreath",
    name: "Fresh Pine & Dried Orange Botanical Wreath (22\")",
    subtitle: "Hand-tied Oregon fir, eucalyptus & cinnamon sticks",
    priceUSD: 68.00,
    originalPriceUSD: 85.00,
    priceEUR: 62.00,
    originalPriceEUR: 78.00,
    rating: 4.8,
    reviewsCount: 112,
    badge: "20% OFF",
    badgeType: "sale",
    category: "decor",
    recipient: "home",
    priceTier: "under-100",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    description: "Welcome guests with the authentic natural fragrance of fresh winter greenery. Crafted with fragrant noble fir, seeded eucalyptus, sun-dried orange wheels, and rustic pinecones.",
    stock: 8,
    shippingInfo: "Cut fresh on demand, express delivered in moisture pack",
    features: [
      "Freshly harvested Pacific Northwest evergreen boughs",
      "Stays vibrant & fragrant indoors or outdoors for 6+ weeks",
      "Natural burlap and velvet hanging ribbon included",
      "Eco-friendly, 100% biodegradable materials"
    ]
  },
  {
    id: "prod-nutcracker",
    name: "Nutcracker & Toyland Hand-Carved Music Box",
    subtitle: "Authentic Erzgebirge style with 18-note mechanical movement",
    priceUSD: 56.00,
    originalPriceUSD: 72.00,
    priceEUR: 52.00,
    originalPriceEUR: 66.00,
    rating: 4.9,
    reviewsCount: 164,
    badge: "Collector's Item",
    badgeType: "exclusive",
    category: "collectible",
    recipient: "kids",
    priceTier: "under-100",
    image: "https://images.unsplash.com/photo-1512474932049-78ac69ede12c?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80",
    description: "Wind the golden key on the base to hear Tchaikovsky's 'Dance of the Sugar Plum Fairy' while miniature hand-carved nutcracker soldiers and ballerinas gently rotate on the festive wooden stage.",
    stock: 5,
    shippingInfo: "Inspected and tuned before shipment",
    features: [
      "Solid beechwood and basswood construction",
      "High-precision Sankyo Japanese 18-note mechanical musical chime",
      "Detailed non-toxic hand painting with lacquer seal",
      "Includes Certificate of Authenticity"
    ]
  }
];

// Holiday Bundles (To boost AOV - Average Order Value)
const HOLIDAY_BUNDLES = [
  {
    id: "bundle-ultimate",
    title: "The Ultimate Fireside Holiday Hamper",
    tagline: "Save $39 when bought together",
    priceUSD: 149.00,
    originalPriceUSD: 188.00,
    priceEUR: 139.00,
    originalPriceEUR: 174.00,
    badge: "Save 21%",
    items: [
      "Winter Spice & Pine Candle ($38)",
      "Chunky Merino Wool Blanket ($89)",
      "Artisanal 24pc Truffle Box ($42)",
      "Complimentary Velvet Gift Bag ($19 Value)"
    ],
    image: "assets/images/hero-banner.jpg",
    productIds: ["prod-candle", "prod-blanket", "prod-chocolate"]
  }
];
