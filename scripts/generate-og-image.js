import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#080C14"/>
    </linearGradient>
    <radialGradient id="glow1" cx="20%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#16A34A" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#16A34A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="80%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#25D366" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#25D366" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Left Content Area -->
  <g transform="translate(80, 80)">
    
    <!-- Top Brand Logo -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="48" height="48" rx="14" fill="#16A34A"/>
      <path d="M14 34V14L34 34V14" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="64" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">
        Niva<tspan fill="#22C55E">Ops</tspan>
      </text>
    </g>

    <!-- Eyebrow Pill -->
    <g transform="translate(0, 80)">
      <rect x="0" y="0" width="340" height="32" rx="16" fill="#16A34A" fill-opacity="0.15" stroke="#16A34A" stroke-opacity="0.3" stroke-width="1"/>
      <circle cx="16" cy="16" r="4" fill="#22C55E"/>
      <text x="30" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#22C55E" letter-spacing="0.5">
        BUILT FOR INDIAN PG &amp; HOSTEL OWNERS
      </text>
    </g>

    <!-- Main Headline -->
    <text x="0" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" letter-spacing="-1.5">
      Your PG, in your pocket.
    </text>

    <!-- Subheadline -->
    <text x="0" y="235" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">
      Who's paid, who's overdue, and which beds are free — in one glance.
    </text>

    <!-- Feature Bullet Points -->
    <g transform="translate(0, 280)">
      <!-- Bullet 1 -->
      <g transform="translate(0, 0)">
        <circle cx="12" cy="12" r="12" fill="#16A34A" fill-opacity="0.2"/>
        <path d="M7 12L10.5 15.5L17 9" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#E2E8F0">
          1-Tap WhatsApp rent reminders with GPay / UPI
        </text>
      </g>

      <!-- Bullet 2 -->
      <g transform="translate(0, 42)">
        <circle cx="12" cy="12" r="12" fill="#16A34A" fill-opacity="0.2"/>
        <path d="M7 12L10.5 15.5L17 9" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#E2E8F0">
          Live room &amp; vacant bed availability tracker
        </text>
      </g>

      <!-- Bullet 3 -->
      <g transform="translate(0, 84)">
        <circle cx="12" cy="12" r="12" fill="#16A34A" fill-opacity="0.2"/>
        <path d="M7 12L10.5 15.5L17 9" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#E2E8F0">
          Security deposit settlements with zero checkout disputes
        </text>
      </g>
    </g>

    <!-- Bottom Domain Tag -->
    <g transform="translate(0, 430)">
      <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#64748B">
        nivaops.com <tspan fill="#334155">·</tspan> <tspan fill="#22C55E">Free Setup Concierge Included</tspan>
      </text>
    </g>

  </g>

  <!-- Right Phone Mockup Card -->
  <g transform="translate(770, 75)" filter="url(#shadow)">
    <!-- Device Frame -->
    <rect x="0" y="0" width="350" height="480" rx="36" fill="#0F172A" stroke="#334155" stroke-width="3"/>
    
    <!-- Phone Screen Body -->
    <rect x="10" y="10" width="330" height="460" rx="28" fill="url(#cardGrad)"/>

    <!-- Dynamic Island -->
    <rect x="120" y="18" width="90" height="18" rx="9" fill="#0F172A"/>

    <!-- In-App Header -->
    <g transform="translate(26, 52)">
      <text x="0" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">StayB Hostel</text>
      <text x="0" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#64748B">Main Building · 32 Beds</text>
      <rect x="230" y="4" width="48" height="20" rx="10" fill="#16A34A" fill-opacity="0.15"/>
      <circle cx="242" cy="14" r="3" fill="#16A34A"/>
      <text x="250" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#16A34A">Live</text>
    </g>

    <!-- Quick Stats Card -->
    <g transform="translate(26, 100)">
      <rect x="0" y="0" width="298" height="56" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <line x1="100" y1="8" x2="100" y2="48" stroke="#F1F5F9" stroke-width="1.5"/>
      <line x1="200" y1="8" x2="200" y2="48" stroke="#F1F5F9" stroke-width="1.5"/>
      
      <!-- Stat 1 -->
      <text x="20" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#64748B">OCCUPIED</text>
      <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0F172A">28</text>

      <!-- Stat 2 -->
      <text x="118" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#D97706">VACANT</text>
      <text x="118" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#D97706">4 beds</text>

      <!-- Stat 3 -->
      <text x="218" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#E5484D">UNPAID</text>
      <text x="218" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#E5484D">₹15.5k</text>
    </g>

    <!-- Attention Required Card -->
    <g transform="translate(26, 172)">
      <rect x="0" y="0" width="298" height="150" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      
      <!-- Card Header -->
      <rect x="0" y="0" width="298" height="32" rx="14" fill="#FEF2F2"/>
      <circle cx="16" cy="16" r="4" fill="#E5484D"/>
      <text x="26" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#0F172A">ATTENTION REQUIRED</text>
      <rect x="220" y="7" width="68" height="18" rx="6" fill="#E5484D" fill-opacity="0.15"/>
      <text x="254" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#E5484D" text-anchor="middle">2 Overdue</text>

      <!-- Tenant Info -->
      <text x="16" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#0F172A">Rahul Sharma</text>
      <rect x="120" y="46" width="68" height="16" rx="4" fill="#E5484D" fill-opacity="0.1"/>
      <text x="154" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="800" fill="#E5484D" text-anchor="middle">3d overdue</text>
      <text x="16" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#64748B">Room 102 · Bed 2 · <tspan font-weight="700" fill="#0F172A">₹7,500</tspan></text>

      <!-- 1-Tap WhatsApp Reminder Button -->
      <g transform="translate(16, 94)">
        <rect x="0" y="0" width="266" height="40" rx="10" fill="#25D366" fill-opacity="0.15" stroke="#25D366" stroke-opacity="0.3" stroke-width="1"/>
        <circle cx="24" cy="20" r="10" fill="#25D366"/>
        <path d="M20 20C20 17.8 21.8 16 24 16C26.2 16 28 17.8 28 20C28 22.2 26.2 24 24 24C23.2 24 22.5 23.8 21.9 23.4L19 24L20.2 22.1C19.4 21.4 20 20 20 20Z" fill="#FFFFFF"/>
        <text x="44" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#15803D">
          Send WhatsApp Reminder with UPI
        </text>
      </g>
    </g>

    <!-- Bottom Navigation Bar inside phone -->
    <g transform="translate(26, 340)">
      <rect x="0" y="0" width="298" height="96" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <text x="16" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#64748B">VACANT BEDS</text>
      
      <!-- Bed Pills -->
      <g transform="translate(16, 38)">
        <rect x="0" y="0" width="58" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="29" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">R 101</text>
        <text x="29" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#16A34A" text-anchor="middle">Bed 1</text>

        <rect x="66" y="0" width="58" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="95" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">R 104</text>
        <text x="95" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#16A34A" text-anchor="middle">Bed 3</text>

        <rect x="132" y="0" width="58" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="161" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">R 202</text>
        <text x="161" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#16A34A" text-anchor="middle">Bed 2</text>

        <rect x="198" y="0" width="68" height="42" rx="8" fill="#16A34A" fill-opacity="0.1" stroke="#16A34A" stroke-opacity="0.3"/>
        <text x="232" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#16A34A" text-anchor="middle">+ Assign</text>
      </g>
    </g>

  </g>
</svg>
`;

const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 1200,
  },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

const outPath = path.resolve('public', 'og-image.png');
fs.writeFileSync(outPath, pngBuffer);
console.log(`Successfully generated ${outPath} (${pngBuffer.length} bytes)`);
