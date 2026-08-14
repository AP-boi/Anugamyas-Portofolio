'use client';

import React, { useState } from 'react';
import { AchievementItem } from '@/types/os';
import {
  Trophy,
  Award,
  CheckCircle2,
  ExternalLink,
  Zap,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Folder,
  FileText,
  Search,
  Share2,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
} from 'lucide-react';

const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'ach-1',
    title: '1st Place Winner - Global Distributed Hackathon 2025',
    organization: 'Global Cloud Systems Foundation',
    category: 'Hackathon',
    date: 'Nov 2025',
    description:
      'Engineered an ultra-low latency event-driven streaming consensus pipeline built with Rust and WebAssembly, handling over 1.2M events/sec with sub-10ms P99 propagation delay.',
    metrics: [
      { label: 'P99 Latency Reduction', value: '8.4ms', improvement: '-76%' },
      { label: 'Peak Event Throughput', value: '1,240,000 req/s', improvement: '+310%' },
      { label: 'Memory Footprint', value: '14.2 MB', improvement: '-82%' },
    ],
    proofUrl: 'https://github.com/AP-boi',
    verified: true,
    tags: ['Rust', 'WebAssembly', 'Distributed Systems', 'Kafka', 'Raft Consensus'],
  },
  {
    id: 'ach-2',
    title: 'AWS Certified Solutions Architect – Professional (SAP-C02)',
    organization: 'Amazon Web Services',
    category: 'Certification',
    date: 'Aug 2025',
    description:
      'Demonstrated advanced technical expertise in designing enterprise-grade multi-region fault-tolerant topologies, serverless event architectures, and automated cloud compliance guardrails.',
    metrics: [
      { label: 'Architectural SLA', value: '99.999%', improvement: 'High Availability' },
      { label: 'Cloud Cost Efficiency', value: '$120K/yr', improvement: '-42% OpEx' },
    ],
    proofUrl: 'https://aws.amazon.com/verification',
    verified: true,
    tags: ['AWS', 'Kubernetes', 'Terraform', 'Multi-Region', 'IAM Hardening'],
  },
  {
    id: 'ach-3',
    title: 'Postgres & Vector Search Infrastructure Post-Mortem',
    organization: 'Open Source Systems Lab',
    category: 'Engineering Milestone',
    date: 'May 2025',
    description:
      'Optimized pgvector Indexing strategies with HNSW cosine distance partitioning, lowering AI RAG query response times from 480ms down to 18ms across 5M high-dimensional vectors.',
    metrics: [
      { label: 'RAG Query Time', value: '18.2ms', improvement: '26x Faster' },
      { label: 'Index Memory Efficiency', value: '6.4 GB', improvement: '-55%' },
    ],
    proofUrl: 'https://github.com/AP-boi',
    verified: true,
    tags: ['PostgreSQL', 'pgvector', 'HNSW', 'OpenAI Embeddings', 'Next.js 14'],
  },
  {
    id: 'ach-4',
    title: 'Open Source Security Contributor of the Month',
    organization: 'OpenSSF & CNCF',
    category: 'Open Source',
    date: 'Feb 2025',
    description:
      'Identified and patched critical prototype pollution & regex denial-of-service vulnerabilities across 4 major web frameworks, protecting an estimated 2.4 million downstream deployments.',
    metrics: [
      { label: 'CVEs Remediated', value: '3 Critical', improvement: 'Zero Day' },
      { label: 'Downstream Projects Saved', value: '2.4M+', improvement: 'Secured' },
    ],
    proofUrl: 'https://github.com/AP-boi',
    verified: true,
    tags: ['Security', 'OpenSSF', 'Vulnerabilities', 'Node.js', 'Patch Management'],
  },
];

export const AchievementsApp: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AchievementItem>(ACHIEVEMENTS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All Notes');

  const filteredItems = ACHIEVEMENTS_DATA.filter(
    (item) =>
      (selectedFolder === 'All Notes' || item.category === selectedFolder) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="flex flex-col h-full space-y-2 text-slate-900 -m-2 p-3 bg-white/90 rounded-b-xl">
      {/* Authentic macOS Notes App Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <img src="/icons/notes.png" alt="" className="w-4 h-4 rounded object-cover shadow-2xs" />
            <span className="font-bold text-xs text-slate-900">Notes</span>
          </div>
          <div className="h-3 w-px bg-slate-300" />
          <span className="text-[11px] text-slate-500">{filteredItems.length} Notes</span>
        </div>

        {/* Notes Action Items */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-300 rounded-md px-2 py-0.5 text-xs text-slate-800">
            <Search className="w-3 h-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search Notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-slate-900 placeholder:text-slate-400 w-28"
            />
          </div>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors" title="Share Note">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual Pane macOS Notes Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden pt-1">
        {/* Left Notes List Sidebar */}
        <div className="w-full md:w-5/12 bg-slate-100/70 border border-slate-200 rounded-xl overflow-y-auto divide-y divide-slate-200">
          {filteredItems.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-amber-100/80 border-l-2 border-amber-600 font-medium' : 'hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-wider">{item.category}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right Note Detail Viewport */}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300 font-bold uppercase">
                  {selectedItem.category}
                </span>
                {selectedItem.verified && (
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-700 font-mono font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>VERIFIED RECORD</span>
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-2 leading-snug">{selectedItem.title}</h2>
              <p className="text-xs text-slate-500 font-mono mt-1 font-medium">
                {selectedItem.organization} • {selectedItem.date}
              </p>
            </div>

            <a
              href={selectedItem.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-all text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap shadow-xs"
            >
              <span>View Credential</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Note Body Text */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Executive Summary</h4>
            <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
              {selectedItem.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Impact Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedItem.metrics.map((metric) => (
                <div key={metric.label} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{metric.label}</span>
                  <div className="text-sm font-bold text-amber-700 mt-1 font-mono">{metric.value}</div>
                  <span className="text-[9px] text-emerald-700 font-mono font-semibold">{metric.improvement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-1.5">
              {selectedItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsApp;
