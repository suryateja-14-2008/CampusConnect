/**
 * =========================================================================
 * CAMPUS CONNECT AI — CMRCET GEMINI AI ASSISTANT & CHAT ENGINE
 * =========================================================================
 * Multi-Turn Conversation Memory, Google Search Grounding, Interactive
 * Map & Navigation Action Integration, and Anti-Hallucination Guardrails.
 * =========================================================================
 */

class CampusConnectAIEngine {
  constructor() {
    this.fallbackMessage = "Sorry, I couldn't verify that information from the available CMRCET sources.";
    this.unknownLocationMessage = "Sorry, this location is not available in the Campus Connect information.";

    // Speech Synthesis
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.ttsEnabled = typeof localStorage !== 'undefined' ? localStorage.getItem('cmrcet_tts_enabled') === 'true' : false;

    // Multi-turn conversation memory
    this.history = [];
    this.maxHistoryTurns = 10;
    this.lastMentionedLocationId = null;

    // Off-topic keywords to immediately reject
    this.outOfScopeKeywords = [
      "cricket match", "who won", "score", "recipe", "bake", "cake", "movie",
      "song", "president of", "capital of", "who is elon", "bitcoin", "crypto", "stock price",
      "write a poem", "who is messi", "who is ronaldo", "ipl", "fifa", "horoscope", "astrology"
    ];
  }

  // Text cleaner
  cleanText(text) {
    return text.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  }

  isOutOfScope(cleaned) {
    return this.outOfScopeKeywords.some(keyword => cleaned.includes(keyword));
  }

  // Get active data (ensures dynamically added admin items are included)
  getData() {
    if (typeof collegeData !== 'undefined' && collegeData) {
      return collegeData;
    }
    if (typeof defaultCollegeData !== 'undefined') {
      return defaultCollegeData;
    }
    return {};
  }

  // Helper to generate chatbot actionable navigation buttons
  renderLocationActionButtons(locId) {
    if (!locId) return '';
    return `
      <div class="chat-location-actions" style="margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm" onclick="openLocationDetailsModal('${locId}')">
          <i class="fa-solid fa-circle-info"></i> View Details
        </button>
        <button class="btn btn-secondary btn-sm" onclick="showRouteForLocation('${locId}')">
          <i class="fa-solid fa-route"></i> View Route
        </button>
        <button class="btn btn-primary btn-sm" onclick="startNavigationToLocation('${locId}')">
          <i class="fa-solid fa-diamond-turn-right"></i> Start Navigation
        </button>
      </div>
    `;
  }

  // Helper to render Grounded Search Sources
  renderSourcesBadge(sources) {
    if (!Array.isArray(sources) || sources.length === 0) return '';
    const tags = sources.map(s => `
      <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="chat-source-tag" title="${escapeHtml(s.title || 'Source')}">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> ${escapeHtml(s.title || 'Official College Source')}
      </a>
    `).join(' ');

    return `
      <div class="chat-sources-container">
        <span class="chat-sources-label"><i class="fa-solid fa-globe"></i> Grounded Web Sources:</span>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
          ${tags}
        </div>
      </div>
    `;
  }

