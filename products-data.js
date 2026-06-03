const PRODUCTS = [
  {
    id:1, name:"Wireless Earbuds", price:799, mrp:1299, category:"electronics", emoji:"🎧",
    desc:"True wireless, 24hr battery life",
    brand:"SoundCore",
    rating:4.3, reviewCount:2847,
    highlights:["True wireless with Bluetooth 5.3","24-hour total battery life (6hr + 18hr case)","IPX5 water resistant","Touch controls on each earbud","Noise isolation technology"],
    specs:{"Driver Size":"6mm dynamic","Frequency Response":"20Hz - 20kHz","Connectivity":"Bluetooth 5.3","Battery":"6hr (buds) + 18hr (case)","Water Resistance":"IPX5","Weight":"5g per earbud"},
    deliveryDays:3, deliveryLabel:"Get it by",
    colors:["Midnight Black","Pearl White","Coral Pink"],
    images:["🎧","🎵","📦","⭐"],
    reviews:[
      {name:"Rahul S.", rating:5, date:"12 May 2025", title:"Excellent sound quality!", body:"These earbuds are fantastic. The bass is punchy and the highs are clear. Battery life is exactly as advertised.", verified:true},
      {name:"Priya M.", rating:4, date:"3 Apr 2025", title:"Good for the price", body:"Very comfortable to wear for long hours. The touch controls take some getting used to but overall a great buy.", verified:true},
      {name:"Arjun K.", rating:4, date:"28 Mar 2025", title:"Solid performance", body:"Good sound, decent ANC. A bit tight fit initially but gets comfortable. Recommended for gym use.", verified:false},
    ]
  },
  {
    id:2, name:"USB-C Hub 7-in-1", price:1299, mrp:1999, category:"electronics", emoji:"🔌",
    desc:"HDMI, USB 3.0, SD card reader",
    brand:"TechLink",
    rating:4.1, reviewCount:1203,
    highlights:["7 ports in 1 compact hub","4K HDMI output up to 60Hz","USB 3.0 speeds up to 5Gbps","SD and microSD card slots","100W Power Delivery pass-through"],
    specs:{"Ports":"1x HDMI, 3x USB-A 3.0, 1x USB-C PD, SD, microSD","HDMI Resolution":"4K@30Hz / 1080p@60Hz","USB Speed":"5Gbps","Power Delivery":"100W pass-through","Cable Length":"20cm","Compatibility":"MacBook, Windows, iPad Pro"},
    deliveryDays:2, deliveryLabel:"Get it by",
    colors:["Space Grey","Silver"],
    images:["🔌","💻","🖥️","📦"],
    reviews:[
      {name:"Neha R.", rating:5, date:"20 May 2025", title:"Works perfectly with MacBook", body:"All ports work as expected. The 4K HDMI output is crisp. Build quality is solid.", verified:true},
      {name:"Vikram P.", rating:4, date:"15 Apr 2025", title:"Great hub, minor heating", body:"Does get slightly warm under heavy load but nothing concerning. All 7 ports work simultaneously.", verified:true},
    ]
  },
  {
    id:3, name:"Phone Stand", price:299, mrp:299, category:"electronics", emoji:"📱",
    desc:"Adjustable aluminum desktop stand",
    brand:"DeskMate",
    rating:4.5, reviewCount:5621,
    highlights:["Adjustable height and angle","Premium aluminum alloy build","Non-slip silicone base","Foldable and portable","Compatible with all smartphones"],
    specs:{"Material":"Aluminum alloy + ABS","Height Range":"12cm - 20cm","Angle Range":"0° - 90°","Weight":"145g","Base Size":"10cm x 8cm","Compatibility":"Phones 4.5\" to 7\""},
    deliveryDays:4, deliveryLabel:"Get it by",
    colors:["Silver","Black","Gold"],
    images:["📱","🖥️","✈️","📦"],
    reviews:[
      {name:"Anita S.", rating:5, date:"1 Jun 2025", title:"Sturdy and sleek!", body:"Holds my phone perfectly at any angle. Looks premium on my desk.", verified:true},
    ]
  },
  {
    id:4, name:"Smart Watch", price:2499, mrp:3999, category:"electronics", emoji:"⌚",
    desc:"Fitness tracker, heart rate, sleep",
    brand:"FitPulse",
    rating:4.2, reviewCount:3892,
    highlights:["24/7 heart rate monitoring","SpO2 blood oxygen sensor","7-day battery life","Water resistant to 50m","100+ workout modes","Sleep tracking with stages"],
    specs:{"Display":"1.4\" AMOLED, 320x320px","Battery":"7 days typical use","Water Resistance":"5ATM (50m)","Sensors":"Heart rate, SpO2, accelerometer, gyroscope","Compatibility":"Android 6+, iOS 10+","Strap":"Silicone, 22mm"},
    deliveryDays:2, deliveryLabel:"Get it by",
    colors:["Midnight Black","Glacier White","Forest Green"],
    images:["⌚","❤️","💪","📦"],
    reviews:[
      {name:"Kiran T.", rating:5, date:"25 May 2025", title:"Best budget smartwatch!", body:"Accurate heart rate, great display, and the sleep tracking is surprisingly detailed. 7-day battery is real.", verified:true},
      {name:"Deepa L.", rating:4, date:"10 May 2025", title:"Worth every rupee", body:"Very comfortable on the wrist. The fitness tracking modes are comprehensive. Highly recommend.", verified:true},
      {name:"Suresh N.", rating:3, date:"2 May 2025", title:"Good but GPS is missing", body:"Decent watch for the price. Wish it had built-in GPS though. Everything else works well.", verified:false},
    ]
  },
  {
    id:5, name:"Cotton T-Shirt", price:399, mrp:599, category:"fashion", emoji:"👕",
    desc:"100% cotton, unisex, all sizes",
    brand:"BasicThreads",
    rating:4.4, reviewCount:9834,
    highlights:["100% pure cotton fabric","Pre-shrunk for lasting fit","Ribbed crew neck collar","Available in XS to 3XL","Machine washable"],
    specs:{"Fabric":"100% Cotton 180 GSM","Fit":"Regular fit","Neck":"Crew neck","Sleeve":"Short sleeve","Care":"Machine wash cold","Sizes":"XS, S, M, L, XL, XXL, 3XL"},
    deliveryDays:3, deliveryLabel:"Get it by",
    colors:["White","Black","Navy","Grey","Olive","Red"],
    images:["👕","🎨","📏","📦"],
    reviews:[
      {name:"Meera V.", rating:5, date:"18 May 2025", title:"Super soft and comfortable", body:"The fabric quality is excellent for the price. Fits true to size and doesn't shrink after washing.", verified:true},
    ]
  },
  {
    id:6, name:"Running Shoes", price:1999, mrp:2999, category:"fashion", emoji:"👟",
    desc:"Lightweight, sizes 6–11",
    brand:"StridePro",
    rating:4.3, reviewCount:4521,
    highlights:["Ultra-lightweight mesh upper","Responsive foam midsole","Rubber outsole for grip","Breathable design","Available in sizes 6-11"],
    specs:{"Upper":"Engineered mesh","Midsole":"EVA foam","Outsole":"Rubber","Weight":"250g (size 8)","Drop":"8mm","Available Sizes":"UK 6–11"},
    deliveryDays:4, deliveryLabel:"Get it by",
    colors:["Black/White","Blue/Orange","Grey/Neon"],
    images:["👟","🏃","🌬️","📦"],
    reviews:[
      {name:"Rohan G.", rating:5, date:"30 Apr 2025", title:"Surprisingly light!", body:"The most comfortable running shoes I've owned at this price point. Great cushioning.", verified:true},
      {name:"Sonal P.", rating:4, date:"15 Apr 2025", title:"Good for everyday use", body:"Runs slightly large so go half a size down. Very breathable for summer runs.", verified:true},
    ]
  },
  {
    id:7, name:"Denim Jacket", price:1499, mrp:2299, category:"fashion", emoji:"🧥",
    desc:"Classic fit, premium denim",
    brand:"Indigo & Co.",
    rating:4.1, reviewCount:2103,
    highlights:["Premium 12oz denim fabric","Classic western-style pockets","Adjustable waist tabs","Button-front closure","Slightly distressed finish"],
    specs:{"Fabric":"100% Cotton Denim 12oz","Fit":"Classic fit","Closure":"Button","Pockets":"Chest + side + inner","Wash":"Mid-wash indigo","Sizes":"S, M, L, XL, XXL"},
    deliveryDays:5, deliveryLabel:"Get it by",
    colors:["Mid Blue","Dark Indigo","Black"],
    images:["🧥","✂️","🎨","📦"],
    reviews:[
      {name:"Pooja R.", rating:4, date:"5 May 2025", title:"Great quality denim", body:"The denim feels premium and thick. Fits well. Looks exactly like the picture.", verified:true},
    ]
  },
  {
    id:8, name:"Stainless Bottle", price:599, mrp:899, category:"home", emoji:"🍶",
    desc:"1L, keeps cold 24hrs, leak-proof",
    brand:"HydroMate",
    rating:4.6, reviewCount:7823,
    highlights:["Double-wall vacuum insulation","Keeps cold 24hr, hot 12hr","1-litre capacity","Leak-proof lid","BPA-free food grade steel"],
    specs:{"Capacity":"1000ml (1L)","Material":"18/8 Food-grade stainless steel","Insulation":"Double-wall vacuum","Cold Retention":"24 hours","Hot Retention":"12 hours","Lid Type":"Screw cap with handle"},
    deliveryDays:3, deliveryLabel:"Get it by",
    colors:["Arctic White","Matte Black","Ocean Blue","Forest Green"],
    images:["🍶","❄️","🔥","📦"],
    reviews:[
      {name:"Amit K.", rating:5, date:"22 May 2025", title:"Ice cold even in summer!", body:"Keeps water cold for more than 24 hours even in 40°C Hyderabad heat. Worth every rupee.", verified:true},
      {name:"Sunita M.", rating:5, date:"10 May 2025", title:"Perfect everyday bottle", body:"Sturdy, leak-proof, and looks great. The 1L capacity is perfect for office and gym.", verified:true},
    ]
  },
  {
    id:9, name:"Desk Organizer", price:449, mrp:449, category:"home", emoji:"🗂️",
    desc:"Bamboo, 5 compartments",
    brand:"ZenDesk",
    rating:4.3, reviewCount:1902,
    highlights:["Eco-friendly bamboo material","5 compartments for maximum organization","Smooth rounded edges","Non-slip rubber feet","Easy to assemble"],
    specs:{"Material":"Bamboo + MDF","Compartments":"5","Dimensions":"28cm x 16cm x 12cm","Weight":"420g","Assembly":"Tool-free","Finish":"Natural matte lacquer"},
    deliveryDays:4, deliveryLabel:"Get it by",
    colors:["Natural Bamboo"],
    images:["🗂️","🌿","📐","📦"],
    reviews:[
      {name:"Kavya S.", rating:4, date:"8 Apr 2025", title:"Looks beautiful on desk", body:"The bamboo finish looks premium. All my stationery is now perfectly organized.", verified:true},
    ]
  },
  {
    id:10, name:"LED Desk Lamp", price:849, mrp:1299, category:"home", emoji:"💡",
    desc:"Eye-care, touch dimmer, USB port",
    brand:"LumiPro",
    rating:4.4, reviewCount:3401,
    highlights:["Flicker-free eye protection tech","5 color temperatures + 10 brightness levels","USB-A charging port built-in","Touch-sensitive controls","360° adjustable arm"],
    specs:{"Power":"12W LED","Color Temperature":"2700K-6500K (5 modes)","Brightness":"10 dimming levels","Life Span":"30,000 hours","USB Port":"5V/1A","Arm Length":"45cm"},
    deliveryDays:3, deliveryLabel:"Get it by",
    colors:["Matte White","Matte Black"],
    images:["💡","👁️","🔌","📦"],
    reviews:[
      {name:"Raj P.", rating:5, date:"14 May 2025", title:"Perfect for late night work", body:"The eye-care mode is genuinely different. No headaches after long coding sessions anymore. The USB port is a bonus.", verified:true},
    ]
  },
  {
    id:11, name:"Face Serum", price:699, mrp:999, category:"beauty", emoji:"✨",
    desc:"Vitamin C, 30ml, all skin types",
    brand:"GlowLab",
    rating:4.5, reviewCount:6231,
    highlights:["15% stabilized Vitamin C","Brightens and evens skin tone","Boosts collagen production","Suitable for all skin types","Dermatologist tested"],
    specs:{"Key Ingredient":"15% Vitamin C (L-Ascorbic Acid)","Volume":"30ml","Skin Type":"All skin types","Texture":"Lightweight serum","Shelf Life":"24 months","Usage":"Morning routine"},
    deliveryDays:2, deliveryLabel:"Get it by",
    colors:["Single variant"],
    images:["✨","🌟","💧","📦"],
    reviews:[
      {name:"Lakshmi R.", rating:5, date:"28 May 2025", title:"Visible results in 2 weeks!", body:"My skin looks noticeably brighter and my dark spots have faded significantly. Great product at this price.", verified:true},
      {name:"Ishaan V.", rating:4, date:"12 May 2025", title:"Works as described", body:"Good serum, applies smoothly without stickiness. Skin feels softer after consistent use.", verified:true},
    ]
  },
  {
    id:12, name:"Sunscreen SPF 50", price:349, mrp:499, category:"beauty", emoji:"🧴",
    desc:"PA+++, no white cast, 50ml",
    brand:"ShieldSkin",
    rating:4.3, reviewCount:4102,
    highlights:["SPF 50 PA+++ broad spectrum","Zero white cast formula","Lightweight gel texture","Non-greasy finish","Water resistant (40 min)"],
    specs:{"SPF":"50 PA+++","Volume":"50ml","Texture":"Gel","Finish":"Matte","Water Resistance":"40 minutes","Key Ingredients":"Zinc Oxide, Titanium Dioxide"},
    deliveryDays:2, deliveryLabel:"Get it by",
    colors:["Single variant"],
    images:["🧴","☀️","💧","📦"],
    reviews:[
      {name:"Divya N.", rating:5, date:"3 Jun 2025", title:"No white cast, finally!", body:"This is the first sunscreen that doesn't leave me looking ashy. Perfect for dusky skin tones.", verified:true},
    ]
  },
  {
    id:13, name:"Yoga Mat", price:899, mrp:1299, category:"sports", emoji:"🧘",
    desc:"6mm, non-slip, carry strap",
    brand:"ZenFlex",
    rating:4.4, reviewCount:3821,
    highlights:["6mm thick high-density foam","Non-slip texture on both sides","Extra length 183cm x 61cm","Carry strap included","Easy to clean TPE material"],
    specs:{"Thickness":"6mm","Dimensions":"183cm x 61cm","Material":"TPE (Eco-friendly)","Weight":"900g","Surface":"Textured non-slip","Includes":"Carry strap"},
    deliveryDays:4, deliveryLabel:"Get it by",
    colors:["Purple","Teal","Black","Pink"],
    images:["🧘","🌿","💪","📦"],
    reviews:[
      {name:"Nandini K.", rating:5, date:"20 May 2025", title:"Excellent grip and cushion", body:"The 6mm thickness is perfect for joint support. The non-slip grip is reliable even when sweaty.", verified:true},
    ]
  },
  {
    id:14, name:"Resistance Bands", price:499, mrp:799, category:"sports", emoji:"💪",
    desc:"Set of 5, different resistance",
    brand:"PowerFlex",
    rating:4.2, reviewCount:2901,
    highlights:["Set of 5 resistance levels","Natural latex material","Anti-snap safety design","Workout guide included","Suitable for all fitness levels"],
    specs:{"Quantity":"5 bands","Resistance":"10lb, 20lb, 30lb, 40lb, 50lb","Material":"100% Natural Latex","Length":"200cm (loop)","Width":"2.5cm to 8cm","Includes":"Carry bag + workout guide"},
    deliveryDays:3, deliveryLabel:"Get it by",
    colors:["Multi-color set"],
    images:["💪","🏋️","🌿","📦"],
    reviews:[
      {name:"Arun M.", rating:4, date:"7 May 2025", title:"Great home workout set", body:"The different resistance levels are well-calibrated. Good quality latex, no snapping issues after 3 months.", verified:true},
    ]
  },
  {
    id:15, name:"Python Basics", price:349, mrp:499, category:"books", emoji:"📗",
    desc:"Beginner to advanced guide",
    brand:"TechBooks India",
    rating:4.6, reviewCount:1204,
    highlights:["Covers Python 3.11+","500+ practice exercises","Real-world project examples","Includes data science basics","Written for Indian learners"],
    specs:{"Pages":"540","Language":"English","Edition":"3rd Edition 2024","Publisher":"TechBooks India","Format":"Paperback","Level":"Beginner to Advanced"},
    deliveryDays:5, deliveryLabel:"Get it by",
    colors:["Paperback"],
    images:["📗","💻","🎓","📦"],
    reviews:[
      {name:"Pradeep S.", rating:5, date:"1 Jun 2025", title:"Best Python book for Indians!", body:"Examples use Indian context (UPI, Aadhaar, etc.) which makes it so much more relatable. Highly recommend.", verified:true},
    ]
  },
  {
    id:16, name:"Finance & Investing", price:299, mrp:449, category:"books", emoji:"📘",
    desc:"Personal finance masterclass",
    brand:"MoneyWise Press",
    rating:4.5, reviewCount:2341,
    highlights:["Covers mutual funds, stocks, SIPs","Tax saving strategies for India","Practical budgeting templates","Emergency fund building guide","Written by SEBI-registered advisor"],
    specs:{"Pages":"320","Language":"English","Edition":"2nd Edition 2024","Publisher":"MoneyWise Press","Format":"Paperback","Level":"Beginner to Intermediate"},
    deliveryDays:5, deliveryLabel:"Get it by",
    colors:["Paperback"],
    images:["📘","💰","📈","📦"],
    reviews:[
      {name:"Sanjana B.", rating:5, date:"25 Apr 2025", title:"Changed how I think about money", body:"Finally understand SIPs, equity vs debt, tax saving. Practical advice that's actually applicable in India.", verified:true},
    ]
  },
];
