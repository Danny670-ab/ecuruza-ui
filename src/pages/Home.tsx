import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { sampleProducts } from '../data/products'

interface CategoryItem {
  id: number
  name: string
  image: string
}

// All 31 categories
const categories: CategoryItem[] = [
  { id: 1, name: 'Apparel & Accessories', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
  { id: 2, name: 'Consumer Electronics', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
  { id: 3, name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { id: 4, name: 'Sports & Entertainment', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
  { id: 5, name: 'Beauty', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400' },
  { id: 6, name: 'Sportswear & Outdoor', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id: 7, name: 'Jewelry & Watches', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400' },
  { id: 8, name: 'Shoes & Accessories', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { id: 9, name: 'Luggage & Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { id: 10, name: 'Packaging & Printing', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { id: 11, name: 'Kids & Toys', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400' },
  { id: 12, name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
  { id: 13, name: 'Health & Medical', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400' },
  { id: 14, name: 'Gifts & Crafts', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400' },
  { id: 15, name: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400' },
  { id: 16, name: 'School & Office', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400' },
  { id: 17, name: 'Industrial Machinery', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
  { id: 18, name: 'Commercial Equipment', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
  { id: 19, name: 'Construction & Building', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
  { id: 20, name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { id: 21, name: 'Lights & Lighting', image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400' },
  { id: 22, name: 'Home Appliances', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400' },
  { id: 23, name: 'Automotive Supplies', image: 'https://images.unsplash.com/photo-1569391570861-20c3b82a1a02?w=400' },
  { id: 24, name: 'Tools & Hardware', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
  { id: 25, name: 'Renewable Energy', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400' },
  { id: 26, name: 'Electrical Equipment', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { id: 27, name: 'Safety & Security', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
  { id: 28, name: 'Food & Beverage', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  { id: 29, name: 'Raw Materials', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { id: 30, name: 'Fabrication Services', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
  { id: 31, name: 'Service', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400' },
]

interface SubcategoryItem {
  name: string
  image: string
}

// Subcategories data for each main category (4 subcategories per category)
const subcategoriesData: { [categoryId: number]: SubcategoryItem[] } = {
  1: [ // Apparel & Accessories
    { name: "Men's Clothing", image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
    { name: "Women's Clothing", image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
    { name: "Activewear", image: 'https://images.unsplash.com/photo-1544923246-77307dd628b5?w=400' },
    { name: "Winter Wear", image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400' },
  ],
  2: [ // Consumer Electronics
    { name: "Smartphones", image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
    { name: "Laptops", image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { name: "Smartwatches", image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { name: "Audio Devices", image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
  ],
  3: [ // Home & Garden
    { name: "Furniture", image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { name: "Lighting", image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { name: "Garden Tools", image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
    { name: "Bedding", image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14d7?w=400' },
  ],
  4: [ // Sports & Entertainment
    { name: "Fitness Gear", image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
    { name: "Yoga Mats", image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
    { name: "Sports Balls", image: 'https://images.unsplash.com/photo-1519861531473-92002639313a?w=400' },
    { name: "Cycling", image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  ],
  5: [ // Beauty
    { name: "Skincare", image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400' },
    { name: "Makeup", image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400' },
    { name: "Hair Care", image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    { name: "Face Care", image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
  ],
  6: [ // Sportswear & Outdoor
    { name: "Running Shoes", image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: "Hiking Boots", image: 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=400' },
    { name: "Outdoor Gear", image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400' },
    { name: "Athletic Wear", image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400' },
  ],
  7: [ // Jewelry & Watches
    { name: "Necklaces", image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400' },
    { name: "Rings", image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400' },
    { name: "Bracelets", image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400' },
    { name: "Watches", image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  ],
  8: [ // Shoes & Accessories
    { name: "Casual Shoes", image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
    { name: "Formal Shoes", image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400' },
    { name: "Sandals", image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400' },
    { name: "Boots", image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400' },
  ],
  9: [ // Luggage & Bags
    { name: "Backpacks", image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { name: "Travel Bags", image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
    { name: "Messenger Bags", image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
    { name: "Tote Bags", image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
  ],
  10: [ // Packaging & Printing
    { name: "Boxes", image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
    { name: "Labels", image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' },
    { name: "Bags", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: "Wrapping", image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400' },
  ],
  11: [ // Kids & Toys
    { name: "Educational Toys", image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400' },
    { name: "Baby Food", image: 'https://images.unsplash.com/photo-1560891958-68bb1b0e49f6?w=400' },
    { name: "Kids Bikes", image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400' },
    { name: "Remote Toys", image: 'https://images.unsplash.com/photo-1557418669-df1a2c53ebf3?w=400' },
  ],
  12: [ // Personal Care
    { name: "Skincare", image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
    { name: "Hair Care", image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400' },
    { name: "Body Care", image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' },
    { name: "Oral Care", image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c00?w=400' },
  ],
  13: [ // Health & Medical
    { name: "Medical Supplies", image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400' },
    { name: "First Aid", image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400' },
    { name: "Fitness Equipment", image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
    { name: "Vitamins", image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
  ],
  14: [ // Gifts & Crafts
    { name: "Handmade Gifts", image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400' },
    { name: "Art Supplies", image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400' },
    { name: "Craft Kits", image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44f?w=400' },
    { name: "Party Supplies", image: 'https://images.unsplash.com/photo-1530103862676-de3c9fa5a0fe?w=400' },
  ],
  15: [ // Pet Supplies
    { name: "Pet Food", image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400' },
    { name: "Pet Toys", image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400' },
    { name: "Pet Beds", image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400' },
    { name: "Pet Care", image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400' },
  ],
  16: [ // School & Office
    { name: "Stationery", image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400' },
    { name: "Office Supplies", image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400' },
    { name: "School Bags", image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { name: "Books", image: 'https://images.unsplash.com/photo-1512820790803-83ca734b794f?w=400' },
  ],
  17: [ // Industrial Machinery
    { name: "Manufacturing", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
    { name: "Heavy Equipment", image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
    { name: "Tools", image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
    { name: "Automation", image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400' },
  ],
  18: [ // Commercial Equipment
    { name: "Restaurant Gear", image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
    { name: "Office Equipment", image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400' },
    { name: "Retail Displays", image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
    { name: "POS Systems", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  ],
  19: [ // Construction & Building
    { name: "Building Materials", image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
    { name: "Tools & Hardware", image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
    { name: "Safety Gear", image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
    { name: "Electrical", image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400' },
  ],
  20: [ // Furniture
    { name: "Sofas", image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { name: "Chairs", image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400' },
    { name: "Tables", image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400' },
    { name: "Storage", image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400' },
  ],
  21: [ // Lights & Lighting
    { name: "Ceiling Lights", image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400' },
    { name: "Table Lamps", image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { name: "LED Lights", image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400' },
    { name: "Chandeliers", image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=400' },
  ],
  22: [ // Home Appliances
    { name: "Smart Home", image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400' },
    { name: "Vacuum Cleaners", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: "Air Purifiers", image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400' },
    { name: "Kitchen Appliances", image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
  ],
  23: [ // Automotive Supplies
    { name: "Car Tires", image: 'https://images.unsplash.com/photo-1569391570861-20c3b82a1a02?w=400' },
    { name: "Car Batteries", image: 'https://images.unsplash.com/photo-1508031002422-a2a6f64b5d8c?w=400' },
    { name: "Car Electronics", image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400' },
    { name: "Car Accessories", image: 'https://images.unsplash.com/photo-1508031002422-a2a6f64b5d8c?w=400' },
  ],
  24: [ // Tools & Hardware
    { name: "Power Tools", image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
    { name: "Hand Tools", image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400' },
    { name: "Fasteners", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
    { name: "Safety Equipment", image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
  ],
  25: [ // Renewable Energy
    { name: "Solar Panels", image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400' },
    { name: "Wind Energy", image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400' },
    { name: "Batteries", image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400' },
    { name: "Energy Storage", image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400' },
  ],
  26: [ // Electrical Equipment
    { name: "Wiring", image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400' },
    { name: "Switches", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: "Circuit Breakers", image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400' },
    { name: "Cables", image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400' },
  ],
  27: [ // Safety & Security
    { name: "Security Cameras", image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
    { name: "Fire Safety", image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400' },
    { name: "Locks", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: "Safety Gear", image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
  ],
  28: [ // Food & Beverage
    { name: "Organic Food", image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
    { name: "Beverages", image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
    { name: "Snacks", image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400' },
    { name: "Dairy", image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  ],
  29: [ // Raw Materials
    { name: "Metals", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: "Plastics", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
    { name: "Wood", image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
    { name: "Fabrics", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  ],
  30: [ // Fabrication Services
    { name: "Custom Manufacturing", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
    { name: "Metal Work", image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
    { name: "Woodworking", image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
    { name: "3D Printing", image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400' },
  ],
  31: [ // Service
    { name: "Consulting", image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400' },
    { name: "Maintenance", image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400' },
    { name: "Repair Services", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400' },
    { name: "Delivery", image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  ],
}

// Get subcategories for a specific category
function getSubcategoriesForCategory(categoryId: number): SubcategoryItem[] {
  return subcategoriesData[categoryId] || [
    { name: 'Subcategory 1', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { name: 'Subcategory 2', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
    { name: 'Subcategory 3', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { name: 'Subcategory 4', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
  ]
}

function Home() {
  // Get products with 20%+ discount and duplicate for more scroll items
  const dealProducts = sampleProducts.filter(p => {
    if (!p.originalPrice) return false;
    const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100;
    return discount >= 20;
  });
  // Duplicate products for better scrolling experience
  const scrollProducts = [...dealProducts, ...dealProducts];

  // Ref for the scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className='w-full bg-[#F2EEEE]'>
      <Hero />
      
      {/* Categories Section - One Row with horizontal scroll */}
      <div className="max-w-screen-2xl bg-[#F2EEEE] mx-auto px-6 py-1">
         <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl px-2 font-bold text-black">All Categories</h2>
        </div> 
        
         Single row with horizontal scroll
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1 bg-[#F2EEEE] py-4 rounded-lg">
          {categories.map((category) => (
            <Link 
              to={`/ctegory?cat=${category.id}`} 
              key={category.id}
              className="group shrink-0"
            >
              <div className="flex w-28 items-center justify-center sm:w-18 md:w-30 h-28 sm:h-18 md:h-30 relative overflow-hidden rounded-lg shadow-m hover:shadow-x transition-all duration-300">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-40 flex rounded-m object-cover group-hover:scale- transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <h3 className="text-white font-bo text-sm sm:text-sm  truncate">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
         
        {/* Super Deals Section */}
        <div className='mt-3 bg-white rounded-lg p-4 md:p- 6 shadow-md'>
          {/* Header with View All */}
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-[#3F4E40]'></h2>
            <Link 
              to="/shopnow?deals=true" 
              className='text-[#3F4E40] right-2 font-medium text-sm hover:underline flex items-center gap-1'
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className='flex flex-col md:flex-row items-start gap-4'> 
            <div className="bg-[#3F4E40] rounded-lg p-4 md:p-8 text-center w-full md:w-50 shrink-0">
              <h1 className='text-white font-bold text-xl md:text-2xl'>Super Deals</h1>
              <h2 className='text-white mt-2 md:mt-3 font-semibold text-sm md:text-base'>Up To 20% Off</h2>
              <p className='text-xs text-white mt-3 md:mt-5'>This Round Ends in 3 Days</p>
              <div className='flex mt-3 md:mt-4 items-center justify-center'>
                <Link to="/shopnow?deals=true" className='flex bg-white items-center justify-center rounded-full text-black px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold hover:bg-gray-100 transition-colors'>Shop Now</Link>
              </div>
            </div>
            
            {/* Products scroll - horizontally scrollable */}
            <div className='flex-1  w-full overflow-hidden relative'>
              {/* Left Arrow */}
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-8">
                {scrollProducts.map((product, index) => (
                  <Link 
                    to={`/product/${product.id}`}
                    key={`${product.id}-${index}`}
                    className="group shrink-0"
                  >
                    <div className="w-40 md:w-44 relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                      <div className="relative h-36  md:h-40 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.originalPrice && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-2 md:p-3">
                        <h3 className="text-gray-800 font-medium text-xs md:text-sm truncate">{product.name}</h3>
                        <div className="flex items-center mt-1 gap-1">
                          <span className="text-[#3F4E40] font-bold text-sm md:text-base">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 text-xs line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Grid Section - Below Super Deals with 4 subcategory images each */}
        <div className="mt- bg-[#F2EEEE] rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const subcategories = getSubcategoriesForCategory(category.id)
              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Header with title and View All */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#3F4E40] transition-colors">
                      {category.name}
                    </h3>
                    <Link 
                      to={`/ctegory?cat=${category.id}`} 
                      className="text-sm text-[#3F4E40] hover:opacity-70 transition-all font-medium flex items-center gap-1"
                    >
                      View All
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Image Grid - 2x2 for 4 subcategories */}
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {subcategories.map((sub, idx) => (
                      <Link 
                        to={`/category?cat=${category.id}`} 
                        key={idx}
                        className="overflow-hidden rounded-lg"
                      >
                        <div className="relative">
                          <img 
                            src={sub.image} 
                            alt={sub.name}
                            className="w-full h-28 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-1">
                            <p className="text-white text-xs truncate">{sub.name}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
