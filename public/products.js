const products = [
  // CLOTHING (Originals + New)
  { id: 'f1', name: 'Cartoon Flower Shirt', brand: 'adidas', price: 780, category: 'Clothing', image: 'img/products/f1.jpg', rating: 5, isFeatured: true, isNew: false },
  { id: 'f2', name: 'Party Wear', brand: 'Peter England', price: 600, category: 'Clothing', image: 'img/products/f2.jpg', rating: 4, isFeatured: true, isNew: false },
  { id: 'f3', name: 'Hawaiian Shirt', brand: 'Allen Solly', price: 580, category: 'Clothing', image: 'img/products/f3.jpg', rating: 4, isFeatured: true, isNew: false },
  { id: 'f4', name: 'Cartoon T-Shirts', brand: 'adidas', price: 780, category: 'Clothing', image: 'img/products/f4.jpg', rating: 5, isFeatured: true, isNew: false },
  { id: 'f5', name: 'Zzple Mens Colorblock Shirt', brand: 'Levis', price: 880, category: 'Clothing', image: 'img/products/f6.jpg', rating: 5, isFeatured: true, isNew: false },
  { id: 'f6', name: 'Beishi Womens Pants', brand: 'W for Woman', price: 500, category: 'Clothing', image: 'img/products/f7.jpg', rating: 5, isFeatured: true, isNew: false },
  { id: 'f7', name: 'Womens Top', brand: 'Zara', price: 480, category: 'Clothing', image: 'img/products/f8.jpg', rating: 4, isFeatured: true, isNew: false },
  
  { id: 'n1', name: 'Striped Formal Shirt', brand: 'adidas', price: 780, category: 'Clothing', image: 'img/products/n1.jpg', rating: 5, isFeatured: false, isNew: true },
  { id: 'n2', name: 'Printed Checkered Shirt', brand: 'Peter England', price: 600, category: 'Clothing', image: 'img/products/n2.jpg', rating: 4, isFeatured: false, isNew: true },
  { id: 'n3', name: 'Classic White Shirt', brand: 'Allen Solly', price: 580, category: 'Clothing', image: 'img/products/n3.jpg', rating: 4, isFeatured: false, isNew: true },
  { id: 'n4', name: 'Denim Half-Sleeve', brand: 'adidas', price: 780, category: 'Clothing', image: 'img/products/n4.jpg', rating: 5, isFeatured: false, isNew: true },
  
  { id: 'c1', name: 'Vintage Denim Jacket', brand: 'Levis', price: 2400, category: 'Clothing', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: true },
  { id: 'c2', name: 'Urban Chino Pants', brand: 'Zara', price: 1500, category: 'Clothing', image: 'https://images.unsplash.com/photo-1624378439575-d8705b798083?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: false, isNew: true },
  { id: 'c3', name: 'Basic V-Neck T-Shirt', brand: 'H&M', price: 450, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: false, isNew: true },
  { id: 'c4', name: 'Puffer Winter Jacket', brand: 'North Face', price: 4500, category: 'Clothing', image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: true },
  { id: 'c5', name: 'Slim Fit Jeans', brand: 'Wrangler', price: 1800, category: 'Clothing', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: false },
  { id: 'c6', name: 'Cotton Pullover Hoodie', brand: 'Gap', price: 2200, category: 'Clothing', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: true, isNew: true },
  { id: 'c7', name: 'Gym Performance Tights', brand: 'Under Armour', price: 1600, category: 'Clothing', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: true },

  // FOOTWEAR
  { id: 's1', name: 'Air Force 1 Sneakers', brand: 'Nike', price: 7500, category: 'Footwear', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: false },
  { id: 's2', name: 'Classic Leather Boots', brand: 'Timberland', price: 12000, category: 'Footwear', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: true },
  { id: 's3', name: 'Suede Chelsea Loafers', brand: 'Clark', price: 5200, category: 'Footwear', image: 'https://images.unsplash.com/photo-1614252339460-e145155cce51?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: true, isNew: false },
  { id: 's4', name: 'Ultraboost Running Shoes', brand: 'adidas', price: 8900, category: 'Footwear', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: true },
  { id: 's5', name: 'Canvas Slip-on Vans', brand: 'Vans', price: 3500, category: 'Footwear', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: false, isNew: false },
  { id: 's6', name: 'Formal Oxford Leather Shoes', brand: 'Hush Puppies', price: 4000, category: 'Footwear', image: 'https://images.unsplash.com/photo-1614377284368-22b9dfdcc94e?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: true },
  { id: 's7', name: 'High-top Converse', brand: 'Converse', price: 3200, category: 'Footwear', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: true, isNew: false },
  { id: 's8', name: 'Summer Slides', brand: 'Crocs', price: 1500, category: 'Footwear', image: 'https://images.unsplash.com/photo-1534062083161-536ef7aa6308?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: false, isNew: true },

  // ACCESSORIES
  { id: 'a1', name: 'Aviator Premium Sunglasses', brand: 'Ray-Ban', price: 5400, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: true, isNew: false },
  { id: 'a2', name: 'Classic Leather Belt', brand: 'Tommy Hilfiger', price: 1800, category: 'Accessories', image: 'https://images.unsplash.com/photo-1624222247344-550fb60eba04?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: true },
  { id: 'a3', name: 'Signature Fragrance Perfume', brand: 'Chanel', price: 9500, category: 'Accessories', image: 'https://images.unsplash.com/photo-1595532542523-3b106af8b418?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: true },
  { id: 'a4', name: 'Summer Panama Hat', brand: 'Brixton', price: 2100, category: 'Accessories', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: false, isNew: true },
  { id: 'a5', name: 'Designer Crossbody Bag', brand: 'Gucci', price: 25000, category: 'Accessories', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: true },
  { id: 'a6', name: 'Minimalist Silver Watch', brand: 'Daniel Wellington', price: 6500, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: false },
  { id: 'a7', name: 'Knitted Winter Scarf', brand: 'Burberry', price: 3000, category: 'Accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: true, isNew: true },
  { id: 'a8', name: 'Classic Baseball Cap', brand: 'New Era', price: 1200, category: 'Accessories', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400&h=400', rating: 4, isFeatured: false, isNew: false },
  { id: 'a9', name: 'Gold Plated Necklace', brand: 'Swarovski', price: 4500, category: 'Accessories', image: 'https://images.unsplash.com/photo-1599643478524-fb66f70d00f0?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: false, isNew: true },
  
  // PAYMENT TESTING PRODUCT
  { id: 't1', name: 'Test Checkout Sticker (₹1)', brand: 'Cara', price: 1, category: 'Accessories', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400&h=400', rating: 5, isFeatured: true, isNew: true },
  
  // SMALL ITEMS (< ₹10)
  { id: '10r1', name: 'Vintage Button Pin', brand: 'Cara', price: 5, category: 'Accessories', image: 'https://loremflickr.com/400/400/pins,vintage,button/all', rating: 4, isFeatured: true, isNew: true },
  { id: '10r2', name: 'Pencil Eraser Block', brand: 'Cara', price: 3, category: 'Accessories', image: 'https://loremflickr.com/400/400/eraser,stationery/all', rating: 5, isFeatured: false, isNew: false },
  { id: '10r3', name: 'Mini Paper Clips (10)', brand: 'Cara', price: 4, category: 'Accessories', image: 'https://loremflickr.com/400/400/paperclips,office/all', rating: 4, isFeatured: false, isNew: true },
  { id: '10r4', name: 'Plain Cotton Mask', brand: 'Cara', price: 9, category: 'Accessories', image: 'https://loremflickr.com/400/400/cotton,facemask/all', rating: 5, isFeatured: true, isNew: true },
  { id: '10r5', name: 'Small Bookmark Ribbon', brand: 'Cara', price: 2, category: 'Accessories', image: 'https://loremflickr.com/400/400/ribbon,bookmark/all', rating: 3, isFeatured: false, isNew: false },
  { id: '10r6', name: 'Basic Plastic Comb', brand: 'Cara', price: 8, category: 'Accessories', image: 'https://loremflickr.com/400/400/comb,hair/all', rating: 4, isFeatured: true, isNew: false },
  { id: '10r7', name: 'Black Hair Ties (Set)', brand: 'Cara', price: 6, category: 'Accessories', image: 'https://loremflickr.com/400/400/hairties,elastic/all', rating: 5, isFeatured: false, isNew: true },
  { id: '10r8', name: 'Pocket Hand Sanitizer', brand: 'Cara', price: 10, category: 'Accessories', image: 'https://loremflickr.com/400/400/sanitizer,bottle/all', rating: 5, isFeatured: true, isNew: false }
];