  // Markdown to HTML formatter for AI responses
  formatMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Convert markdown headers
    html = html.replace(/^### (.*$)/gim, '<h4 style="color:var(--accent-secondary); margin:8px 0 4px; font-size:0.95rem;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="color:var(--text-primary); margin:10px 0 6px; font-size:1.05rem;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="color:var(--text-primary); margin:12px 0 6px; font-size:1.15rem;">$1</h2>');

    // Bold & italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bullet lists
    html = html.replace(/^\s*[-•*]\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gms, '<ul class="chat-list">$1</ul>');
    // Deduplicate nested ul tags
    html = html.replace(/<\/ul>\s*<ul class="chat-list">/g, '');

    // Numbered lists
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

    // Paragraph line breaks (preserving existing HTML tags)
    html = html.split('\n\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<div') || p.startsWith('<table')) {
        return p;
      }
      return `<p style="margin-bottom:6px;">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return html;
  }

  // Resolve follow-up pronouns/references (e.g., "How do I get there?" -> previous location)
  resolveContextualQuery(rawQuery) {
    const cleaned = this.cleanText(rawQuery);
    
    // Follow-up location query targeting previous location
    if (this.lastMentionedLocationId && (
      cleaned.includes("how do i get there") ||
      cleaned.includes("how to reach there") ||
      cleaned.includes("how to get there") ||
      cleaned.includes("show route") ||
      cleaned.includes("take me there") ||
      cleaned.includes("navigate there") ||
      cleaned.includes("directions") ||
      cleaned.includes("how far is it") ||
      cleaned.includes("walking time")
    )) {
      return {
        isFollowUpLocation: true,
        locationId: this.lastMentionedLocationId
      };
    }

    return { isFollowUpLocation: false };
  }

  // Find location ID from text or query
  detectLocationId(query, replyText = '') {
    const data = this.getData();
    const locations = data.locations || [];
    const q = this.cleanText(query);
    const r = this.cleanText(replyText);

    // Direct match against location keywords or IDs
    for (const loc of locations) {
      if (q.includes(loc.id.toLowerCase()) || q.includes(loc.name.toLowerCase())) {
        return loc.id;
      }
      if (loc.keywords && loc.keywords.some(kw => q.includes(kw.toLowerCase()))) {
        return loc.id;
      }
    }

    // Check response text for location names
    for (const loc of locations) {
      if (r.includes(loc.name.toLowerCase()) || r.includes(loc.id.toLowerCase())) {
        return loc.id;
      }
    }

    return null;
  }

  // Primary Asynchronous AI Engine Query
  async processQueryAsync(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
      return {
        reply: "Please ask a question regarding CMRCET facilities, placements, admissions, locations, procedures, or announcements.",
        category: "System"
      };
    }

    const query = rawQuery.trim();
    const cleaned = this.cleanText(query);

    // Check context for location follow-ups
    const contextCheck = this.resolveContextualQuery(query);
    if (contextCheck.isFollowUpLocation && contextCheck.locationId) {
      const data = this.getData();
      const loc = (data.locations || []).find(l => l.id === contextCheck.locationId);
      if (loc) {
        const replyHtml = `Here are the directions to <strong>${escapeHtml(loc.name)}</strong> (${escapeHtml(loc.building)}, ${escapeHtml(loc.floor)}):<br><br>• <strong>Estimated Distance:</strong> ${escapeHtml(loc.distance)}<br>• <strong>Walking Time:</strong> ${escapeHtml(loc.walkingTime)}<br><br>${this.renderLocationActionButtons(loc.id)}`;
        return {
          reply: replyHtml,
          category: "Navigation",
          locationId: loc.id
        };
      }
    }

    // 1. Greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/.test(cleaned) && cleaned.split(' ').length <= 3) {
      return {
        reply: `Hello! 👋 I am <strong>Campus Connect AI</strong>, the official intelligent assistant for <strong>CMR College of Engineering & Technology (CMRCET)</strong>.<br><br>You can ask me about:
        <ul class="chat-list">
          <li><strong>Placements & Packages</strong> ("What is the highest package?", "Top recruiters")</li>
          <li><strong>Campus Locations & Navigation</strong> ("Where is the canteen?", "Where is the library?")</li>
          <li><strong>Courses & Departments</strong> ("What courses are offered?", "Tell me about CSE")</li>
          <li><strong>Admissions & Counseling</strong> ("What is the admission process?", "EAMCET code")</li>
          <li><strong>Rules, Procedures & Notices</strong> ("What are the library rules?", "Today's announcements")</li>
          <li><strong>General Academic & Science Concepts</strong> ("Explain black holes in simple words")</li>
        </ul>`,
        category: "Greeting"
      };
    }

    // 2. Attempt Server-Side Gemini AI Call
    try {
      const apiUrl = (typeof window !== 'undefined' && window.location.protocol === 'file:')
        ? 'http://localhost:3000/api/chat'
        : '/api/chat';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: this.history.slice(-this.maxHistoryTurns)
        })
      });

      if (response.ok) {
        const result = await response.json();
        let formattedReply = this.formatMarkdown(result.reply);

        // Detect or use returned location action
        let detectedLocId = result.locationId || this.detectLocationId(query, result.reply);
        if (detectedLocId) {
          this.lastMentionedLocationId = detectedLocId;
          formattedReply += this.renderLocationActionButtons(detectedLocId);
        }

        // Append grounded sources badge if available
        if (result.sources && result.sources.length > 0) {
          formattedReply += this.renderSourcesBadge(result.sources);
        }

        // Save turns into conversation history
        this.history.push({ role: 'user', text: query });
        this.history.push({ role: 'model', text: result.reply });

        return {
          reply: formattedReply,
          category: result.sourceType === 'gemini' ? "Gemini AI" : "Verified Knowledge",
          locationId: detectedLocId,
          sources: result.sources || []
        };
      }
    } catch (apiErr) {
      console.warn("Backend /api/chat not reachable or offline, using verified local engine:", apiErr.message);
    }

    // 4. Fallback to Local Verified Knowledge Base
    const fallbackResponse = this.processQuery(query);
    this.history.push({ role: 'user', text: query });
    this.history.push({ role: 'model', text: fallbackResponse.reply.replace(/<[^>]*>?/gm, ' ') });
    return fallbackResponse;
  }

  // Synchronous Local Knowledge Processor (Complete Offline Fallback)
  processQuery(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
      return {
        reply: "Please ask a question regarding CMRCET facilities, locations, procedures, rules, or announcements.",
        category: "System"
      };
    }

    const query = rawQuery.trim();
    const cleaned = this.cleanText(query);
    const data = this.getData();

    // Out of scope
    if (this.isOutOfScope(cleaned)) {
      return {
        reply: this.fallbackMessage,
        category: "Out of Scope"
      };
    }

    // Placements & Packages
    if (cleaned.includes("package") || cleaned.includes("placement") || cleaned.includes("recruit") || cleaned.includes("highest package") || cleaned.includes("average package") || cleaned.includes("placement percentage") || cleaned.includes("companies")) {
      const p = data.placements || {
        year: "2024-2025",
        highestPackage: "58 LPA (Palo Alto Networks) / 44 LPA (Amazon)",
        averagePackage: "6.5 LPA",
        placementPercentage: "88%+",
        totalOffers: "1,200+ offers"
      };

      return {
        reply: `<strong>CMRCET Placement Statistics (${p.year}):</strong><br><br>
• <strong>Highest Package:</strong> ${p.highestPackage}<br>
• <strong>Average Package:</strong> ${p.averagePackage}<br>
• <strong>Placement Rate:</strong> ${p.placementPercentage} across all engineering departments<br>
• <strong>Total Offers:</strong> ${p.totalOffers}<br>
• <strong>Top Recruiting Companies:</strong> Palo Alto Networks, Amazon, Microsoft, Virtusa, Capgemini, TCS, Cognizant, Wipro, Infosys, Accenture, Darwinbox.<br><br>
${this.renderLocationActionButtons('placement-cell')}`,
        category: "Placements",
        locationId: 'placement-cell'
      };
    }

    // Courses & Departments
    if (cleaned.includes("course") || cleaned.includes("courses offered") || cleaned.includes("departments") || cleaned.includes("branches") || cleaned.includes("what courses") || cleaned.includes("programs")) {
      return {
        reply: `<strong>Academic Programs Offered at CMR College of Engineering & Technology (CMRCET):</strong><br><br>
<strong>Undergraduate Programs (B.Tech):</strong>
<ul class="chat-list">
  <li>B.Tech in Computer Science & Engineering (CSE)</li>
  <li>B.Tech in CSE (Artificial Intelligence & Machine Learning)</li>
  <li>B.Tech in CSE (Data Science)</li>
  <li>B.Tech in CSE (Cyber Security)</li>
  <li>B.Tech in Electronics & Communication Engineering (ECE)</li>
  <li>B.Tech in Electrical & Electronics Engineering (EEE)</li>
  <li>B.Tech in Mechanical Engineering (ME)</li>
  <li>B.Tech in Civil Engineering (CE)</li>
</ul>
<strong>Postgraduate Programs:</strong>
<ul class="chat-list">
  <li>M.Tech in CSE, Embedded Systems, Structural Engineering, Power Electronics</li>
  <li>Master of Business Administration (MBA)</li>
</ul>`,
        category: "Academics"
      };
    }

    // Admissions & EAMCET
    if (cleaned.includes("admission") || cleaned.includes("eamcet") || cleaned.includes("how to join") || cleaned.includes("eligibility") || cleaned.includes("admission process") || cleaned.includes("counseling code")) {
      return {
        reply: `<strong>CMRCET Admissions & Counseling Information:</strong><br><br>
• <strong>TG EAMCET Code:</strong> <code>CMRK</code><br>
• <strong>B.Tech Admission:</strong> Passed 10+2 / Intermediate with MPC and a valid TG EAMCET rank via convener counseling.<br>
• <strong>Lateral Entry (2nd Year):</strong> Diploma / B.Sc with valid TG ECET rank.<br>
• <strong>Management Quota (Category-B):</strong> Conducted as per TSCHE guidelines.<br>
• <strong>Admissions Office:</strong> Ground Floor (Room AD-102), Block 1.<br>
• <strong>Contact:</strong> +91 92487 27210 | admissions@cmrcet.ac.in<br><br>
${this.renderLocationActionButtons('block1-admin')}`,
        category: "Admissions",
        locationId: 'block1-admin'
      };
    }

    // College General Info & Timings
    if (cleaned.includes("working hour") || cleaned.includes("working hours") || cleaned.includes("college timing") || cleaned.includes("college timings") || cleaned.includes("opening hour") || cleaned.includes("when does college open") || cleaned.includes("when does college start")) {
      return {
        reply: `<strong>CMRCET Working Hours:</strong><br>${data.college.timings}<br><br>Regular classes and administrative desks operate Monday through Saturday from <strong>9:15 AM to 4:00 PM</strong> (2nd & 4th Saturdays are holidays).`,
        category: "Timings"
      };
    }

    if (cleaned.includes("about cmrcet") || cleaned.includes("about college") || cleaned.includes("tell me about cmrcet") || cleaned.includes("affiliation") || cleaned.includes("autonomous") || cleaned.includes("naac") || cleaned.includes("established")) {
      return {
        reply: `<strong>About CMR College of Engineering & Technology (CMRCET):</strong><br>
<strong>${data.college.name} (${data.college.shortName} / CMRK)</strong> is a premier UGC Autonomous Institution established in ${data.college.established}.<br><br>
• <strong>Accreditation:</strong> Accredited by NAAC with 'A+' Grade & NBA Accredited.<br>
• <strong>Affiliation:</strong> Approved by AICTE, New Delhi, and permanently affiliated to JNTU Hyderabad.<br>
• <strong>Campus Address:</strong> ${data.college.address}<br>
• <strong>Verified Coordinates:</strong> 17.6046671, 78.4865205<br><br>
${this.renderLocationActionButtons('block1-admin')}`,
        category: "About",
        locationId: 'block1-admin'
      };
    }

    if (cleaned.includes("principal") || cleaned.includes("dr narayana") || cleaned.includes("narayana") || cleaned.includes("head of college")) {
      return {
        reply: `<strong>CMRCET Principal:</strong><br>
<strong>${data.college.principal.name}</strong><br>
• <strong>Office:</strong> ${data.college.principal.office}<br>
• <strong>Visiting Hours:</strong> ${data.college.principal.visitingHours}<br>
• <strong>Email:</strong> <a href="mailto:${data.college.principal.email}" style="color: var(--accent-secondary);">${data.college.principal.email}</a><br><br>
${this.renderLocationActionButtons('block1-admin')}`,
        category: "Administration",
        locationId: 'block1-admin'
      };
    }

    if (cleaned.includes("contact") || cleaned.includes("phone number") || cleaned.includes("helpline") || cleaned.includes("email address")) {
      return {
        reply: `<strong>CMRCET Official Contact Information:</strong><br>
• <strong>Main Phone:</strong> ${data.college.contact}<br>
• <strong>General Email:</strong> ${data.college.email}<br>
• <strong>Examination Cell:</strong> ${data.college.examEmail}<br>
• <strong>Placements:</strong> ${data.college.placementEmail}<br>
• <strong>Grievance Desk:</strong> ${data.college.supportEmail}<br>
• <strong>Address:</strong> ${data.college.address}`,
        category: "Contact"
      };
    }

    // Announcements & Updates
    if (cleaned.includes("announcement") || cleaned.includes("announcements") || cleaned.includes("update") || cleaned.includes("updates") || cleaned.includes("notice") || cleaned.includes("notices") || cleaned.includes("circular") || cleaned.includes("today s announcement")) {
      if (!data.announcements || data.announcements.length === 0) {
        return {
          reply: "There are currently no active announcements in the system.",
          category: "Announcements"
        };
      }
      
      let html = `<strong>📢 Latest CMRCET Announcements & Updates:</strong><br><br>`;
      data.announcements.slice(0, 3).forEach((ann, idx) => {
        const badge = ann.isNew ? `<span style="background: rgba(239,68,68,0.2); color:#f87171; font-size:0.7rem; padding:2px 6px; border-radius:4px; font-weight:700;">NEW</span> ` : '';
        html += `<strong>${idx + 1}. ${badge}${escapeHtml(ann.title)}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">[${escapeHtml(ann.category)}] — ${escapeHtml(ann.date)}</span><br>${escapeHtml(ann.description)}<br><br>`;
      });
      html += `<a href="#announcements" style="color:var(--accent-secondary); font-weight:600;"><i class="fa-solid fa-arrow-right"></i> View all announcements</a>`;
      return {
        reply: html,
        category: "Announcements"
      };
    }

    // Dynamic Match against all Campus Locations
    if (data.locations && data.locations.length > 0) {
      for (const loc of data.locations) {
        const nameMatch = cleaned.includes(loc.name.toLowerCase());
        const keywordMatch = loc.keywords && loc.keywords.some(kw => cleaned.includes(kw.toLowerCase()));
        const idMatch = cleaned.includes(loc.id.toLowerCase());

        if (nameMatch || keywordMatch || idMatch) {
          this.lastMentionedLocationId = loc.id;
          let reply = `<strong>${escapeHtml(loc.name)}:</strong><br>`;
          reply += `• <strong>Category:</strong> ${escapeHtml(loc.category)}<br>`;
          reply += `• <strong>Building & Floor:</strong> ${escapeHtml(loc.building)}, ${escapeHtml(loc.floor)}<br>`;
          reply += `• <strong>Distance from Main Gate:</strong> ${escapeHtml(loc.distance)} (${escapeHtml(loc.walkingTime)})<br>`;
          reply += `• <strong>Timings:</strong> ${escapeHtml(loc.timings)}<br>`;
          reply += `• <strong>Contact:</strong> ${escapeHtml(loc.contact)}<br><br>`;
          reply += `${escapeHtml(loc.description)}<br>`;
          reply += this.renderLocationActionButtons(loc.id);
          return {
            reply: reply,
            category: "Location",
            locationId: loc.id
          };
        }
      }
    }

    // Dynamic Match against Departments
    if (data.departments && data.departments.length > 0) {
      for (const dept of data.departments) {
        if (cleaned.includes(dept.code.toLowerCase()) || cleaned.includes(dept.name.toLowerCase())) {
          return {
            reply: `<strong>Department of ${escapeHtml(dept.name)}:</strong><br>
• <strong>HOD:</strong> ${escapeHtml(dept.hod)}<br>
• <strong>Location:</strong> ${escapeHtml(dept.location)}<br>
• <strong>Programs:</strong> ${escapeHtml(dept.programs)}<br>
• <strong>Intake:</strong> ${escapeHtml(dept.intake)}<br>
• <strong>Email:</strong> <a href="mailto:${dept.email}" style="color:var(--accent-secondary);">${escapeHtml(dept.email)}</a><br><br>
${escapeHtml(dept.description)}`,
            category: "Department"
          };
        }
      }
    }

    // Unknown Location Query Detection
    if (cleaned.startsWith("where is") || cleaned.includes("location of") || cleaned.includes("how to go to") || cleaned.includes("how to reach") || cleaned.includes("directions to") || cleaned.includes("block") || cleaned.includes("building") || cleaned.includes("hall") || cleaned.includes("room")) {
      return {
        reply: this.unknownLocationMessage,
        category: "Unknown Location"
      };
    }

    // General Anti-Hallucination Fallback
    return {
      reply: this.fallbackMessage,
      category: "Fallback"
    };
  }

  // Text to Speech
  speak(text) {
    if (!this.synth || !this.ttsEnabled) return;
    try {
      this.synth.cancel();
      // Strip HTML tags for clean speech
      const clean = text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
}

// Global Chatbot Instance
const campusChatbot = new CampusConnectAIEngine();
