
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Outcome {
  label: string;
  value: string;
  desc: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  hoverTitle: string;
  cat: string;
  url: string; 
  demoUrl?: string;
  repoUrl?: string;
  year: string;
  role: string;
  brief: string;
  strategy: string;
  technical: string;
  methodology: string[];
  ba_focus: string[];
  tech: string[];
  outcomes: Outcome[];
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayScrollRef = useRef<HTMLDivElement>(null);

  const items: ProjectDetail[] = [
    { 
      id: "01", 
      title: 'BANKING CORE SYSTEM', 
      hoverTitle: 'BANK', 
      cat: 'MIS', 
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000',
      demoUrl: 'https://demo.banking-system.thienphuc.vn',
      repoUrl: 'https://github.com/thienphuc/banking-core-v2',
      year: "2024",
      role: "Lead System Analyst",
      brief: "A digital transformation initiative for a tier-1 commercial bank, aiming to replace a 20-year-old legacy core with a modern microservices-based architecture.",
      strategy: "Conducted exhaustive 'As-Is' vs 'To-Be' gap analysis across 450+ unique business processes. Implemented a phased migration strategy using the Strangler Fig pattern to minimize operational risk.",
      technical: "Orchestrated a distributed system using Spring Boot and Apache Kafka for event-driven transactions. Designed a unified data schema to support real-time reporting and cross-platform sync.",
      methodology: [
        "Agile Scrum Framework", 
        "BABOK® Standards Alignment",
        "Business Process Re-engineering (BPR)", 
        "UAT (User Acceptance Testing) Coordination", 
        "Risk-based Data Migration"
      ],
      ba_focus: [
        "Elicitation: BRD & Functional Requirement Specs (FRS)", 
        "Modeling: UML Sequence & State Machine Diagrams", 
        "Stakeholder Matrix & Communication Mgmt", 
        "API Interface Mapping & Documentation",
        "User Journey Mapping for Retail Banking"
      ],
      tech: ["Java Spring Boot", "Kafka", "PostgreSQL", "Redis", "Docker", "AWS"],
      outcomes: [
        { label: "Throughput", value: "3.5x", desc: "Increased transaction processing capacity per second." },
        { label: "Latency", value: "-60%", desc: "Reduced end-to-end transaction time for retail customers." },
        { label: "Cost Saving", value: "$1.2M", desc: "Estimated annual savings on maintenance and legacy licensing." }
      ]
    },
    { 
      id: "02", 
      title: 'PREDICTIVE ANALYTICS', 
      hoverTitle: 'DATA', 
      cat: 'FINANCE', 
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
      demoUrl: 'https://bi-dashboard.thienphuc.io',
      repoUrl: 'https://github.com/thienphuc/financial-predictive-engine',
      year: "2023",
      role: "BI & Data Analyst",
      brief: "Development of a real-time financial health monitoring dashboard for small to medium enterprises (SMEs), utilizing predictive modeling for cash flow forecasting.",
      strategy: "Leveraged historical financial data to identify cyclical patterns. Designed a multi-tenant architecture to ensure data isolation while maintaining high availability.",
      technical: "Built an ETL pipeline using Python and Azure Data Factory. Implemented Random Forest regression models to predict cash flow deficits with high precision.",
      methodology: ["CRISP-DM", "Waterfall-Agile Hybrid", "Data Governance", "Model Validation"],
      ba_focus: ["Data Mapping", "KPI Definition", "Market Trend Analysis", "Decision Logic Documentation"],
      tech: ["Python (Pandas/Scikit-learn)", "Azure Data Factory", "Power BI", "Snowflake"],
      outcomes: [
        { label: "Accuracy", value: "94%", desc: "Precision of the 30-day cash flow forecast model." },
        { label: "Reporting", value: "Real-time", desc: "Eliminated the 2-week manual reporting cycle." },
        { label: "Insight Gap", value: "-80%", desc: "Reduced time from data collection to actionable insight." }
      ]
    },
    { 
      id: "03", 
      title: 'SECURITY PROTOCOL X', 
      hoverTitle: 'SECURITY', 
      cat: 'SECURITY', 
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000',
      demoUrl: 'https://iam-zero-trust.internal',
      repoUrl: 'https://github.com/thienphuc/protocol-x-iam',
      year: "2024",
      role: "Security Consultant",
      brief: "Redesigning the identity and access management (IAM) framework for a multinational corporation to align with Zero Trust security principles.",
      strategy: "Implemented a multi-factor authentication (MFA) rollout plan that integrated with existing legacy LDAP servers. Applied least-privilege access across all cloud resources.",
      technical: "Configured Okta as the primary Identity Provider. Developed custom middleware to bridge the gap between modern OAuth2/OIDC flows and legacy internal apps.",
      methodology: ["Zero Trust Framework", "ISO 27001 Compliance", "Threat Modeling", "Identity Lifecycle Mgmt"],
      ba_focus: ["Access Control Auditing", "Compliance Gap Analysis", "User Journey Mapping", "Policy Definition"],
      tech: ["Okta", "Azure AD", "Terraform", "Nginx", "OAuth2.0 / SAML"],
      outcomes: [
        { label: "Breach Risk", value: "-95%", desc: "Reduction in estimated risk of credential-based attacks." },
        { label: "UX Rating", value: "+40%", desc: "Increase in internal user satisfaction after SSO implementation." },
        { label: "Compliance", value: "100%", desc: "Passed all internal and external security audits." }
      ]
    }
  ];

  const categories = useMemo(() => ['ALL', ...new Set(items.map(item => item.cat))], [items]);
  const filteredItems = activeFilter === 'ALL' ? items : items.filter(item => item.cat === activeFilter);

  useEffect(() => {
    if (selectedProject) {
      // Fix: Use any-cast to bypass missing property error on window object for Lenis
      (window as any).lenis?.stop();
      document.body.style.overflow = 'hidden';
      if (overlayScrollRef.current) overlayScrollRef.current.scrollTop = 0;
    } else {
      // Fix: Use any-cast to bypass missing property error on window object for Lenis
      (window as any).lenis?.start();
      document.body.style.overflow = '';
    }
    
    return () => {
      // Fix: Use any-cast to bypass missing property error on window object for Lenis
      (window as any).lenis?.start();
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const handleFilterClick = (cat: string) => {
    setActiveFilter(cat);
    // Fix: Use any-cast to bypass missing property error on window object for Lenis
    if (sectionRef.current && (window as any).lenis) {
      (window as any).lenis.scrollTo(sectionRef.current, { offset: -100 });
    }
  };

  return (
    <div ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32 max-w-screen-2xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8 border-b border-white/5 pb-12">
        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">PROJECTS</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`mono text-[9px] tracking-[0.3em] uppercase whitespace-nowrap transition-all duration-300 ${
                activeFilter === cat 
                  ? 'text-white opacity-100 italic' 
                  : 'text-white/60 hover:text-white hover:translate-x-1 hover:italic'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="space-y-24 md:space-y-40">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((project, idx) => (
            <motion.div 
              key={project.id} 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              onClick={() => setSelectedProject(project)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group cursor-pointer"
            >
              <div className={`lg:col-span-8 aspect-[21/9] overflow-hidden bg-[#111] rounded-sm relative ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <motion.img 
                  src={project.url} 
                  alt={project.title}
                  whileHover={{ scale: 1.05, opacity: 0.2 }}
                  className="w-full h-full object-cover opacity-30 grayscale transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">{project.hoverTitle}</h3>
                </div>
              </div>

              <div className={`lg:col-span-4 ${idx % 2 !== 0 ? 'lg:order-1 lg:text-right' : ''}`}>
                 <div className={`flex items-center gap-3 mb-4 ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                   <span className="mono text-[10px] text-white/10">{project.id}</span>
                   <div className="w-8 h-[1px] bg-white/5" />
                 </div>
                 
                 <h4 
                  className={`text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4 opacity-25 group-hover:opacity-100 group-hover:scale-[1.03] group-hover:italic transition-all duration-700 ease-[0.215,0.61,0.355,1] ${
                    idx % 2 !== 0 
                    ? 'origin-right group-hover:-translate-x-4' 
                    : 'origin-left group-hover:translate-x-4'
                  }`}
                 >
                  {project.title}
                 </h4>
                 
                 <p className="mono text-[9px] text-white/20 uppercase tracking-[0.4em] mb-6">{project.cat} // {project.year}</p>
                 
                 <div className={`flex ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                    <button className="mono text-[8px] tracking-[0.3em] border border-white/10 px-6 py-2 rounded-full uppercase opacity-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500 hover:bg-white hover:text-black hover:opacity-100">VIEW CASE</button>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* DETAILED OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            ref={overlayScrollRef}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
            className="fixed inset-0 z-[300] bg-[#0a0a0a] overflow-y-auto px-6 py-10 md:p-12 lg:p-20 scroll-smooth"
          >
            <div className="max-w-screen-2xl mx-auto pb-40">
              <div className="flex justify-between items-start mb-20 md:mb-32">
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="mono text-[10px] opacity-40 hover:opacity-100 transition-all uppercase tracking-widest border border-white/10 px-10 py-4 rounded-full hover:bg-white hover:text-black"
                >
                  [ RETURN TO GALLERY ]
                </button>
                <div className="text-right hidden md:block">
                   <p className="mono text-[10px] opacity-20 uppercase mb-2">INDEX NO.</p>
                   <p className="mono text-2xl font-black">#{selectedProject.id}</p>
                </div>
              </div>

              <motion.h1 
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl sm:text-7xl md:text-[10vw] font-black tracking-tighter uppercase italic leading-[0.8] mb-12 text-white"
              >
                {selectedProject.title}
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-8 mb-24 border-b border-white/5 pb-12"
              >
                {selectedProject.demoUrl && (
                  <a 
                    href={selectedProject.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 mono text-[10px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    LIVE DEMO
                    <svg className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}
                {selectedProject.repoUrl && (
                  <a 
                    href={selectedProject.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 mono text-[10px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    SOURCE CODE
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">[GITHUB]</span>
                  </a>
                )}
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">
                <div className="lg:col-span-8 space-y-24">
                  {/* BRIEF SECTION */}
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-[1px] bg-white/20" />
                       <p className="mono text-[10px] opacity-40 tracking-[0.6em] uppercase">Context & Objectives</p>
                    </div>
                    <p className="text-2xl md:text-5xl font-light text-white/80 leading-[1.15] tracking-tight">
                      {selectedProject.brief}
                    </p>
                  </section>

                  {/* ANALYSIS & METHODOLOGY GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-10 border-t border-white/5">
                    {/* NEW METHODOLOGY SECTION */}
                    <section className="space-y-10">
                      <div className="flex items-center gap-4">
                        <span className="mono text-[8px] px-2 py-0.5 border border-white/20 rounded-sm opacity-40">FRAMEWORK</span>
                        <h5 className="mono text-[10px] tracking-[0.5em] uppercase opacity-20">Methodology</h5>
                      </div>
                      <ul className="space-y-6">
                        {selectedProject.methodology.map((m, i) => (
                          <li key={i} className="group flex items-baseline gap-4">
                            <span className="mono text-[10px] opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                            <span className="text-lg md:text-xl text-white/60 group-hover:text-white transition-colors leading-tight">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* NEW BA FOCUS SECTION */}
                    <section className="space-y-10">
                      <div className="flex items-center gap-4">
                        <span className="mono text-[8px] px-2 py-0.5 border border-white/20 rounded-sm opacity-40">ANALYSIS</span>
                        <h5 className="mono text-[10px] tracking-[0.5em] uppercase opacity-20">BA Focus Areas</h5>
                      </div>
                      <ul className="space-y-6">
                        {selectedProject.ba_focus.map((b, i) => (
                          <li key={i} className="group flex items-baseline gap-4">
                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white group-hover:scale-125 transition-all" />
                            <span className="text-lg md:text-xl text-white/60 group-hover:text-white transition-colors leading-tight">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  {/* STRATEGY & TECHNICAL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section className="space-y-8">
                      <p className="mono text-[10px] opacity-20 tracking-[0.5em] uppercase border-b border-white/5 pb-4">Strategy & Vision</p>
                      <p className="text-base md:text-xl text-white/50 leading-relaxed font-light">{selectedProject.strategy}</p>
                    </section>
                    <section className="space-y-8">
                      <p className="mono text-[10px] opacity-20 tracking-[0.5em] uppercase border-b border-white/5 pb-4">Technical Execution</p>
                      <p className="text-base md:text-xl text-white/50 leading-relaxed font-light">{selectedProject.technical}</p>
                    </section>
                  </div>

                  {/* METRICS */}
                  <section className="pt-20">
                    <p className="mono text-[10px] opacity-20 tracking-[0.5em] uppercase mb-16">Metrics of Success</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-20">
                      {selectedProject.outcomes.map((outcome, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="group border-l-[1px] border-white/10 pl-8 py-4 hover:border-white transition-colors"
                        >
                          <p className="mono text-[9px] opacity-30 uppercase tracking-widest mb-6 group-hover:text-white transition-colors">{outcome.label}</p>
                          <h4 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 transition-all group-hover:translate-x-2">{outcome.value}</h4>
                          <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider font-medium">{outcome.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* SIDEBAR METADATA */}
                <div className="lg:col-span-4 space-y-20">
                  <div className="grid grid-cols-2 gap-12 mono text-[10px] uppercase tracking-widest border-t border-white/10 pt-10">
                    <div>
                      <p className="opacity-20 mb-3">Professional Role</p>
                      <p className="font-bold opacity-100 text-white italic">{selectedProject.role}</p>
                    </div>
                    <div>
                      <p className="opacity-20 mb-3">Release Year</p>
                      <p className="font-bold opacity-100 text-white">{selectedProject.year}</p>
                    </div>
                  </div>

                  <section className="space-y-8">
                    <p className="mono text-[10px] opacity-30 tracking-[0.6em] uppercase italic flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[7px] font-bold not-italic">01</span>
                      System Design
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech.map((t, i) => (
                        <span key={i} className="mono text-[10px] px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/50 hover:bg-white hover:text-black transition-all cursor-default uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="p-8 border border-white/5 rounded-sm bg-white/[0.02]">
                    <p className="mono text-[8px] opacity-20 tracking-widest uppercase mb-6">Documentation Status</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="mono text-[9px] opacity-40">BRD / FRS</span>
                        <span className="text-[9px] text-green-500 uppercase font-bold tracking-widest italic">Verified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="mono text-[9px] opacity-40">UML MODELS</span>
                        <span className="text-[9px] text-green-500 uppercase font-bold tracking-widest italic">Approved</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="mono text-[9px] opacity-40">TRACEABILITY</span>
                        <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest italic">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
