"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Circle, Square, Triangle, ArrowRight, Search, Activity, CornerUpRight, Terminal, Database } from "lucide-react";

const LOADING_STEPS = [
  "INIT research_pipeline...",
  "$ web_search --query <topic>",
  "$ scrape_url --depth=full",
  "$ synthesize_findings.py",
  "$ generate_markdown_report.py",
  "$ critique_output --quality=max",
  "$ finalize_response --format=md",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("report");

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 7000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);
    setLoadingStep(0);
    setActiveTab("report");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to conduct research. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Main Hero Section */}
      <main className="flex-grow">
        <section className="bg-[#F0F0F0] py-16 px-4 md:py-24 border-b-4 border-black relative overflow-hidden pattern-dots">
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#D02020] rounded-full opacity-30"></div>
              <div className="inline-flex items-center space-x-2 border-2 md:border-4 border-black bg-[#F0C020] px-4 py-2 font-bold tracking-widest text-sm mb-8 uppercase shadow-bauhaus-sm">
                <Circle size={14} className="fill-black" />
                <span>System Active</span>
              </div>
              <h1 className="heading-mega mb-6 relative z-10 text-black">
                AI <br />
                <span className="text-[#D02020]">Research</span><br />
                Agent
              </h1>
              <p className="text-xl font-medium mb-8 max-w-lg border-l-4 border-[#1040C0] pl-4 py-2 bg-white/50">
                Distributed research swarm orchestrated by intelligent agents. Constructivist modernist architecture.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -top-12 -right-12 w-48 h-48 md:w-64 md:h-64 bg-[#1040C0] rounded-full opacity-30 hidden md:block"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 md:w-48 md:h-48 bg-[#D02020] rotate-45 opacity-30 hidden md:block"></div>
              
              {/* Search Console */}
              <form onSubmit={handleSubmit} className="card-bauhaus bg-white relative z-10 w-full max-w-xl mx-auto lg:mx-0">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#1040C0] rounded-bl-none"></div>
                <div className="absolute -left-4 top-1/2 w-8 h-8 bg-[#F0C020] border-4 border-black rotate-45 transform -translate-y-1/2 -z-10"></div>
                <div className="mb-2">
                  <label className="font-black text-2xl uppercase mb-6 border-b-4 border-black pb-2 flex items-center justify-between">
                    <span>Input Stream</span>
                    <Triangle size={24} className="fill-black rotate-180" />
                  </label>
                  <div className="flex flex-col gap-5">
                    <input
                      type="text"
                      className="input-bauhaus"
                      placeholder="ENTER TOPIC HERE..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button type="submit" disabled={isLoading || !topic.trim()} className="btn-primary flex-1 flex justify-center items-center gap-2 text-lg">
                        Initiate <ArrowRight size={24} />
                      </button>
                      <button type="button" onClick={() => setTopic("")} className="btn-outline sm:w-1/3">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <section className="bg-[#D02020] py-12 px-4 border-b-4 border-black">
            <div className="max-w-2xl mx-auto card-bauhaus bg-white flex flex-col items-center text-center">
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-black border-r-transparent"></div>
              <div className="w-16 h-16 bg-[#D02020] rotate-45 border-4 border-black flex items-center justify-center mb-6">
                 <Square size={24} className="fill-white rotate-45 text-white" />
              </div>
              <h2 className="heading-large text-[#D02020] mb-4">System Panic</h2>
              <p className="font-bold text-xl mb-8 border-4 border-black p-4 bg-[#F0F0F0] w-full">{error}</p>
              <button onClick={() => setError(null)} className="btn-bauhaus bg-black text-white hover:bg-gray-800">
                Acknowledge
              </button>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="bg-[#F0C020] border-b-4 border-black py-16 px-4 pattern-dots">
            <div className="max-w-3xl mx-auto card-bauhaus bg-white relative">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#D02020] rounded-full border-b-4 border-l-4 border-black -mt-4 -mr-4 z-10"></div>
              <h2 className="heading-large mb-8 flex items-center gap-4">
                <Activity size={40} className="text-[#D02020]" /> Processing
              </h2>
              <div className="border-4 border-black p-6 bg-white shadow-inner mb-2">
                <div className="font-black text-xl uppercase tracking-wider border-b-4 border-black pb-3 mb-4 flex justify-between">
                  <span>Execution Trace</span>
                  <span className="text-[#1040C0]">STEP {loadingStep + 1}/{LOADING_STEPS.length}</span>
                </div>
                <p className="font-mono text-xl font-bold bg-[#E0E0E0] p-4 border-2 border-black inline-block w-full">{LOADING_STEPS[loadingStep]}</p>
                <div className="mt-8 border-4 border-black h-12 relative w-full bg-[#E0E0E0] p-1">
                  <div 
                     className="bg-[#1040C0] h-full transition-all duration-500 ease-out flex items-center justify-end px-2"
                     style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  >
                    <div className="w-2 h-full bg-white opacity-50 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results Display */}
        {results && !isLoading && (
          <section className="bg-[#1040C0] py-16 px-4 border-b-4 border-black flex-grow">
            <div className="max-w-5xl mx-auto">
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("report")}
                  className={`btn-bauhaus ${activeTab === "report" ? "bg-[#D02020] text-white shadow-bauhaus-none translate-x-[2px] translate-y-[2px]" : "bg-white text-black"}`}
                >
                  <span className="flex items-center gap-2"><Terminal size={18} /> Report</span>
                </button>
                <button
                  onClick={() => setActiveTab("critique")}
                  className={`btn-bauhaus ${activeTab === "critique" ? "bg-[#F0C020] text-black shadow-bauhaus-none translate-x-[2px] translate-y-[2px]" : "bg-white text-black"}`}
                >
                   <span className="flex items-center gap-2"><Activity size={18} /> Critique</span>
                </button>
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`btn-bauhaus ${activeTab === "raw" ? "bg-black text-white shadow-bauhaus-none translate-x-[2px] translate-y-[2px]" : "bg-white text-black"}`}
                >
                   <span className="flex items-center gap-2"><Database size={18} /> Raw Data</span>
                </button>
              </div>

              {/* Report Tab */}
              {activeTab === "report" && (
                <div className="card-bauhaus bg-white w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                   <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-l-[48px] border-t-[#D02020] border-l-transparent"></div>
                   <h2 className="heading-large mb-8 pb-4 border-b-8 border-black text-black flex items-center gap-4">
                     <span className="bg-[#1040C0] text-white p-2 border-4 border-black"><Terminal size={32} /></span>
                     Final Report
                   </h2>
                   <div className="prose-bauhaus">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                       {results.writer_result || "No report generated."}
                     </ReactMarkdown>
                   </div>
                </div>
              )}

              {/* Critique Tab */}
              {activeTab === "critique" && (
                <div className="card-bauhaus bg-white w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                   <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-[#F0C020]"></div>
                   <h2 className="heading-large mb-8 pb-4 border-b-8 border-black text-black flex items-center gap-4">
                     <span className="bg-[#F0C020] text-black p-2 border-4 border-black"><Activity size={32} /></span> 
                     Evaluation
                   </h2>
                   <div className="prose-bauhaus">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                       {results.critic_result || "No critique available."}
                     </ReactMarkdown>
                   </div>
                </div>
              )}

              {/* Raw Data Tab */}
              {activeTab === "raw" && (
                <div className="space-y-12">
                  <div className="card-bauhaus bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="absolute top-0 right-0 w-8 h-8 rounded-none bg-[#121212]"></div>
                    <h2 className="heading-large mb-6 pb-4 border-b-8 border-black flex justify-between items-center bg-[#F0F0F0] px-4 pt-4 border-4 border-b-0">
                      Search Results
                      <Search size={32} className="text-[#1040C0]" />
                    </h2>
                    <pre className="bg-[#121212] tracking-wider text-[#33ff00] border-4 border-black p-6 font-mono text-xs md:text-sm overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto uppercase shadow-inner">
                      {results.search_result || "No search results..."}
                    </pre>
                  </div>
                  <div className="card-bauhaus bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-[#D02020] border-l-transparent"></div>
                    <h2 className="heading-large mb-6 pb-4 border-b-8 border-black flex justify-between items-center bg-[#F0F0F0] px-4 pt-4 border-4 border-b-0">
                      Scraped Content
                      <Database size={32} className="text-[#D02020]" />
                    </h2>
                    <pre className="bg-[#121212] tracking-wider text-[#E0E0E0] border-4 border-black p-6 font-mono text-xs md:text-sm overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto shadow-inner">
                      {results.reader_result || "No content data..."}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-12 px-6 border-t-8 border-[#F0C020]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#1040C0] opacity-90 mix-blend-screen"></div>
              <div className="w-10 h-10 rounded-none bg-[#D02020] opacity-90 mix-blend-screen rotate-12"></div>
              <div className="w-10 h-10 bg-[#F0C020] opacity-90 mix-blend-screen" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-xl border-l-4 border-white pl-4">AI.Agent Core</span>
          </div>
          <div className="flex gap-8 font-bold uppercase tracking-widest text-sm">
            <a href="#" className="hover:text-[#F0C020] hover:underline decoration-4 underline-offset-4 transition-colors flex items-center gap-2">Github <CornerUpRight size={16}/></a>
            <a href="#" className="hover:text-[#D02020] hover:underline decoration-4 underline-offset-4 transition-colors flex items-center gap-2">Docs <CornerUpRight size={16}/></a>
            <a href="#" className="hover:text-[#1040C0] hover:underline decoration-4 underline-offset-4 transition-colors flex items-center gap-2">Issues <CornerUpRight size={16}/></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
