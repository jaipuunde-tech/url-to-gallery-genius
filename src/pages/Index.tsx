import { useState } from "react";
import { URLGeneratorForm } from "@/components/URLGeneratorForm";
import { ContentGallery } from "@/components/ContentGallery";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Menu } from "lucide-react";

export default function Index() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContentGenerated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-card">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              CreativeAI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground/70 hover:text-foreground font-medium transition-smooth">Build</a>
            <a href="#" className="text-foreground/70 hover:text-foreground font-medium transition-smooth">Sell</a>
            <a href="#" className="text-foreground/70 hover:text-foreground font-medium transition-smooth">Use Cases</a>
            <a href="#" className="text-foreground/70 hover:text-foreground font-medium transition-smooth">Resources</a>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="font-semibold text-foreground hover:bg-muted">LOGIN</Button>
            <Button className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              SIGNUP
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-card">
              <span className="text-primary font-bold text-sm">#1 WHITE LABEL AI PLATFORM</span>
              <span className="text-lg">🚀</span>
              <span className="text-lg">⚡</span>
              <span className="text-lg">🔥</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-foreground">
              <span className="block">Build Custom</span>
              <span className="block bg-gradient-primary bg-clip-text text-transparent">AI Agents</span>
              <span className="block">for Any Business</span>
            </h1>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-start gap-4 text-left bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg text-foreground/80 font-medium">Answer customer questions about your business instantly</span>
              </div>
              <div className="flex items-start gap-4 text-left bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg text-foreground/80 font-medium">Generate new leads and collect data from within a conversation</span>
              </div>
              <div className="flex items-start gap-4 text-left bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg text-foreground/80 font-medium">Integrate AI into your website or any part of your business</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="px-10 py-6 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium hover:shadow-glow transition-premium group rounded-xl"
            >
              Start Building - It's Free
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-smooth" />
            </Button>
          </div>
          
          <p className="text-sm text-foreground/60 bg-white/50 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
            ⚡ Start building for free • No coding required • Takes 5 min or less
          </p>
        </div>
      </div>

      {/* Content Generator */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center">
          <URLGeneratorForm onContentGenerated={handleContentGenerated} />
        </div>
      </div>

      {/* Content Gallery */}
      <div className="container mx-auto px-6 py-16">
        <ContentGallery refreshTrigger={refreshTrigger} />
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-16 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-card">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CreativeAI Platform
            </h3>
            <p className="text-foreground/70 text-lg">
              Empowering creators worldwide with AI-driven tools
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}