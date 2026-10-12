/**
 * =========================================================================
 * CAMPUS CONNECT — CMRCET COLLEGE KNOWLEDGE BASE & STRUCTURED DATA
 * =========================================================================
 * Institution: CMR College of Engineering & Technology (CMRCET)
 * Status: UGC Autonomous | NAAC A+ Grade | NBA Accredited | AICTE Approved
 * Affiliation: Affiliated to JNTU Hyderabad (JNTUH)
 * Location: Kandlakoya (V), Medchal Road, Hyderabad, Telangana – 501401
 * =========================================================================
 * CRITICAL RULE:
 * Authentic local CMRCET campus photographs from the `pictures/` directory
 * are matched to verified college locations.
 * Locations without an available local photo strictly remain `image: null`
 * and render the elegant "Picture Coming Soon" placeholder.
 * NEVER use random, stock, AI-generated, or internet images.
 * =========================================================================
 */

const defaultCollegeData = {
  // General College Information
  college: {
    name: "CMR College of Engineering & Technology",
    shortName: "CMRCET",
    tagline: "Explore to Invent — UGC Autonomous Institution",
    established: "2002",
    affiliation: "Autonomous Institution under UGC, Approved by AICTE New Delhi, Affiliated to JNTU Hyderabad, Accredited by NAAC with 'A+' Grade & NBA",
    address: "Kandlakoya (V), Medchal Road, Hyderabad, Telangana – 501401, India",
    timings: "Monday to Saturday: 9:15 AM – 4:00 PM | (2nd & 4th Saturdays are Holidays)",
    workingHours: "9:15 AM – 4:00 PM (Monday to Saturday)",
    contact: "+91 92487 27210 / +91 08418 200037 / +91 08418 200137",
    phone: "+91 92487 27210",
    email: "info@cmrcet.ac.in",
    examEmail: "coe@cmrcet.ac.in",
    placementEmail: "placements@cmrcet.ac.in",
    supportEmail: "grievance@cmrcet.ac.in",
    website: "https://cmrcet.ac.in",
    principal: {
      name: "Major Dr. V. A. Narayana",
      office: "Principal's Suite, Ground Floor, Block 1 (Administrative Block)",
      visitingHours: "2:30 PM – 4:00 PM (Monday to Friday with prior appointment)",
      email: "principal@cmrcet.ac.in"
    }
  },

  // Key College Statistics
  stats: {
    facilitiesCount: "50+",
    departmentsCount: "10+",
    proceduresCount: "100+",
    assistanceAvailability: "24/7",
    highestPackage: "58 LPA",
    averagePackage: "6.5 LPA",
    placementRate: "88%+",
    recruitingCompaniesCount: "150+"
  },

  // Official Placement Information (2024–2025)
  placements: {
    year: "2024-2025",
    highestPackage: "58 LPA (Palo Alto Networks) / 44 LPA (Amazon)",
    averagePackage: "6.5 LPA",
    medianPackage: "5.8 LPA",
    placementPercentage: "88%+",
    totalOffers: "1,200+ offers across all engineering & management branches",
    topRecruiters: [
      "Palo Alto Networks", "Amazon", "Microsoft", "Virtusa", "Capgemini",
      "TCS (Tata Consultancy Services)", "Cognizant", "Wipro", "Infosys",
      "Accenture", "Darwinbox", "DXC Technology", "LTI Mindtree", "Hexaware"
    ],
    placementOfficer: "Dr. K. Sreenivas Rao (Head, Corporate Relations & Placements)",
    officeLocation: "Training & Placement Cell, Ground Floor (East Wing), Block 1",
    contactEmail: "placements@cmrcet.ac.in",
    contactPhone: "+91 92487 27218",
    eligibilityCriteria: "Minimum 60% / 6.5 CGPA throughout academics with no active backlogs for tier-1 product firms."
  },

  // Academic Courses & Degrees Offered
  courses: {
    undergraduate: [
      "B.Tech in Computer Science & Engineering (CSE)",
      "B.Tech in CSE (Artificial Intelligence & Machine Learning - AI&ML)",
      "B.Tech in CSE (Data Science - DS)",
      "B.Tech in CSE (Cyber Security - CS)",
      "B.Tech in Electronics & Communication Engineering (ECE)",
      "B.Tech in Electrical & Electronics Engineering (EEE)",
      "B.Tech in Mechanical Engineering (ME)",
      "B.Tech in Civil Engineering (CE)"
    ],
    postgraduate: [
      "M.Tech in Computer Science & Engineering",
      "M.Tech in Embedded Systems",
      "M.Tech in Structural Engineering",
      "M.Tech in Power Electronics",
      "Master of Business Administration (MBA)"
    ]
  },

  // Admissions & Counseling Information
  admissions: {
    eamcetCode: "CMRK",
    eamcetName: "CMR College of Engineering & Technology (CMRCET)",
    counselingBodies: "TG EAMCET (B.Tech), TG ECET (Lateral Entry), TG ICET (MBA), TG PGECET / GATE (M.Tech)",
    eligibility: {
      btech: "10+2 / Intermediate with Mathematics, Physics, Chemistry (MPC) and valid TG EAMCET rank.",
      lateralEntry: "Diploma in Engineering / B.Sc with valid TG ECET rank (Direct entry into 2nd year).",
      mba: "Graduation with minimum 50% marks and valid TG ICET rank.",
      mtech: "B.Tech/B.E in relevant branch with valid GATE / TG PGECET score."
    },
    managementQuota: "Category-B (Management/NRI quota) admissions are conducted as per Telangana State Council of Higher Education (TSCHE) guidelines.",
    admissionOffice: "Admissions Desk, Ground Floor (Room AD-102), Block 1",
    contactPhone: "+91 92487 27210 / +91 08418 200037",
    contactEmail: "admissions@cmrcet.ac.in"
  },

  // Campus Facilities
  facilities: {
    library: {
      id: "library",
      name: "CMRCET Central Digital Knowledge Resource Centre",
      description: "Air-conditioned 4-tier knowledge repository holding over 85,000+ volumes, IEEE/ACM & ScienceDirect e-journals, DELNET digital databases, multimedia research nodes, and private quiet study cubicles.",
      timings: "8:30 AM – 7:30 PM (Mon–Sat) | 9:30 AM – 4:30 PM (Sundays during semester exams)",
      location: "Central Library Block (Near Block 1 & 2)",
      contact: "library@cmrcet.ac.in",
      rules: "ID Card mandatory for entry. Silence must be observed. UG students can borrow up to 4 books for 14 days."
    },
    computerLabs: {
      id: "computerLabs",
      name: "Centre for AI, High-Performance Computing & Cloud Labs",
      description: "20+ state-of-the-art computer laboratories with 1,200+ high-end i7/i9 workstations, NVIDIA GPU AI accelerators, CISCO Networking Academy, and 1 Gbps dedicated leased-line internet.",
      timings: "8:45 AM – 5:30 PM (Monday to Saturday)",
      location: "Block 2 (CSE & IT Complex) & Innovation Hub",
      contact: "labs@cmrcet.ac.in"
    },
    hostel: {
      id: "hostel",
      name: "CMR Campus Hostels (Separate for Boys & Girls)",
      description: "Safe on-campus residential housing with 24/7 CCTV surveillance, biometric security, RO drinking water, high-speed Wi-Fi, attached dining mess offering hygienic South & North Indian food, study lounges, and solar hot water.",
      timings: "Hostel Entry Curfew: 7:30 PM for Girls, 8:30 PM for Boys | Mess Timings: 7:15-8:45 AM, 12:30-2:00 PM, 7:30-9:00 PM",
      location: "East Campus Residential Zone (Near Gate 3)",
      contact: "hostelwarden@cmrcet.ac.in | +91 92487 27220"
    },
    canteen: {
      id: "canteen",
      name: "CMR Campus Cafeteria & Multi-Cuisine Food Court",
      description: "Spacious and hygienic multi-counter food plaza serving fresh South Indian tiffins, vegetarian and executive meals, Chinese specials, bakery delights, fresh fruit juice bar, and tea/coffee stalls.",
      timings: "8:00 AM – 6:00 PM (All working days)",
      location: "Central Student Plaza (Adjacent to Central Lawn & Sports Arena)",
      contact: "canteen@cmrcet.ac.in"
    },
    sports: {
      id: "sports",
      name: "CMR Sports Complex, Stadium & Athletic Grounds",
      description: "Full-sized floodlit cricket ground, football arena, 400m athletic track, 3 outdoor standard basketball courts, volleyball courts, and indoor sports hall with international-grade wooden badminton courts and table tennis.",
      timings: "6:00 AM – 8:30 AM & 4:00 PM – 7:00 PM",
      location: "West Campus Sports Pavilion",
      contact: "sports@cmrcet.ac.in"
    },
    wifi: {
      id: "wifi",
      name: "Campus-Wide Wi-Fi 6 & Enterprise LAN",
      description: "High-speed secure optical fiber network with 1 Gbps redundant backbone delivering seamless Wi-Fi connectivity across all classrooms, laboratories, auditoriums, and hostel residences via student login credentials.",
      timings: "Available 24/7 across campus",
      location: "All Academic Blocks, Library, Auditoriums & Hostels",
      contact: "ithelpdesk@cmrcet.ac.in"
    },
    auditorium: {
      id: "auditorium",
      name: "CMR Central Air-Conditioned Auditorium & Convention Centre",
      description: "Acoustically engineered 2,000-seat state-of-the-art auditorium equipped with 4K laser Christie projection, robotic stage lighting, digital surround sound, and green rooms for tech fests (AZURA), hackathons, and convocations.",
      timings: "Open for scheduled academic conferences, fests, and guest lectures",
      location: "Convention Block (Adjacent to Block 1 & Central Lawn)",
      contact: "events@cmrcet.ac.in"
    },
    medical: {
      id: "medical",
      name: "CMR Campus Health Centre & Emergency Clinic",
      description: "Equipped first-aid clinic with full-time resident medical doctors, nursing staff, observation ward, emergency oxygen, essential pharmaceuticals, and 24/7 on-duty ambulance on standby for immediate hospital transit.",
      timings: "24/7 (Emergency) | Doctor OPD: 9:00 AM – 4:30 PM",
      location: "Ground Floor, Health Centre (Near Security Gate & Admin Block)",
      contact: "Emergency Ext: 108 | +91 92487 27210"
    }
  },

  /* =========================================================================
     CAMPUS LOCATIONS DATABASE — CMRCET
     =========================================================================
     Authentic local campus photos matched from `pictures/` folder.
     Locations without local photos strictly retain `image: null` (Picture Coming Soon).
     ========================================================================= */
  locations: [
    {
      id: "main-gate",
      name: "CMRCET Main Entrance Gate",
      code: "GATE-01",
      category: "Entrance",
      description: "Primary entrance on Medchal Highway (Kandlakoya) with 24/7 security booth, visitor identification desk, bus fleet boarding plaza, and pedestrian access lanes.",
      building: "Main Security Plaza",
      floor: "Ground Level",
      roomNumber: "SEC-01",
      timings: "Open 24/7 (Student entry closes at 9:15 AM)",
      contact: "+91 92487 27210 (Ext: 101)",
      distance: "0 m",
      walkingTime: "~0 min",
      latitude: 17.604250,
      longitude: 78.485900,
      image: "pictures/cmrcet main entrance gate.webp",
      keywords: ["cmrcet main gate", "cmrcet gate", "cmrcet entrance", "main gate", "gate", "entrance", "security", "visitor pass", "campus entry", "gate 1", "guard", "kandlakoya entry"],
      routeSteps: [
        "You are currently at the CMRCET Main Entrance Gate (Kandlakoya, Medchal Road)."
      ]
    },

    {
      id: "block1-admin",
      name: "Block 1 — Administrative Block & Principal's Office",
      code: "BLOCK-01",
      category: "Administrative",
      description: "Central administrative headquarters of CMRCET. Houses the Principal's Suite, Examination Branch, Student Accounts Section, Academic Dean's Chamber, and 1st Year Humanities & Sciences (H&S) classrooms.",
      building: "Block 1 (Administrative Complex)",
      floor: "Ground Floor to 3rd Floor",
      roomNumber: "AD-01 to AD-305",
      timings: "9:00 AM – 4:30 PM (Monday to Saturday)",
      contact: "principal@cmrcet.ac.in | +91 92487 27210",
      distance: "130 m",
      walkingTime: "~2 min",
      latitude: 17.6046671,
      longitude: 78.4865205,
      image: "pictures/cmrcet block I.jpeg",
      gallery: [
        "pictures/cmrcet block I.jpeg",
        "pictures/cmrcet administrative office.jpeg"
      ],
      keywords: ["cmrcet", "cmrcet campus", "cmrcet admin", "cmrcet administrative block", "cmrcet main block", "block 1", "admin", "admin block", "administrative block", "administrative office", "principal office", "exam branch", "accounts", "fee counter", "admissions", "h&s", "first year", "dean"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight along the central tree-lined main campus avenue for 120 meters.",
        "Block 1 (Administrative Complex) is the main building directly ahead on your left.",
        "Enter through the main front portico to reach the Reception, Accounts, and Principal's Suite on the Ground Floor."
      ]
    },

    {
      id: "library",
      name: "CMRCET Central Digital Library",
      code: "LIB-01",
      category: "Academic",
      description: "Central digital knowledge resource centre with 85,000+ technical volumes, national/international journals, quiet reading halls, digital browsing center, and DELNET/IEEE research access.",
      building: "Central Library Block",
      floor: "Ground, 1st & 2nd Floors",
      roomNumber: "LIB-101 to LIB-205",
      timings: "8:30 AM – 7:30 PM (Mon–Sat) | 9:30 AM – 4:30 PM (Sundays during exams)",
      contact: "library@cmrcet.ac.in | Ext: 104",
      distance: "280 m",
      walkingTime: "~3 min",
      latitude: 17.604850,
      longitude: 78.487100,
      image: "pictures/cmrcet library.jpg",
      keywords: ["cmrcet library", "cmrcet central library", "library", "central library", "books", "reading room", "journal", "digital library", "delnet", "borrow books", "book bank"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight along the central avenue past Block 1 (Admin Block) for 150 meters.",
        "Take the paved walkway on the right heading towards the academic core.",
        "CMRCET Central Library is the dedicated building located centrally between Block 1 and Block 3."
      ]
    },

    {
      id: "exam-cell",
      name: "Examination Branch & Autonomous Cell",
      code: "EXAM-01",
      category: "Administrative",
      description: "Controller of Examinations (CoE) office handling semester examination registrations, hall ticket issuance, autonomous grade cards, revaluation applications, and official transcripts.",
      building: "Block 1 (Administrative Complex)",
      floor: "1st Floor (Room AD-108)",
      roomNumber: "AD-108",
      timings: "9:30 AM – 4:00 PM (Monday to Saturday)",
      contact: "coe@cmrcet.ac.in | +91 92487 27215",
      distance: "140 m",
      walkingTime: "~2 min",
      latitude: 17.604700,
      longitude: 78.486550,
      image: "pictures/cmrcet examination branch.jpeg",
      keywords: ["cmrcet exam cell", "cmrcet examination branch", "exam", "examination", "exam cell", "examination cell", "exam branch", "coe", "controller of examinations", "hall ticket", "revaluation", "grade card", "transcripts", "marks memo"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight 130 meters to Block 1 (Administrative Block).",
        "Enter through the main entrance and take the staircase or elevator to the 1st Floor.",
        "Turn right in the hallway; the Examination Branch & CoE Office is in Room AD-108."
      ]
    },

    {
      id: "block2-cse",
      name: "Block 2 — Computer Science & Engineering (CSE) & IT",
      code: "BLOCK-02",
      category: "Academic",
      description: "Dedicated technology complex housing CSE, CSE (AI & ML), CSE (Data Science), and Cyber Security departments, NVIDIA AI Centre of Excellence, and Cloud Computing labs.",
      building: "Block 2 (CSE & IT Complex)",
      floor: "Ground Floor to 4th Floor",
      roomNumber: "CSE-101 to CSE-415",
      timings: "9:15 AM – 4:30 PM (Monday to Saturday)",
      contact: "hod.cse@cmrcet.ac.in | Ext: 201",
      distance: "250 m",
      walkingTime: "~3 min",
      latitude: 17.605150,
      longitude: 78.486800,
      image: "pictures/cmrcet block II.jpeg",
      keywords: ["cmrcet cse", "cmrcet block 2", "block 2", "cse", "computer science", "aiml", "data science", "cyber security", "it", "information technology", "cse hod", "ai lab", "coding lab"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight past Block 1 along the central campus path for 150 meters.",
        "Turn slightly right towards the North Academic Quadrangle.",
        "Block 2 (CSE & IT Complex) is the 4-storey building on your right.",
        "HOD CSE chamber is on the 2nd Floor; Computing labs are on Floors 1, 3, and 4."
      ]
    },

    {
      id: "block3-ece",
      name: "Block 3 — Electronics & Communication (ECE) & EEE",
      code: "BLOCK-03",
      category: "Academic",
      description: "Houses ECE and EEE engineering departments, Advanced VLSI Design Lab, Embedded Systems & IoT Hub, Power Systems Lab, and Simulation Suites.",
      building: "Block 3 (ECE & EEE Complex)",
      floor: "Ground Floor to 3rd Floor",
      roomNumber: "ECE-101 to EEE-310",
      timings: "9:15 AM – 4:30 PM",
      contact: "hod.ece@cmrcet.ac.in | hod.eee@cmrcet.ac.in",
      distance: "290 m",
      walkingTime: "~4 min",
      latitude: 17.604950,
      longitude: 78.487350,
      image: "pictures/cmrcet block III.jpeg",
      keywords: ["cmrcet ece", "cmrcet eee", "cmrcet block 3", "block 3", "ece", "eee", "electronics", "electrical", "vlsi lab", "embedded lab", "circuits lab", "hod ece", "hod eee"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight 130 meters to Block 1.",
        "Turn right along the walkway leading towards the East Academic zone for 140 meters.",
        "Block 3 (ECE/EEE Block) is situated immediately next to the Central Library."
      ]
    },

    {
      id: "block4-mech-civil",
      name: "Block 4 — Mechanical & Civil Engineering",
      code: "BLOCK-04",
      category: "Academic",
      description: "Department of Mechanical Engineering & Civil Engineering. Houses Heavy Machinery Workshop, CAD/CAM Studio, Strength of Materials Lab, Surveying Lab, and Concrete Technology Lab.",
      building: "Block 4 (Mech & Civil Complex)",
      floor: "Ground Floor to 3rd Floor",
      roomNumber: "ME-101 to CE-305",
      timings: "9:15 AM – 4:30 PM",
      contact: "hod.mech@cmrcet.ac.in | hod.civil@cmrcet.ac.in",
      distance: "340 m",
      walkingTime: "~4 min",
      latitude: 17.605450,
      longitude: 78.487500,
      image: "pictures/cmrcet block IV.jpeg",
      keywords: ["cmrcet mech", "cmrcet civil", "cmrcet block 4", "block 4", "mech", "mechanical", "civil", "workshop", "cad cam", "som lab", "survey lab", "concrete lab", "hod mech", "hod civil"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk past Block 1 and Block 2 towards the rear North-East academic wing (approx. 300 meters).",
        "Block 4 is situated adjacent to the Mechanical Workshop bays."
      ]
    },

    {
      id: "canteen",
      name: "CMRCET Canteen & Food Court",
      code: "CANTEEN-01",
      category: "Food & Dining",
      description: "Multi-cuisine campus dining facility offering South & North Indian meals, fast food, bakery items, fresh fruit juices, hot beverages, and hygienic open seating area.",
      building: "Central Student Plaza",
      floor: "Ground Level",
      roomNumber: "FC-01",
      timings: "8:00 AM – 6:00 PM (Monday to Saturday)",
      contact: "canteen@cmrcet.ac.in",
      distance: "210 m",
      walkingTime: "~3 min",
      latitude: 17.604450,
      longitude: 78.487050,
      image: "pictures/cmrcet canteen.jpeg",
      keywords: ["cmrcet canteen", "cmrcet food court", "cmrcet cafeteria", "canteen", "food", "cafeteria", "lunch", "snacks", "coffee", "juice", "breakfast", "mess food", "dining"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight for 130 meters to Block 1.",
        "Veer right past the Admin Block portico for 80 meters towards the Central Student Plaza.",
        "The CMRCET Canteen is the large open-front dining facility on your right."
      ]
    },

    {
      id: "placement-cell",
      name: "Training & Placement (T&P) Cell",
      code: "TAP-01",
      category: "Administrative",
      description: "Corporate Relations and Placement Cell coordinating campus recruitment drives, industry internships, soft skills workshops, mock interviews, and company selection processes.",
      building: "Block 1 (Administrative Complex)",
      floor: "Ground Floor (East Wing)",
      roomNumber: "TP-101",
      timings: "9:00 AM – 5:00 PM (Monday to Saturday)",
      contact: "placements@cmrcet.ac.in | +91 92487 27218",
      distance: "135 m",
      walkingTime: "~2 min",
      latitude: 17.604640,
      longitude: 78.486480,
      image: "pictures/cmrcet training and placements office.jpeg",
      keywords: ["cmrcet placements", "cmrcet placement cell", "placement", "placements", "training", "t&p", "tap cell", "internship", "jobs", "recruitment", "interview", "campus drive", "placement officer"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight 130 meters to Block 1.",
        "Enter through the main front portico; the T&P Cell is located immediately to the right on the Ground Floor."
      ]
    },

    {
      id: "sports-complex",
      name: "CMRCET Sports Complex & Athletic Grounds",
      code: "SPORTS-01",
      category: "Sports",
      description: "Extensive sports facilities including cricket stadium with floodlights, football ground, 400m running track, outdoor basketball courts, volleyball courts, and indoor table tennis & badminton halls.",
      building: "West Campus Sports Pavilion",
      floor: "Ground Level & Sports Pavilion",
      roomNumber: "PED-01",
      timings: "6:00 AM – 8:30 AM & 4:00 PM – 7:00 PM",
      contact: "sports@cmrcet.ac.in | Physical Director",
      distance: "380 m",
      walkingTime: "~5 min",
      latitude: 17.603900,
      longitude: 78.485400,
      image: "pictures/cmrcet atheletic grounds.jpeg",
      keywords: ["cmrcet sports", "cmrcet ground", "sports", "ground", "cricket", "football", "basketball", "volleyball", "badminton", "table tennis", "gym", "athletics", "physical director"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Take the dedicated west perimeter road branching immediately to your left.",
        "Walk straight for 350 meters along the paved sports avenue.",
        "The sports pavilion, cricket grounds, and indoor court complex will be on your right."
      ]
    },

    {
      id: "auditorium",
      name: "CMR Central Auditorium & Convention Centre",
      code: "AUD-01",
      category: "Facilities",
      description: "Air-conditioned 2,000-seat auditorium equipped with high-definition laser projectors, surround acoustics, and green rooms for tech fests (AZURA), cultural events, and convocations.",
      building: "Convention Block",
      floor: "Ground & 1st Floor",
      roomNumber: "AUD-MAIN",
      timings: "Open for scheduled college events, seminars, and fests",
      contact: "events@cmrcet.ac.in",
      distance: "190 m",
      walkingTime: "~2 min",
      latitude: 17.604550,
      longitude: 78.486750,
      image: "pictures/cmrcet central auditoriom.jpg",
      keywords: ["cmrcet auditorium", "auditorium", "convention center", "hall", "seminar hall", "azura", "fest", "cultural event", "convocation", "stage"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk straight 130 meters to Block 1.",
        "The Convention Block & Central Auditorium is situated directly adjacent to Block 1 overlooking the central lawn."
      ]
    },

    {
      id: "boys-hostel",
      name: "CMR Campus Boys Hostel",
      code: "HOSTEL-B",
      category: "Residential",
      description: "On-campus residential hostel for male students with attached dining mess, biometric entry, RO drinking water, Wi-Fi, study rooms, solar water heating, and 24/7 security.",
      building: "East Campus Residential Zone",
      floor: "Ground Floor to 4th Floor",
      roomNumber: "BH-101 to BH-420",
      timings: "Hostel Entry Curfew: 8:30 PM sharp",
      contact: "hostel.boys@cmrcet.ac.in | +91 92487 27220",
      distance: "450 m",
      walkingTime: "~6 min",
      latitude: 17.605850,
      longitude: 78.488300,
      image: "pictures/cmrccet boyshostel.jpg",
      keywords: ["cmrcet boys hostel", "boys hostel", "hostel", "accommodation", "dorm", "curfew", "warden", "boys mess", "stay"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk past Block 1 and the Central Library towards the East Campus gate.",
        "Follow the residential avenue for 400 meters to reach the Boys Hostel complex."
      ]
    },

    {
      id: "girls-hostel",
      name: "CMR Campus Girls Hostel",
      code: "HOSTEL-G",
      category: "Residential",
      description: "Dedicated safe residential accommodation for female students with resident lady wardens, biometric access, 24/7 security guard post, dining mess, and fitness room.",
      building: "East Campus Residential Zone (Secure Enclosure)",
      floor: "Ground Floor to 4th Floor",
      roomNumber: "GH-101 to GH-415",
      timings: "Hostel Entry Curfew: 7:30 PM sharp",
      contact: "hostel.girls@cmrcet.ac.in | +91 92487 27222",
      distance: "420 m",
      walkingTime: "~5 min",
      latitude: 17.605650,
      longitude: 78.488100,
      image: null,
      keywords: ["cmrcet girls hostel", "girls hostel", "ladies hostel", "hostel", "curfew", "lady warden", "girls mess", "girls stay"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk past Block 1 and the Central Library towards the East Campus residential zone.",
        "The Girls Hostel is inside the secure gated residential zone on your right."
      ]
    },

    {
      id: "health-centre",
      name: "CMR Campus Health Centre & Medical Clinic",
      code: "MED-01",
      category: "Facilities",
      description: "Medical clinic with qualified resident doctor, staff nurses, first-aid dispensary, emergency observation beds, and 24/7 on-call campus ambulance service.",
      building: "Health Centre (Near Security Gate)",
      floor: "Ground Floor",
      roomNumber: "HC-01",
      timings: "24/7 Emergency | Doctor OPD: 9:00 AM – 4:30 PM",
      contact: "Emergency Ext: 108 | +91 92487 27210",
      distance: "110 m",
      walkingTime: "~1 min",
      latitude: 17.604380,
      longitude: 78.486300,
      image: "pictures/cmrcet campus healthcentre.jpg",
      keywords: ["cmrcet medical", "health centre", "doctor", "clinic", "first aid", "ambulance", "emergency", "nurse", "medicine", "sick room"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk along the main avenue for 100 meters.",
        "The Campus Health Centre is located on the ground level to your left before Block 1."
      ]
    },

    {
      id: "parking",
      name: "CMRCET Student & Faculty Parking Plaza",
      code: "PARK-01",
      category: "Facilities",
      description: "Designated multi-zone parking plaza for two-wheelers and four-wheelers with security surveillance, EV charging points, and dedicated faculty/visitor bays.",
      building: "Main Parking Plaza (Near Gate 1)",
      floor: "Ground Level",
      roomNumber: "P-ZONE",
      timings: "Open 6:30 AM – 7:30 PM",
      contact: "+91 92487 27210 (Security Desk)",
      distance: "40 m",
      walkingTime: "~1 min",
      latitude: 17.604150,
      longitude: 78.485700,
      image: null,
      keywords: ["cmrcet parking", "parking", "parking area", "bike parking", "car parking", "vehicle parking", "ev charging", "two wheeler"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Take the dedicated vehicular service lane immediately on the left.",
        "The CMRCET Parking Plaza is located 40 meters from the gate with designated two-wheeler and four-wheeler bays."
      ]
    },

    {
      id: "innovation-cell",
      name: "Centre for Innovation, Incubation & Entrepreneurship (CIIE)",
      code: "CIIE-01",
      category: "Facilities",
      description: "Start-up incubator providing prototyping equipment, 3D printers, IoT workstations, patent filing guidance, and seed mentorship for student entrepreneurs and innovators.",
      building: "Block 2 (Top Floor)",
      floor: "4th Floor",
      roomNumber: "CIIE-401",
      timings: "9:15 AM – 5:30 PM",
      contact: "ciie@cmrcet.ac.in",
      distance: "260 m",
      walkingTime: "~3 min",
      latitude: 17.605200,
      longitude: 78.486850,
      image: "pictures/cmrcet CIIE.jpeg",
      keywords: ["cmrcet ciie", "innovation", "incubation", "ciie", "startups", "entrepreneurship", "patents", "hackathon", "3d printer", "prototype"],
      routeSteps: [
        "Start from the CMRCET Main Entrance Gate.",
        "Walk to Block 2 (CSE Complex).",
        "Take the elevator to the 4th Floor to enter the CIIE Innovation Hub."
      ]
    }
  ],

  // Official College Rules and Regulations
  rules: [
    {
      id: "rule-attendance",
      title: "Attendance & 75% Regulation",
      category: "Academic",
      icon: "fa-solid fa-clipboard-user",
      summary: "Minimum 75% aggregate attendance is mandatory across all registered subjects to be eligible for End Semester Examinations.",
      details: [
        "Every student must maintain a minimum of 75% aggregate attendance in each semester.",
        "Condonation of shortage of attendance between 65% and 74.9% may be granted by the Academic Committee strictly on valid medical grounds, subject to genuine medical certificate submission within 3 days and payment of condonation fee.",
        "Students having attendance below 65% are NOT eligible for condonation under any circumstances and will be DETAINED in that semester."
      ]
    },
    {
      id: "rule-idcard",
      title: "ID Card & Dress Code Policy",
      category: "General",
      icon: "fa-solid fa-id-card",
      summary: "Wearing the official CMRCET RFID Identity Card around the neck is strictly mandatory at all times inside campus.",
      details: [
        "Students must wear their official college ID card around their neck from entry at the Main Gate until departure from campus.",
        "Security staff and faculty are authorized to check ID cards at entrance gates, library, exam halls, and laboratories.",
        "Formal and decent dress code must be strictly adhered to on all working days.",
        "In case of lost ID card, students must apply for a duplicate ID card at the Accounts Counter (Block 1) after paying the replacement fee."
      ]
    },
    {
      id: "rule-library",
      title: "Library Rules & Book Borrowing Policy",
      category: "Facilities",
      icon: "fa-solid fa-book-open",
      summary: "UG students can borrow 4 books for 14 days; strict silence and no food/beverages in reading halls.",
      details: [
        "Undergraduate (B.Tech) students can borrow up to 4 books for a loan period of 14 days.",
        "Postgraduate (M.Tech / MBA) students can borrow up to 6 books for a period of 28 days.",
        "Overdue fine of ₹1 per day per book will be charged after the due date.",
        "Absolute silence must be maintained in the reading and reference halls.",
        "Personal books, bags, and food items are not allowed inside the stack area; must be deposited at the property counter.",
        "Valid college ID card must be presented at the circulation counter for issue and return of books."
      ]
    },
    {
      id: "rule-exam",
      title: "Examination Cell & Hall Regulations",
      category: "Examination",
      icon: "fa-solid fa-file-pen",
      summary: "Strict zero-tolerance policy against malpractice; mobile phones, smartwatches, and unauthorized materials strictly banned.",
      details: [
        "Students must carry both their official Hall Ticket and College ID Card to enter the examination hall.",
        "Entry into the examination hall is permitted up to 15 minutes before the exam starts. No student is allowed entry after 15 minutes of exam commencement.",
        "Mobile phones, smartwatches, programmable calculators, and notes are strictly prohibited inside the exam hall.",
        "Any form of malpractice or possession of prohibited materials will result in immediate confiscation, cancellation of current exam, and disciplinary action by the Malpractice Committee as per UGC autonomous guidelines."
      ]
    },
    {
      id: "rule-antiragging",
      title: "Anti-Ragging Policy & Regulations",
      category: "Discipline",
      icon: "fa-solid fa-shield-halved",
      summary: "CMRCET is a 100% Ragging-Free Campus. Ragging in any form is a cognizable criminal offense.",
      details: [
        "Ragging within or outside the campus or hostels is strictly prohibited by law (Supreme Court & UGC Regulations).",
        "Anyone found indulging in ragging will face immediate suspension, rustication from college, and lodging of an FIR with the Medchal Police Station.",
        "24/7 Anti-Ragging Squad conducts continuous surveillance across academic blocks, canteens, bus stops, and hostels.",
        "Anti-Ragging Toll-Free Helpline: 1800-180-5522 | CMRCET Anti-Ragging Coordinator: +91 92487 27210."
      ]
    },
    {
      id: "rule-hostel",
      title: "Hostel Entry & Living Regulations",
      category: "Residential",
      icon: "fa-solid fa-hotel",
      summary: "Strict entry curfew: 7:30 PM for Girls and 8:30 PM for Boys; biometric attendance compulsory.",
      details: [
        "Night curfew timings: Girls Hostel closes at 7:30 PM; Boys Hostel closes at 8:30 PM.",
        "Biometric night attendance is taken between 8:00 PM and 9:00 PM daily.",
        "Day out / night out permissions require prior written approval / SMS confirmation from parents to the Hostel Warden.",
        "Electrical heating appliances and cooking inside rooms are strictly banned."
      ]
    }
  ],

  // Student Procedures & Guidelines
  procedures: [
    {
      id: "proc-bonafide",
      title: "How to Apply for Bonafide / Study Certificate",
      category: "Certificates",
      icon: "fa-solid fa-certificate",
      summary: "Procedure to obtain Bonafide, Study, and Conduct Certificate for bus passes, passports, or scholarships.",
      steps: [
        "Collect the Bonafide Application Form from the Student Counter in Block 1 (Ground Floor) or download it from the student portal.",
        "Fill in your Name, Roll Number, Branch, Year & Semester, and the purpose of the certificate.",
        "Attach a photocopy of your current semester fee receipt and College ID Card.",
        "Submit the form at the Student Affairs Counter (Block 1).",
        "The signed and stamped Bonafide Certificate will be issued within 1 to 2 working days."
      ]
    },
    {
      id: "proc-fee-payment",
      title: "Tuition & Examination Fee Payment Procedure",
      category: "Accounts",
      icon: "fa-solid fa-indian-rupee-sign",
      summary: "Steps to pay college tuition fee, exam fee, and transport fee online or offline.",
      steps: [
        "Online Mode: Visit the CMRCET website (cmrcet.ac.in) and click on 'Online Fee Payment' (SBI Collect / College ERP Portal).",
        "Select category (Tuition Fee / Exam Fee / Transport Fee) and enter your Roll Number.",
        "Verify student details displayed and proceed with Net Banking, UPI, or Credit/Debit Card.",
        "Save and print the e-receipt for your records.",
        "Offline Mode: Pay via Demand Draft (DD) in favor of 'Principal, CMR College of Engineering & Technology' payable at Hyderabad at Accounts Counter (Block 1)."
      ]
    },
    {
      id: "proc-tc-migration",
      title: "Procedure for Transfer Certificate (TC) & Migration",
      category: "Graduation",
      icon: "fa-solid fa-file-export",
      summary: "Steps to obtain No-Dues clearance, TC, and Migration Certificate after completion of course.",
      steps: [
        "Obtain the No Dues Clearance Form from the Examination Branch or Admin Office.",
        "Get signatures and clearance stamps from: Central Library (return all books), Respective Department HOD & Labs, Physical Education / Sports Department, Hostel Warden (if applicable), and Accounts Section.",
        "Submit the completed No Dues form along with original ID card and fee clearance receipt at the Admin Office (Block 1).",
        "Collect your TC and Migration Certificate within 3 to 5 working days."
      ]
    },
    {
      id: "proc-bus-pass",
      title: "College Bus Route & Transport Enrollment",
      category: "Transport",
      icon: "fa-solid fa-bus-simple",
      summary: "Procedure to register for college bus facility covering 40+ routes across Hyderabad & Secunderabad.",
      steps: [
        "Check the official route list and boarding timings on the college portal or Transport Notice Board at Main Gate.",
        "Collect the Bus Registration Form from the Transport In-Charge Office (Near Main Gate).",
        "Pay the prescribed annual transport fee at the Accounts Counter or online via ERP.",
        "Submit the form with payment receipt and 2 passport-size photographs to receive your laminated College Bus Pass."
      ]
    },
    {
      id: "proc-hall-ticket",
      title: "How to Download Examination Hall Ticket",
      category: "Examination",
      icon: "fa-solid fa-file-arrow-down",
      summary: "Step-by-step method to obtain your autonomous semester examination hall ticket.",
      steps: [
        "Ensure all semester tuition fees and exam fees have been cleared.",
        "Confirm that your aggregate semester attendance is at or above 75%.",
        "Log in to the CMRCET Student Examination Portal (exams.cmrcet.ac.in) using your Roll Number and password.",
        "Click on 'Download Hall Ticket' under the active semester examination tab.",
        "Print the hall ticket in clear A4 format and ensure your photograph and subject codes are clearly visible."
      ]
    }
  ],

  // Announcements & College Updates
  announcements: [
    {
      id: "ann-01",
      title: "B.Tech End Semester Autonomous Examinations Timetable Released",
      category: "Exam",
      priority: "Urgent",
      date: "2026-09-25",
      time: "11:30 AM",
      isNew: true,
      description: "The Controller of Examinations (CoE) has officially published the autonomous end-semester examination timetables for all B.Tech branches (II, III & IV Years). Students can view and download the schedule from the exam portal.",
      author: "Examination Branch, CMRCET"
    },
    {
      id: "ann-02",
      title: "National Level Technical Symposium 'AZURA 2026' Registrations Open",
      category: "Event",
      priority: "High",
      date: "2026-09-24",
      time: "02:00 PM",
      isNew: true,
      description: "Registrations are now open for CMRCET's flagship annual technical fest AZURA 2026. Events include 24-Hour AI Hackathon, Robo-Wars, Paper Presentations, and Coding Competitions. Cash prizes worth ₹2,50,000 to be won!",
      author: "Student Affairs & Tech Council"
    },
    {
      id: "ann-03",
      title: "Campus Recruitment Drive — Tier-1 Tech Companies Schedule",
      category: "Placement",
      priority: "High",
      date: "2026-09-22",
      time: "10:00 AM",
      isNew: false,
      description: "Training & Placement Cell announces upcoming on-campus recruitment rounds for final-year students by leading multinational product and consulting firms. Eligible registered students must report in formals with resumes.",
      author: "Training & Placement Cell"
    },
    {
      id: "ann-04",
      title: "Central Digital Library Extended Timings for Semester Preparation",
      category: "Academic",
      priority: "Normal",
      date: "2026-09-20",
      time: "04:30 PM",
      isNew: false,
      description: "To assist students with semester exam preparation, the CMRCET Central Library reading halls and digital resource nodes will remain open up to 8:30 PM on all working days and on Sundays from 9:30 AM to 4:30 PM.",
      author: "Chief Librarian, CMRCET"
    },
    {
      id: "ann-05",
      title: "Public Holiday Notice — Gandhi Jayanti",
      category: "Holiday",
      priority: "Normal",
      date: "2026-09-18",
      time: "05:00 PM",
      isNew: false,
      description: "The college will remain closed on October 2, 2026 on account of Gandhi Jayanti. Regular classes and laboratory sessions will resume on the next working day.",
      author: "Principal's Office"
    }
  ],

  // Academic Departments
  departments: [
    {
      id: "dept-cse",
      name: "Computer Science & Engineering (CSE)",
      code: "CSE",
      hod: "Dr. K. Vijaya Kumar",
      location: "Block 2, 2nd Floor (Room CSE-201)",
      intake: "240 Seats",
      programs: "B.Tech CSE, M.Tech CSE",
      email: "hod.cse@cmrcet.ac.in",
      description: "Premier department focusing on Artificial Intelligence, Cloud Systems, Full-Stack Software Engineering, and High-Performance Computing."
    },
    {
      id: "dept-aiml",
      name: "CSE (Artificial Intelligence & Machine Learning)",
      code: "AIML",
      hod: "Dr. M. Suresh",
      location: "Block 2, 3rd Floor (Room AI-301)",
      intake: "180 Seats",
      programs: "B.Tech CSE (AI & ML)",
      email: "hod.aiml@cmrcet.ac.in",
      description: "Specialized branch with state-of-the-art NVIDIA GPU research labs covering Deep Learning, NLP, Computer Vision, and Robotics."
    },
    {
      id: "dept-ds",
      name: "CSE (Data Science)",
      code: "DS",
      hod: "Dr. P. Ramesh",
      location: "Block 2, 4th Floor (Room DS-401)",
      intake: "120 Seats",
      programs: "B.Tech CSE (Data Science)",
      email: "hod.ds@cmrcet.ac.in",
      description: "Advanced curriculum covering Big Data Analytics, Predictive Modeling, Business Intelligence, and Statistical Computing."
    },
    {
      id: "dept-ece",
      name: "Electronics & Communication Engineering (ECE)",
      code: "ECE",
      hod: "Dr. B. Latha",
      location: "Block 3, 2nd Floor (Room ECE-201)",
      intake: "240 Seats",
      programs: "B.Tech ECE, M.Tech VLSI",
      email: "hod.ece@cmrcet.ac.in",
      description: "Covers VLSI Design, Embedded Systems, IoT, Wireless 5G Communications, and Signal Processing."
    },
    {
      id: "dept-eee",
      name: "Electrical & Electronics Engineering (EEE)",
      code: "EEE",
      hod: "Dr. S. Venkat",
      location: "Block 3, 3rd Floor (Room EEE-301)",
      intake: "60 Seats",
      programs: "B.Tech EEE, M.Tech Power Systems",
      email: "hod.eee@cmrcet.ac.in",
      description: "Focus on Renewable Green Energy, Smart Grid Systems, Electric Vehicles (EV), and Industrial Power Automation."
    },
    {
      id: "dept-mech",
      name: "Mechanical Engineering (MECH)",
      code: "ME",
      hod: "Dr. G. Ravi",
      location: "Block 4, 1st Floor (Room ME-101)",
      intake: "60 Seats",
      programs: "B.Tech MECH, M.Tech Thermal Engg",
      email: "hod.mech@cmrcet.ac.in",
      description: "Hands-on engineering in Robotics, 3D CAD/CAM, Mechatronics, Automotive Design, and Advanced Thermal Engineering."
    },
    {
      id: "dept-civil",
      name: "Civil Engineering (CIVIL)",
      code: "CE",
      hod: "Dr. T. Srinivas",
      location: "Block 4, 2nd Floor (Room CE-201)",
      intake: "60 Seats",
      programs: "B.Tech Civil, M.Tech Structural Engg",
      email: "hod.civil@cmrcet.ac.in",
      description: "Specialized in Structural Engineering, Geotechnical Analysis, GIS Mapping, Smart City Infrastructure, and Environmental Engineering."
    },
    {
      id: "dept-hs",
      name: "Humanities & Sciences (H&S / 1st Year)",
      code: "H&S",
      hod: "Dr. N. Sarada",
      location: "Block 1, 2nd Floor (Room HS-201)",
      intake: "All 1st Year Students",
      programs: "First-Year Foundation Courses",
      email: "hod.hs@cmrcet.ac.in",
      description: "Nurturing fundamental engineering concepts in Mathematics, Physics, Chemistry, Professional English, and Programming."
    },
    {
      id: "dept-mba",
      name: "Master of Business Administration (MBA)",
      code: "MBA",
      hod: "Dr. A. Sudhakar",
      location: "Block 1, 3rd Floor (Room MBA-301)",
      intake: "120 Seats",
      programs: "MBA (Finance, HR, Marketing, Business Analytics)",
      email: "hod.mba@cmrcet.ac.in",
      description: "Premier management program fostering future corporate leaders, entrepreneurs, and financial strategists."
    }
  ]
};

