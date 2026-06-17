const products = [
  // Laptops
  { id: 1, name: "HP Victus 15", brand: "HP", category: "Laptop", price: 64990, discount: 8, rating: 4.4, stock: 12, image: "https://rukminim2.flixcart.com/image/480/640/xif0q/computer/r/t/d/-original-imahgfdfujmy7qqk.jpeg?q=90" },
  { id: 2, name: "ASUS ROG Strix SCAR 18", brand: "ASUS", category: "Laptop", price: 400000, discount: 5, rating: 4.8, stock: 4, image: "https://m.media-amazon.com/images/I/811vRQEsG6L.jpg" },
  { id: 3, name: "Acer Predator Helios Neo 106S", brand: "Acer", category: "Laptop", price: 175000, discount: 10, rating: 4.6, stock: 6, image: "https://m.media-amazon.com/images/I/81s4wwPDSPL._AC_UF350,350_QL80_.jpg" },
  { id: 4, name: "MacBook Pro M5", brand: "Apple", category: "Laptop", price: 180000, discount: 3, rating: 4.9, stock: 7, image: "https://inventstore.in/wp-content/uploads/2025/10/Blog-Banner-3.png" },
  { id: 25, name: "MSI Katana A15 AI B8VE", brand: "MSI", category: "Laptop", price: 99990, discount: 10, rating: 4.5, stock: 8, image: "https://m.media-amazon.com/images/I/61HNu6gkycL._AC_UF350,350_QL80_.jpg" },

  // Mobiles
  { id: 5, name: "iPhone 17 Pro Max", brand: "Apple", category: "Mobile", price: 149000, discount: 5, rating: 4.9, stock: 15, image: "https://www.designinfo.in/wp-content/uploads/2025/09/Apple-iPhone-17-Pro.webp" },
  { id: 6, name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "Mobile", price: 150000, discount: 8, rating: 4.7, stock: 10, image: "https://content.presspage.com/uploads/633/4c4c3f12-da11-431f-b8d3-5ad1e21c3a7f/1920_samsung-sv-kv-m3-digi-land-v01.jpg?10000" },
  { id: 7, name: "Asus ROG Phone 9", brand: "ASUS", category: "Mobile", price: 261481, discount: 10, rating: 4.6, stock: 5, image: "https://st.gsmarena.com/imgroot/news/24/11/asus-rog-phone-9-announcement/inline/-1200/gsmarena_004.jpg" },
  { id: 8, name: "Xiaomi 17 Pro Max", brand: "Xiaomi", category: "Mobile", price: 89000, discount: 12, rating: 4.4, stock: 20, image: "https://especialistatech.com/wp-content/uploads/2025/09/xiaomi-17-pro-max.jpg" },
  { id: 9, name: "Vivo X200 Pro", brand: "Vivo", category: "Mobile", price: 69000, discount: 7, rating: 4.3, stock: 14, image: "https://m.media-amazon.com/images/I/71EmDLvU5vL._AC_UF350,350_QL80_.jpg" },

  // Refrigerators
  { id: 10, name: "Samsung 615L", brand: "Samsung", category: "Refrigerator", price: 205590, discount: 12, rating: 4.6, stock: 5, image: "https://mahajanelectronics.com/cdn/shop/files/2_41f860f9-533b-46ab-b429-ed66a5d0f9f9.png?v=1755155936&width=1440" },
  { id: 11, name: "LG 630L Frost-Free", brand: "LG", category: "Refrigerator", price: 128131, discount: 10, rating: 4.7, stock: 6, image: "https://www.lg.com/content/dam/channel/wcms/ph/images/rf/features/HA-PH-REF-F-NEXT8-RVF-X208MC-02-flat-door-mobile.jpg" },
  { id: 12, name: "Whirlpool 300L", brand: "Whirlpool", category: "Refrigerator", price: 27990, discount: 15, rating: 4.2, stock: 12, image: "https://m.media-amazon.com/images/I/61e0cqqfNYL._AC_UF350,350_QL80_.jpg" },
  { id: 13, name: "Haier 531L", brand: "Haier", category: "Refrigerator", price: 139990, discount: 8, rating: 4.5, stock: 4, image: "https://www.kitchenbrandstore.com/cdn/shop/files/duOimcgwPJt6ZiP1JKc96aKf0vYA2naJs6wZx932.jpg?v=1742195527" },
  { id: 14, name: "Godrej 432L", brand: "Godrej", category: "Refrigerator", price: 42990, discount: 10, rating: 4.1, stock: 15, image: "https://media.tatacroma.com/Croma%20Assets/Large%20Appliances/Refrigerator/Images/307460_1_PeKPrGUzRU.png?updatedAt=1776679706388" },

  // Washing Machines
  { id: 15, name: "LG 7kg Fully Auto", brand: "LG", category: "Washing Machine", price: 35391, discount: 12, rating: 4.5, stock: 10, image: "https://www.lg.com/content/dam/channel/wcms/in/images/washing-machines/front-load/WM-WD-Gentle-Wash-Banner-768x1050-M-1-2.jpg" },
  { id: 16, name: "Samsung 7kg", brand: "Samsung", category: "Washing Machine", price: 20994, discount: 8, rating: 4.3, stock: 18, image: "https://aspireinnovate.in/cdn/shop/files/Samsung7kgTopLoadWashingMachine_1080x1080.png?v=1741244955" },
  { id: 17, name: "Whirlpool 8kg", brand: "Whirlpool", category: "Washing Machine", price: 33490, discount: 10, rating: 4.4, stock: 8, image: "https://neverowned.in/cdn/shop/files/71v-wrlYYJL._SL1500_800x.jpg?v=1749407565" },
  { id: 18, name: "Bosch 7kg Front Load", brand: "Bosch", category: "Washing Machine", price: 30990, discount: 15, rating: 4.6, stock: 6, image: "https://media3.bsh-group.com/Product_Shots/21433198_WGA1320SIN_PGA4_def.webp" },
  { id: 19, name: "IFB 6kg", brand: "IFB", category: "Washing Machine", price: 36990, discount: 5, rating: 4.0, stock: 11, image: "https://kannankandy.com/wp-content/uploads/2025/06/81FVxrJ3W6L._SX679_-1.jpg" },

  // AC
  { id: 20, name: "LG 1.5 Ton Split", brand: "LG", category: "AC", price: 43809, discount: 18, rating: 4.6, stock: 8, image: "https://www.sathya.store/img/product/n0k1Bk1rD9U6Br0l.jpeg" },
  { id: 21, name: "Samsung 1 Ton", brand: "Samsung", category: "AC", price: 33990, discount: 10, rating: 4.4, stock: 14, image: "https://assets.mspimages.in/wp-content/uploads/sites/5//2026/03/bespoke.jpg?tr=w-415" },
  { id: 22, name: "Voltas 1.5 Ton Inverter", brand: "Voltas", category: "AC", price: 43000, discount: 12, rating: 4.5, stock: 7, image: "https://electronicparadise.in/cdn/shop/files/4_17cbecfa-e6e4-457a-bb59-60f5035361dd.webp?v=1776516111&width=1406" },
  { id: 23, name: "Daikin 2 Ton", brand: "Daikin", category: "AC", price: 35490, discount: 8, rating: 4.7, stock: 5, image: "https://coolindiamart.in/wp-content/uploads/2025/01/f-kc-1.4-3.jpg" },
  { id: 24, name: "Blue Star 1.5 Ton", brand: "Blue Star", category: "AC", price: 39990, discount: 10, rating: 4.3, stock: 10, image: "https://rukmini1.flixcart.com/image/1500/1500/xif0q/air-conditioner-new/v/2/l/-original-imahnjetm7rszcu9.jpeg?q=70" },
];

export default products;
