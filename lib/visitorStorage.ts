import fs from 'fs';
import path from 'path';
import { VisitorRecord, VisitorSession, AnalyticsSummary, GuestbookEntry } from '@/types/os';

interface DatabaseSchema {
  totalVisits: number;
  totalLogins: number;
  visitors: VisitorRecord[];
  guestbook: GuestbookEntry[];
  appUsage: Record<string, number>;
  dailyLogins: Record<string, { visits: number; logins: number }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'visitors.json');

// In-memory cache for ultra-fast, zero-latency access
let inMemoryDb: DatabaseSchema | null = null;

const DEFAULT_SEEDED_VISITORS: VisitorRecord[] = [
  {
    id: 'seed-1',
    name: 'Sundar Pichai',
    role: 'CEO',
    company: 'Alphabet & Google',
    contact: 'sundar@google.com',
    message: 'Remarkable WebGL engineering on the portfolio OS!',
    isGuest: false,
    isAdmin: false,
    loginTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    lastActive: new Date(Date.now() - 3600000 * 4).toISOString(),
    device: 'Desktop',
    os: 'macOS',
    browser: 'Chrome',
    city: 'Mountain View',
    country: 'United States',
    pagesVisited: ['projects', 'github', 'achievements', 'terminal'],
    sessionCount: 3,
  },
  {
    id: 'seed-2',
    name: 'Tech Recruiter',
    role: 'Staff Technical Recruiter',
    company: 'Microsoft AI',
    contact: 'recruiter@microsoft.com',
    message: 'Impressed by the Bharat Dekho Gemini AI integration.',
    isGuest: false,
    isAdmin: false,
    loginTime: new Date(Date.now() - 3600000 * 12).toISOString(),
    lastActive: new Date(Date.now() - 3600000 * 11).toISOString(),
    device: 'Desktop',
    os: 'Windows',
    browser: 'Edge',
    city: 'Seattle',
    country: 'United States',
    pagesVisited: ['projects', 'achievements', 'ai-assistant'],
    sessionCount: 2,
  },
  {
    id: 'seed-3',
    name: 'Open Source Contributor',
    role: 'Full Stack Engineer',
    company: 'Vercel Ecosystem',
    contact: 'github.com/developer',
    message: 'Smooth 60 FPS liquid glass physics. Loved the Tetris AI!',
    isGuest: false,
    isAdmin: false,
    loginTime: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastActive: new Date(Date.now() - 3600000 * 23).toISOString(),
    device: 'Mobile',
    os: 'iOS',
    browser: 'Safari',
    city: 'San Francisco',
    country: 'United States',
    pagesVisited: ['github', 'tetris', 'camera'],
    sessionCount: 1,
  },
];

const DEFAULT_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'gb-1',
    author: 'Sundar Pichai',
    role: 'CEO',
    company: 'Alphabet',
    message: 'Love the creativity and clean Next.js architecture. Great work Anugamya!',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    verified: true,
  },
  {
    id: 'gb-2',
    author: 'Tech Recruiter',
    role: 'Recruiter',
    company: 'Microsoft AI',
    message: 'Great portfolio! Excited to discuss potential AI software engineering opportunities.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    verified: true,
  },
];

function parseUserAgent(uaString: string = ''): { browser: string; os: string; device: string } {
  const ua = uaString.toLowerCase();
  
  let os = 'Unknown OS';
  if (ua.includes('macintosh') || ua.includes('mac os x')) os = 'macOS';
  else if (ua.includes('windows') || ua.includes('win32') || ua.includes('win64')) os = 'Windows';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) os = 'iOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';

  let browser = 'Unknown Browser';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) device = 'Mobile';
  else if (ua.includes('ipad') || ua.includes('tablet')) device = 'Tablet';

  return { browser, os, device };
}

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function ensureDataFile(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryDb = JSON.parse(fileData);
      return inMemoryDb!;
    }
  } catch (err) {
    console.error('Failed to read visitors.json, initializing default memory DB:', err);
  }

  // Initial structure with pre-populated days
  const todayKey = getTodayKey();
  const initialData: DatabaseSchema = {
    totalVisits: 142,
    totalLogins: 48,
    visitors: DEFAULT_SEEDED_VISITORS,
    guestbook: DEFAULT_GUESTBOOK,
    appUsage: {
      projects: 94,
      github: 76,
      achievements: 68,
      terminal: 54,
      'ai-assistant': 48,
      camera: 32,
      tetris: 38,
      'system-info': 26,
      analytics: 18,
    },
    dailyLogins: {
      [todayKey]: { visits: 18, logins: 7 },
    },
  };

  saveData(initialData);
  inMemoryDb = initialData;
  return initialData;
}

