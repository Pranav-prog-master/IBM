const PATHS = {
  book:    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round"/>,
  pencil:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/></>,
  bulb:    <><line x1="9" y1="18" x2="15" y2="18" strokeLinecap="round"/><line x1="10" y1="22" x2="14" y2="22" strokeLinecap="round"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" strokeLinecap="round" strokeLinejoin="round"/></>,
  trophy:  <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 22h16" strokeLinecap="round"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" strokeLinecap="round" strokeLinejoin="round"/></>,
  check:   <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>,
  wifi:    <><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" strokeLinecap="round"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" strokeLinecap="round"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9" strokeLinecap="round"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" strokeLinecap="round"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeLinecap="round"/><line x1="12" y1="20" x2="12.01" y2="20" strokeLinecap="round"/></>,
  send:    <><line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  x:       <><line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/></>,
  home:    <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/></>,
  list:    <><line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round"/></>,
  bar:     <><line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round"/></>,
  flame:   <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" strokeLinecap="round" strokeLinejoin="round"/>,
  clock:   <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></>,
  alert:   <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/></>,
  plus:    <><line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/></>,
  undo:    <><polyline points="9 14 4 9 9 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 20v-7a4 4 0 0 0-4-4H4" strokeLinecap="round" strokeLinejoin="round"/></>,
  trash:   <><polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" strokeLinecap="round"/></>,
}

export default function Icon({ name, size = 20, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" aria-hidden="true"
      style={style} className={className}>
      {PATHS[name]}
    </svg>
  )
}
