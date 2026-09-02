'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsSummary, VisitorRecord, GuestbookEntry } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';
import {
  Activity,
  Users,
  Eye,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Send,
} from 'lucide-react';

export const AnalyticsApp: React.FC = () => {
  const { currentUser, isAdmin } = useOSStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors' | 'guestbook'>('overview');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // New Guestbook Message
  const [newMsg, setNewMsg] = useState('');
  const [isSubmittingMsg, setIsSubmittingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/visitors');
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    if (!autoRefresh) return;
    const interval = setInterval(fetchAnalytics, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to reset visitor logs?')) return;
    try {
      await fetch('/api/admin/visitors', { method: 'DELETE' });
      fetchAnalytics();
    } catch (err) {
      console.error('Error clearing logs:', err);
    }
  };

  const handleExportJSON = () => {
    if (!summary) return;
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-visitor-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!summary || !summary.recentLogins) return;
    const headers = 'ID,Name,Role,Company,Contact,Message,Device,OS,Browser,LoginTime,SessionCount\n';
    const rows = summary.recentLogins
      .map(
        (v) =>
          `"${v.id}","${v.name}","${v.role}","${v.company}","${v.contact || ''}","${(v.message || '').replace(/"/g, '""')}","${v.device}","${v.os}","${v.browser}","${v.loginTime}","${v.sessionCount}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || isSubmittingMsg) return;

    setIsSubmittingMsg(true);
    try {
      const res = await fetch('/api/visitors/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: currentUser?.name || 'Visitor',
          role: currentUser?.role || 'Explorer',
          company: currentUser?.company || 'Community',
          message: newMsg.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMsg('');
        setMsgSuccess(true);
        setTimeout(() => setMsgSuccess(false), 3000);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to post guestbook message:', err);
    } finally {
      setIsSubmittingMsg(false);
    }
  };

  const filteredVisitors = (summary?.recentLogins || []).filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.company.toLowerCase().includes(q) ||
      v.role.toLowerCase().includes(q) ||
      (v.message && v.message.toLowerCase().includes(q)) ||
      v.os.toLowerCase().includes(q) ||
      v.browser.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 overflow-hidden font-sans">
      {/* Top Application Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 backdrop-blur-md z-10 select-none">
        <div className="flex items-center space-x-3">
          <img src="/icons/activity.png" alt="Activity Monitor" className="w-8 h-8 rounded-lg object-contain shadow-xs" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Visitor Intelligence & Login Tracker
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold border border-emerald-300">
                LIVE TELEMETRY
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Fullstack Node.js Backend • Real-time Session Monitoring
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'visitors' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Visitor Logs ({summary?.totalLogins ?? '...'})
          </button>
          <button
            onClick={() => setActiveTab('guestbook')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'guestbook' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Guestbook ({summary?.guestbook?.length ?? 0})
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
              autoRefresh
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
            title="Auto-refresh every 8 seconds"
          >
            <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoRefresh ? 'Live Poll' : 'Paused'}</span>
          </button>

          <button
            onClick={fetchAnalytics}
            className="p-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh Now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Logins */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Total Logins</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {summary?.totalLogins ?? 0}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold font-mono flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Captured in Node.js DB
                  </span>
                </div>
              </div>

              {/* Total Visits */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Total Hits / Visits</span>
                  <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {summary?.totalVisits ?? 0}
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold font-mono">
                    Today: {summary?.todayVisits ?? 0} visits
                  </span>
                </div>
              </div>

              {/* Unique People */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Unique Identities</span>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {summary?.uniqueVisitors ?? 0}
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold font-mono">
                    Distinct Profiles
                  </span>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Active Right Now</span>
                  <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    ONLINE
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-emerald-700 tracking-tight">
                    {summary?.activeSessions ?? 1}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Live WebSocket / Heartbeat
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Row: Traffic Chart & Platform Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Daily Traffic Visualizer */}
              <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">7-Day Traffic & Login Activity</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Aggregate Daily Buckets</span>
                </div>

                {/* Bar Graph */}
                <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
                  {(summary?.dailyStats || []).map((day) => {
                    const max = Math.max(10, ...((summary?.dailyStats || []).map((d) => d.visits)));
                    const visitHeight = Math.max(12, Math.round((day.visits / max) * 120));
                    const loginHeight = Math.max(8, Math.round((day.logins / max) * 120));

                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="flex items-end gap-1 w-full justify-center">
                          {/* Visits Bar */}
                          <div
                            style={{ height: `${visitHeight}px` }}
                            className="w-4 bg-purple-400/80 hover:bg-purple-500 rounded-t-md transition-all relative group"
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] rounded font-mono pointer-events-none transition-opacity">
                              {day.visits}v
                            </div>
                          </div>
                          {/* Logins Bar */}
                          <div
                            style={{ height: `${loginHeight}px` }}
                            className="w-4 bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all relative group"
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] rounded font-mono pointer-events-none transition-opacity">
                              {day.logins}L
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{day.date.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center space-x-6 text-[11px] pt-1 text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-purple-400" />
                    <span>Total Hits</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600" />
                    <span>Logged In Users</span>
                  </div>
                </div>
              </div>

              {/* Device & Browser Distribution */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-600" />
                    Platform Telemetry
                  </h4>
                </div>

                {/* Operating Systems */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Operating Systems</span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span>macOS / Darwin</span>
                      <span className="font-mono font-bold text-slate-900">{summary?.osBreakdown?.macos ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Windows</span>
                      <span className="font-mono font-bold text-slate-900">{summary?.osBreakdown?.windows ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>iOS / Mobile</span>
                      <span className="font-mono font-bold text-slate-900">{summary?.osBreakdown?.ios ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Android / Linux</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(summary?.osBreakdown?.android ?? 0) + (summary?.osBreakdown?.linux ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Device Type */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Device Breakdown</span>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Laptop className="w-3.5 h-3.5 mx-auto text-blue-600 mb-1" />
                      <div className="font-bold text-slate-900 font-mono">{summary?.deviceBreakdown?.desktop ?? 0}</div>
                      <span className="text-[9px] text-slate-500">Desktop</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Smartphone className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-1" />
                      <div className="font-bold text-slate-900 font-mono">{summary?.deviceBreakdown?.mobile ?? 0}</div>
                      <span className="text-[9px] text-slate-500">Mobile</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Tablet className="w-3.5 h-3.5 mx-auto text-purple-600 mb-1" />
                      <div className="font-bold text-slate-900 font-mono">{summary?.deviceBreakdown?.tablet ?? 0}</div>
                      <span className="text-[9px] text-slate-500">Tablet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: App Popularity & Quick Log Preview */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">Portfolio Apps Explored By Visitors</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live Engagement Heatmap</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(summary?.topApps || []).slice(0, 8).map((app) => (
                  <div key={app.appId} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-semibold text-slate-800">{app.title}</h5>
                      <span className="text-[10px] text-slate-500 font-mono">{app.appId}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {app.count} opens
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISITOR LOGS TABLE */}
        {activeTab === 'visitors' && (
          <div className="space-y-3">
            {/* Table Search & Export Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 w-full sm:w-72 shadow-inner">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, company, role, OS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-slate-900 placeholder:text-slate-400 w-full"
                  />
                </div>
                <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                  ({filteredVisitors.length} results)
                </span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                  title="Export records to CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                  title="Export full JSON payload"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                  title="Reset / Clear Visitor Logs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visitors Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase font-mono tracking-wider">
                      <th className="py-3 px-4">Visitor Identity</th>
                      <th className="py-3 px-4">Company & Role</th>
                      <th className="py-3 px-4">Platform / Device</th>
                      <th className="py-3 px-4">Login Time</th>
                      <th className="py-3 px-4">Message / Notes</th>
                      <th className="py-3 px-4 text-center">Sessions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          No visitor records found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Name & Badge */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {v.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{v.name}</span>
                                  {v.isAdmin && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                                      OWNER
                                    </span>
                                  )}
                                  {v.isGuest && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                      GUEST
                                    </span>
                                  )}
                                </div>
                                {v.contact && (
                                  <span className="text-[10px] text-slate-400 font-mono">{v.contact}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Company & Role */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{v.company}</div>
                            <span className="text-[11px] text-slate-500">{v.role}</span>
                          </td>

                          {/* Device & OS */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-700">
                              <span className="font-semibold">{v.os}</span>
                              <span className="text-slate-400">•</span>
                              <span>{v.browser}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {v.device} ({v.city || 'Global'})
                            </span>
                          </td>

                          {/* Time */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            <div>{new Date(v.loginTime).toLocaleDateString()}</div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(v.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Message */}
                          <td className="py-3 px-4 max-w-xs">
                            {v.message ? (
                              <p className="text-[11px] text-slate-700 italic bg-amber-50/60 p-1.5 rounded-lg border border-amber-200/60 line-clamp-2">
                                "{v.message}"
                              </p>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Session Count */}
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                              {v.sessionCount}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GUESTBOOK & RECOMMENDATIONS */}
        {activeTab === 'guestbook' && (
          <div className="space-y-4">
            {/* Leave a Note Form */}
            <form
              onSubmit={handleSendGuestbook}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Leave a Recommendation / Greeting for Anugamya
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  Posting as: <strong>{currentUser?.name || 'Visitor'}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your feedback, shout-out, or collaboration note..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMsg.trim() || isSubmittingMsg}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingMsg ? 'Posting...' : 'Post Note'}</span>
                </button>
              </div>

              {msgSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your note was posted to Anugamya’s guestbook!</span>
                </div>
              )}
            </form>

            {/* Guestbook Messages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(summary?.guestbook || []).map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400/60 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {entry.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{entry.author}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {entry.role} • {entry.company}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{entry.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsApp;
