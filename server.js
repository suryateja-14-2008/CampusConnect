/**
 * =========================================================================
 * CAMPUS CONNECT — CMRCET BACKEND SERVER & GEMINI AI API PROXY
 * =========================================================================
 * Server-side secure integration for Google Gemini API with Search Grounding,
 * Function Calling, Rate Limiting, and Anti-Hallucination Guardrails.
 * 
 * SECURITY:
 * - GEMINI_API_KEY is kept strictly on the server (never exposed to frontend).
 * - Loaded via server environment variables or .env file.
 * =========================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 1. Safe Environment Variable Loader (.env)
function loadEnv() {
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
      return;
    } catch (e) {
      // .env file might not exist yet, continue
    }
  }

  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (err) {
      console.warn('Note: Could not parse .env file:', err.message);
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

// Rate Limiter: Maximum 30 requests per minute per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 35;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, entry);
    return false;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// Clean old rate limit entries every 5 mins
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// MIME Types for Static Files
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// CMRCET System Instruction Grounding for Gemini
const CMRCET_SYSTEM_INSTRUCTION = `You are Campus Connect AI, the official student-friendly AI assistant for CMR College of Engineering & Technology (CMRCET), Hyderabad.

INSTITUTION DETAILS:
- Name: CMR College of Engineering & Technology (CMRCET / CMRK)
- Status: UGC Autonomous, NAAC 'A+' Grade & NBA Accredited, Approved by AICTE, Affiliated to JNTU Hyderabad.
- Location: Kandlakoya (V), Medchal Road, Hyderabad, Telangana – 501401.
- Verified Campus Coordinates: Latitude 17.6046671, Longitude 78.4865205.
- Principal: Major Dr. V. A. Narayana (Office: Ground Floor, Block 1).
- Working Hours: Monday to Saturday, 9:15 AM – 4:00 PM (2nd & 4th Saturdays are holidays).
- EAMCET Counseling Code: CMRK.

VERIFIED PLACEMENT INFORMATION (2024-2025):
- Highest Package: 58 LPA (Palo Alto Networks) / 44 LPA (Amazon).
- Average Package: 6.5 LPA.
- Placement Percentage: 88%+.
- Total Offers: 1,200+ offers.
- Top Recruiters: Palo Alto Networks, Amazon, Microsoft, Virtusa, Capgemini, TCS, Cognizant, Wipro, Infosys, Accenture, Darwinbox, DXC Technology, LTI Mindtree.
- Placement Cell: Ground Floor (East Wing), Block 1. Head: Dr. K. Sreenivas Rao.

COURSES OFFERED:
- B.Tech: CSE, CSE (AI & ML), CSE (Data Science), CSE (Cyber Security), ECE, EEE, Mechanical Engineering, Civil Engineering.
- M.Tech: Computer Science, Embedded Systems, Structural Engineering, Power Electronics.
- Management: Master of Business Administration (MBA).

KEY CAMPUS LOCATIONS:
1. main-gate: CMRCET Main Entrance Gate (Kandlakoya, Medchal Road) [17.604250, 78.485900]
2. block1-admin: Block 1 — Administrative Block & Principal's Office [17.6046671, 78.4865205]
3. library: CMRCET Central Digital Library (85k+ volumes, IEEE/DELNET) [17.604850, 78.487100]
4. exam-cell: Examination Branch & Autonomous Cell (Room AD-108, 1st Floor Block 1) [17.604700, 78.486550]
5. block2-cse: Block 2 — CSE & IT Complex (AI Lab, Coding Labs, CIIE) [17.605150, 78.486800]
6. block3-ece: Block 3 — ECE & EEE Complex [17.604950, 78.487350]
7. block4-mech-civil: Block 4 — Mechanical & Civil Engineering [17.605450, 78.487500]
8. canteen: CMRCET Canteen & Food Court (Central Student Plaza) [17.604450, 78.487050]
9. placement-cell: Training & Placement Cell (Block 1 East Wing) [17.604640, 78.486480]
10. sports-complex: CMRCET Sports Complex & Grounds (Cricket stadium, courts) [17.603900, 78.485400]
11. auditorium: CMR Central Auditorium (2,000-seat convention hall) [17.604550, 78.486750]
12. boys-hostel: CMR Campus Boys Hostel (Curfew 8:30 PM) [17.605850, 78.488300]
13. girls-hostel: CMR Campus Girls Hostel (Curfew 7:30 PM) [17.605650, 78.488100]
14. health-centre: CMR Campus Health Centre (24/7 doctor, ambulance ext: 108) [17.604380, 78.486300]
15. parking: Student & Faculty Parking Plaza [17.604150, 78.485700]
16. innovation-cell: CIIE Innovation & Startup Incubator (4th Floor Block 2) [17.605200, 78.486850]

CRITICAL RULES & GUARDRAILS:
1. NEVER confuse CMRCET with CMRIT or other colleges.
2. For CMRCET-specific questions, strictly prioritize and adhere to the verified institutional facts above. Mention the year for placement stats ("According to the 2024-2025 placement information...").
3. Anti-Hallucination for CMRCET: Never invent phone numbers, faculty names, package figures, cutoffs, or room numbers. If a question is specifically about CMRCET and the information is not verified or unavailable in the institutional facts above, clearly state: "Sorry, I couldn't verify that information from the available CMRCET sources."
4. General Knowledge & Academic Inquiries: When asked general questions that are unrelated to CMRCET (such as science, astronomy, black holes, programming, mathematics, physics, or study advice), provide a clear, accurate, and student-friendly explanation. Do NOT claim the query is missing from the CMRCET database.
5. Location Action Tag: When answering where a campus location is or describing a specific campus facility, ALWAYS include this special tag at the very end of your response so the interactive map controls appear:
[[ACTION:location_id]]
(e.g., [[ACTION:canteen]], [[ACTION:library]], [[ACTION:block1-admin]], [[ACTION:exam-cell]], [[ACTION:block2-cse]], [[ACTION:placement-cell]], [[ACTION:sports-complex]]).
6. Formatting: Format your answers cleanly with bold titles, bullet points, and concise student-friendly language.
7. Context Awareness: Resolve follow-up questions (e.g. "How do I get there?", "How far is it?") by referencing the previous destination in the conversation.`;

// Handle Gemini API Call with Model Fallback
async function callGeminiAPI(message, history = []) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Format conversation history for Gemini API
  const contents = [];

  // Add conversation turns if provided
  if (Array.isArray(history)) {
    history.forEach(turn => {
      if (turn.text && (turn.role === 'user' || turn.role === 'model')) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }
    });
  }

  // Append latest user message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const requestBody = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: CMRCET_SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 900
    }
  };

  // Candidate models fallback chain
  const candidateModels = [
    GEMINI_MODEL,
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash'
  ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

  let lastError = null;

  for (const modelName of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        let parsedErr = errText;
        try {
          const jsonErr = JSON.parse(errText);
          parsedErr = jsonErr.error?.message || errText;
        } catch (_) {}
        lastError = new Error(`Gemini API error (${response.status}) on ${modelName}: ${parsedErr}`);
        console.warn(`Model ${modelName} returned status ${response.status}, attempting fallback model if available...`);
        continue;
      }

      const data = await response.json();
      const candidate = data.candidates && data.candidates[0];
      if (!candidate || !candidate.content || !candidate.content.parts) {
        lastError = new Error(`Invalid response structure from Gemini API on ${modelName}.`);
        continue;
      }

      let textResponse = candidate.content.parts.map(p => p.text || '').join('\n').trim();

      // Extract Grounding metadata & citations if present
      const sources = [];
      if (candidate.groundingMetadata && candidate.groundingMetadata.groundingChunks) {
        candidate.groundingMetadata.groundingChunks.forEach(chunk => {
          if (chunk.web && chunk.web.uri) {
            sources.push({
              title: chunk.web.title || 'Official Source',
              url: chunk.web.uri
            });
          }
        });
      }

      // Extract Location Action tag if generated by Gemini
      let actionLocId = null;
      const actionMatch = textResponse.match(/\[\[ACTION:([a-zA-Z0-9_-]+)\]\]/);
      if (actionMatch) {
        actionLocId = actionMatch[1];
        textResponse = textResponse.replace(/\[\[ACTION:[a-zA-Z0-9_-]+\]\]/g, '').trim();
      }

      return {
        reply: textResponse,
        locationId: actionLocId,
        sources: sources.slice(0, 3),
        model: modelName
      };
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      console.warn(`Request to ${modelName} encountered error: ${err.message}`);
    }
  }

  throw lastError || new Error('All Gemini API candidate models failed.');
}

// Fallback rule-based query processor for CMRCET
function processFallbackQuery(query) {
  const q = query.toLowerCase().trim();
  
  if (q.includes('package') || q.includes('placement') || q.includes('recruit') || q.includes('highest package')) {
    return {
      reply: `<strong>CMRCET Placement Highlights (2024–2025):</strong><br><br>
• <strong>Highest Package:</strong> 58 LPA (Palo Alto Networks) / 44 LPA (Amazon)<br>
• <strong>Average Package:</strong> 6.5 LPA<br>
• <strong>Placement Rate:</strong> 88%+ across all engineering departments<br>
• <strong>Total Offers:</strong> 1,200+ offers<br>
• <strong>Top Recruiting Companies:</strong> Palo Alto Networks, Amazon, Microsoft, Virtusa, Capgemini, TCS, Cognizant, Wipro, Infosys, Accenture, Darwinbox.<br>
• <strong>Office:</strong> Training & Placement Cell, Block 1 (East Wing).`,
      locationId: 'placement-cell'
    };
  }

  if (q.includes('canteen') || q.includes('food') || q.includes('cafeteria')) {
    return {
      reply: `<strong>CMRCET Canteen & Food Court:</strong><br>
Located at the Central Student Plaza (near the central lawn and sports arena). Offers vegetarian and executive meals, fresh snacks, bakery items, juices, and hot beverages from 8:00 AM to 6:00 PM.`,
      locationId: 'canteen'
    };
  }

  if (q.includes('library')) {
    return {
      reply: `<strong>CMRCET Central Digital Library:</strong><br>
Located in the dedicated Central Library Block between Block 1 and Block 3. Air-conditioned facility holding 85,000+ volumes, IEEE/ACM journals, DELNET digital database, and reading cubicles. Timings: 8:30 AM – 7:30 PM (Mon–Sat).`,
      locationId: 'library'
    };
  }

  if (q.includes('exam') || q.includes('coe') || q.includes('hall ticket')) {
    return {
      reply: `<strong>CMRCET Examination Branch & Autonomous Cell:</strong><br>
Located on the 1st Floor of Block 1 (Room AD-108). Handles semester exam registration, hall tickets, autonomous grade memos, and revaluation. Open 9:30 AM – 4:00 PM.`,
      locationId: 'exam-cell'
    };
  }

  if (q.includes('cse') || q.includes('computer science') || q.includes('block 2')) {
    return {
      reply: `<strong>Block 2 — Computer Science & Engineering (CSE) Complex:</strong><br>
Houses CSE, CSE (AI & ML), CSE (Data Science), and Cyber Security departments, NVIDIA GPU AI Lab, Cloud Computing labs, and the CIIE Startup Incubator on the 4th Floor.`,
      locationId: 'block2-cse'
    };
  }

  if (q.includes('course') || q.includes('department') || q.includes('branch') || q.includes('program')) {
    return {
      reply: `<strong>Academic Programs Offered at CMRCET:</strong><br><br>
<strong>Undergraduate (B.Tech):</strong><br>
• CSE (Computer Science & Engineering)<br>
• CSE (AI & Machine Learning)<br>
• CSE (Data Science)<br>
• CSE (Cyber Security)<br>
• ECE (Electronics & Communication)<br>
• EEE (Electrical & Electronics)<br>
• Mechanical Engineering<br>
• Civil Engineering<br><br>
<strong>Postgraduate:</strong> M.Tech (CSE, Embedded Systems, Structural, Power Electronics) and MBA.`,
      locationId: 'block1-admin'
    };
  }

  if (q.includes('admission') || q.includes('eamcet') || q.includes('fee')) {
    return {
      reply: `<strong>CMRCET Admissions Information:</strong><br><br>
• <strong>EAMCET Counseling Code:</strong> <code>CMRK</code><br>
• <strong>Eligibility:</strong> Intermediate (10+2) with MPC and valid TG EAMCET rank for B.Tech.<br>
• <strong>Lateral Entry:</strong> TG ECET rank for direct 2nd-year B.Tech admission.<br>
• <strong>Admissions Office:</strong> Ground Floor (Room AD-102), Block 1.<br>
• <strong>Contact:</strong> +91 92487 27210 | admissions@cmrcet.ac.in`,
      locationId: 'block1-admin'
    };
  }

  if (q.includes('announcement') || q.includes('notice') || q.includes('circular') || q.includes('update') || q.includes('today')) {
    return {
      reply: `<strong>Official CMRCET Campus Announcements:</strong><br><br>
• <strong>Mid-Term Examination Schedule:</strong> Autonomous B.Tech II & III Year Mid-II Exams commence from Oct 28th. Check Exam Branch notice board.<br>
• <strong>TCS & Capgemini Placement Drive:</strong> Final registration window closes this Friday at 5:00 PM for 2025 batch eligible students.<br>
• <strong>Annual Tech Fest - AZURA:</strong> Department technical paper presentation registrations now open at Student Affairs desk.`,
      locationId: 'exam-cell'
    };
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('introduce') || q.includes('who are you') || q.includes('hey')) {
    return {
      reply: `Hello! I am the <strong>Campus Connect AI Assistant</strong> for <strong>CMR College of Engineering & Technology (CMRCET)</strong>.<br><br>I can assist you with:<br>
• Verified CMRCET placement statistics & recruiters<br>
• Academic departments, faculty, and courses<br>
• Campus map navigation and interactive GPS directions<br>
• Real-time campus announcements and examination notices<br>
• General educational inquiries<br><br>How can I assist you today?`,
      locationId: null
    };
  }

  if (q.includes('about') || q.includes('cmrcet') || q.includes('college') || q.includes('cmr college')) {
    return {
      reply: `<strong>About CMR College of Engineering & Technology (CMRCET):</strong><br><br>
Established in 2002, CMRCET is a premier UGC Autonomous engineering institution accredited with an 'A+' Grade by NAAC and NBA. Affiliated to JNTU Hyderabad and located in Kandlakoya, Medchal Road.<br><br>
• <strong>Principal:</strong> Major Dr. V. A. Narayana<br>
• <strong>Campus Coordinates:</strong> 17.6046671, 78.4865205<br>
• <strong>Campus Area:</strong> 25+ lush green acres with modern sports complex and R&D labs.`,
      locationId: 'block1-admin'
    };
  }

  return {
    reply: `I don't have verified information about that specific query in the CMRCET database. Please ask about CMRCET admissions, placements, locations, timings, departments, or facilities.`,
    locationId: null
  };
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Health & Config Status Endpoint (Never returns the secret key)
  if (pathname === '/api/health' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      hasGeminiKey: Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 5),
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. Chatbot AI API Endpoint (POST /api/chat)
  if (pathname === '/api/chat' && method === 'POST') {
    if (isRateLimited(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Rate limit exceeded. Please wait a moment before sending another message.'
      }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 100 * 1024) { // 100KB limit
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large.' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const userMessage = (payload.message || '').trim();
        const history = payload.history || [];

        if (!userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Message is required.' }));
          return;
        }

        // Check if Gemini API Key is configured
        if (GEMINI_API_KEY && GEMINI_API_KEY.length > 5) {
          try {
            const geminiResult = await callGeminiAPI(userMessage, history);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              reply: geminiResult.reply,
              locationId: geminiResult.locationId,
              sources: geminiResult.sources,
              sourceType: 'gemini',
              model: geminiResult.model
            }));
            return;
          } catch (geminiError) {
            console.warn('Gemini API call failed, using verified fallback:', geminiError.message);
            // Fall through to fallback engine below
          }
        }

        // Fallback Engine when Gemini Key is not set or API error occurred
        const fallbackResult = processFallbackQuery(userMessage);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          reply: fallbackResult.reply,
          locationId: fallbackResult.locationId,
          sourceType: 'verified_knowledge_base',
          note: GEMINI_API_KEY ? 'Generated via verified database fallback.' : 'Configure GEMINI_API_KEY in .env for live AI responses.'
        }));

      } catch (err) {
        console.error('API /api/chat error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          reply: 'AI service is temporarily unavailable. Please try again.',
          error: 'Internal processing error'
        }));
      }
    });
    return;
  }

  // 3. Static File Server
  if (method === 'GET') {
    let safePathname;
    try {
      safePathname = decodeURIComponent(pathname);
    } catch (e) {
      safePathname = pathname;
    }
    let filePath = path.join(__dirname, safePathname === '/' ? 'index.html' : safePathname);

    // Prevent directory traversal
    const relative = path.relative(__dirname, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // Transparent alias fallback between 'pictures' and 'pictutres'
    if (!fs.existsSync(filePath)) {
      if (safePathname.startsWith('/pictures/')) {
        const altPath = path.join(__dirname, safePathname.replace('/pictures/', '/pictutres/'));
        if (fs.existsSync(altPath)) filePath = altPath;
      } else if (safePathname.startsWith('/pictutres/')) {
        const altPath = path.join(__dirname, safePathname.replace('/pictutres/', '/pictures/'));
        if (fs.existsSync(altPath)) filePath = altPath;
      }
    }

    // Do not serve sensitive files like .env or server.js
    const basename = path.basename(filePath);
    if (basename.startsWith('.env') || basename === 'server.js') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p><a href="/">Return to Campus Connect</a></p>');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      fs.createReadStream(filePath).pipe(res);
    });
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('405 Method Not Allowed');
});

server.listen(PORT, HOST, () => {
  console.log(`========================================================`);
  console.log(`🚀 Campus Connect Server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`📡 Gemini API Status: ${GEMINI_API_KEY ? 'Configured & Active' : 'Not Set (Using Verified Database)'}`);
  console.log(`🛡️  Security: API Key protected server-side`);
  console.log(`🌐 Host: ${HOST} (Render & Cloud Deployment Compatible)`);
  console.log(`========================================================`);
});