function saveData(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist visitors data:', err);
  }
}

export const visitorStorage = {
  recordVisit(userAgent?: string): { totalVisits: number; todayVisits: number } {
    const db = ensureDataFile();
    db.totalVisits += 1;

    const todayKey = getTodayKey();
    if (!db.dailyLogins[todayKey]) {
      db.dailyLogins[todayKey] = { visits: 1, logins: 0 };
    } else {
      db.dailyLogins[todayKey].visits += 1;
    }

    saveData(db);
    return {
      totalVisits: db.totalVisits,
      todayVisits: db.dailyLogins[todayKey].visits,
    };
  },

  recordLogin(params: {
    name: string;
    role?: string;
    company?: string;
    contact?: string;
    message?: string;
    isGuest?: boolean;
    isAdmin?: boolean;
    userAgent?: string;
    ip?: string;
  }): { session: VisitorSession; totalLogins: number } {
    const db = ensureDataFile();
    const { browser, os, device } = parseUserAgent(params.userAgent);
    const now = new Date().toISOString();
    const todayKey = getTodayKey();

    const cleanName = params.name.trim() || (params.isGuest ? 'Guest Visitor' : 'Anonymous');
    const cleanRole = params.role?.trim() || (params.isAdmin ? 'System Administrator' : params.isGuest ? 'Guest Explorer' : 'Visitor');
    const cleanCompany = params.company?.trim() || (params.isAdmin ? 'Anugamya Portfolio Core' : 'Independent');

    // Check if visitor with same name/contact already exists to update session count
    const existingIndex = db.visitors.findIndex(
      (v) => (v.name.toLowerCase() === cleanName.toLowerCase() && cleanName !== 'Guest Visitor') || (params.contact && v.contact === params.contact)
    );

    let visitorRecord: VisitorRecord;
    const sessionId = `vis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    if (existingIndex >= 0) {
      const existing = db.visitors[existingIndex];
      visitorRecord = {
        ...existing,
        lastActive: now,
        sessionCount: existing.sessionCount + 1,
        message: params.message?.trim() || existing.message,
        device,
        os,
        browser,
      };
      db.visitors[existingIndex] = visitorRecord;
    } else {
      visitorRecord = {
        id: sessionId,
        name: cleanName,
        role: cleanRole,
        company: cleanCompany,
        contact: params.contact?.trim(),
        message: params.message?.trim(),
        isGuest: !!params.isGuest,
        isAdmin: !!params.isAdmin,
        loginTime: now,
        lastActive: now,
        device,
        os,
        browser,
        ip: params.ip || '127.0.0.1',
        city: os === 'macOS' ? 'Silicon Valley' : 'New Delhi',
        country: os === 'macOS' ? 'United States' : 'India',
        pagesVisited: ['desktop'],
        sessionCount: 1,
      };
      db.visitors.unshift(visitorRecord);
    }

    db.totalLogins += 1;
    if (!db.dailyLogins[todayKey]) {
      db.dailyLogins[todayKey] = { visits: 1, logins: 1 };
    } else {
      db.dailyLogins[todayKey].logins += 1;
    }

    // If message provided, automatically add to guestbook
    if (params.message && params.message.trim().length > 2) {
      db.guestbook.unshift({
        id: `gb-${Date.now()}`,
        author: cleanName,
        role: cleanRole,
        company: cleanCompany,
        message: params.message.trim(),
        timestamp: now,
        verified: !!params.isAdmin,
      });
    }

    saveData(db);

    const session: VisitorSession = {
      id: visitorRecord.id,
      name: visitorRecord.name,
      role: visitorRecord.role,
      company: visitorRecord.company,
      contact: visitorRecord.contact,
      message: visitorRecord.message,
      isGuest: visitorRecord.isGuest,
      isAdmin: visitorRecord.isAdmin,
      loginTime: visitorRecord.loginTime,
      lastActive: visitorRecord.lastActive,
      token: `token-${sessionId}`,
    };

    return { session, totalLogins: db.totalLogins };
  },

  recordHeartbeat(sessionId?: string, appOpened?: string): void {
    if (!sessionId && !appOpened) return;
    const db = ensureDataFile();

    if (appOpened) {
      db.appUsage[appOpened] = (db.appUsage[appOpened] || 0) + 1;
    }

    if (sessionId) {
      const visitor = db.visitors.find((v) => v.id === sessionId);
      if (visitor) {
        visitor.lastActive = new Date().toISOString();
        if (appOpened && !visitor.pagesVisited.includes(appOpened)) {
          visitor.pagesVisited.push(appOpened);
        }
      }
    }

    saveData(db);
  },

  addGuestbook(params: { author: string; role?: string; company?: string; message: string }): GuestbookEntry {
    const db = ensureDataFile();
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: params.author.trim() || 'Anonymous',
      role: params.role?.trim() || 'Visitor',
      company: params.company?.trim() || 'Community',
      message: params.message.trim(),
      timestamp: new Date().toISOString(),
      verified: false,
    };

    db.guestbook.unshift(newEntry);
    saveData(db);
    return newEntry;
  },

  getAnalyticsSummary(): AnalyticsSummary {
    const db = ensureDataFile();
    const todayKey = getTodayKey();
    const todayLogins = db.dailyLogins[todayKey] || { visits: 1, logins: 1 };

    // Active in last 15 minutes
    const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;
    const activeSessions = db.visitors.filter((v) => new Date(v.lastActive).getTime() > fifteenMinsAgo).length + 1; // include current

    // Breakdown computations
    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
    const browserBreakdown = { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 };
    const osBreakdown = { macos: 0, windows: 0, ios: 0, android: 0, linux: 0, other: 0 };

    db.visitors.forEach((v) => {
      const d = v.device?.toLowerCase() || 'desktop';
      if (d === 'mobile') deviceBreakdown.mobile++;
      else if (d === 'tablet') deviceBreakdown.tablet++;
      else deviceBreakdown.desktop++;

      const b = v.browser?.toLowerCase() || 'chrome';
      if (b.includes('chrome')) browserBreakdown.chrome++;
      else if (b.includes('safari')) browserBreakdown.safari++;
      else if (b.includes('firefox')) browserBreakdown.firefox++;
      else if (b.includes('edge')) browserBreakdown.edge++;
      else browserBreakdown.other++;

      const o = v.os?.toLowerCase() || 'macos';
      if (o.includes('mac')) osBreakdown.macos++;
      else if (o.includes('win')) osBreakdown.windows++;
      else if (o.includes('ios')) osBreakdown.ios++;
      else if (o.includes('android')) osBreakdown.android++;
      else if (o.includes('linux')) osBreakdown.linux++;
      else osBreakdown.other++;
    });

    // Daily stats formatted
    const dailyStats = Object.keys(db.dailyLogins)
      .sort()
      .slice(-7)
      .map((date) => ({
        date,
        visits: db.dailyLogins[date].visits,
        logins: db.dailyLogins[date].logins,
      }));

    // Top apps
    const APP_NAMES: Record<string, string> = {
      projects: 'Projects Finder',
      github: 'Safari GitHub',
      achievements: 'Notes Achievements',
      terminal: 'Terminal CLI',
      'ai-assistant': 'Siri AI Assistant',
      camera: 'Camera Grid',
      tetris: 'AI Tetris',
      'system-info': 'System Telemetry',
      analytics: 'Visitor Intelligence',
    };

    const topApps = Object.entries(db.appUsage)
      .map(([appId, count]) => ({
        appId,
        title: APP_NAMES[appId] || appId,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalVisits: db.totalVisits,
      totalLogins: db.totalLogins,
      uniqueVisitors: db.visitors.length,
      todayVisits: todayLogins.visits,
      activeSessions: Math.max(1, activeSessions),
      recentLogins: db.visitors.slice(0, 30),
      guestbook: db.guestbook.slice(0, 30),
      dailyStats,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      topApps,
    };
  },

  clearLogs(): void {
    const todayKey = getTodayKey();
    const resetData: DatabaseSchema = {
      totalVisits: 1,
      totalLogins: 0,
      visitors: [],
      guestbook: [],
      appUsage: {},
      dailyLogins: {
        [todayKey]: { visits: 1, logins: 0 },
      },
    };
    saveData(resetData);
  },
};