// Global active data instance initialized from localStorage if customized
let collegeData = null;

function loadCollegeData() {
  try {
    const saved = localStorage.getItem('cmrcet_storage_v2');
    if (saved) {
      collegeData = JSON.parse(saved);
      // Ensure verified CMRCET coordinates, keywords, and authentic photos are always synced
      if (collegeData && collegeData.locations) {
        collegeData.locations.forEach(loc => {
          const defaultLoc = defaultCollegeData.locations.find(dl => dl.id === loc.id);
          if (defaultLoc) {
            loc.latitude = defaultLoc.latitude;
            loc.longitude = defaultLoc.longitude;
            loc.keywords = defaultLoc.keywords;
            // Sync default photo if location has no image or points to a previous default path
            if ((!loc.image || loc.image.startsWith('pictures/') || loc.image.startsWith('pictutres/')) && defaultLoc.image) {
              loc.image = defaultLoc.image;
            }
            if (defaultLoc.gallery) {
              loc.gallery = defaultLoc.gallery;
            }
          }
        });
      }
    } else {
      collegeData = JSON.parse(JSON.stringify(defaultCollegeData));
    }
  } catch (e) {
    console.error("Error loading college data from localStorage:", e);
    collegeData = JSON.parse(JSON.stringify(defaultCollegeData));
  }
}

function saveCollegeData() {
  try {
    localStorage.setItem('cmrcet_storage_v2', JSON.stringify(collegeData));
  } catch (e) {
    console.error("Error saving college data to localStorage:", e);
  }
}

// Initial load
loadCollegeData();
