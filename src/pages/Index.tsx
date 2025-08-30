import { useState } from "react";
import { URLGeneratorForm } from "@/components/URLGeneratorForm";
import { ContentGallery } from "@/components/ContentGallery";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContentGenerated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              DIGITAL CREATORS
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Gallery</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Generate</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-none">
                      <span className="block text-foreground">DIGITAL</span>
                      <span className="block bg-gradient-accent bg-clip-text text-transparent">CREATORS</span>
                    </h1>
                    <div className="flex items-center gap-4 text-4xl md:text-5xl font-bold">
                      <span className="bg-gradient-accent bg-clip-text text-transparent">AI STUDIO</span>
                      <ArrowRight className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                    Transform any URL into stunning visual content with the power of artificial intelligence
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <Button 
                    size="lg" 
                    className="h-16 px-8 bg-gradient-accent text-accent-foreground font-bold text-lg rounded-2xl shadow-glow hover:shadow-button transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Start Creating
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-16 px-8 border-2 border-primary/30 text-foreground hover:bg-primary/10 font-semibold text-lg rounded-2xl"
                  >
                    View Gallery
                  </Button>
                </div>
              </div>

              {/* Right Content - Generator Form */}
              <div className="flex justify-center lg:justify-end">
                <URLGeneratorForm onContentGenerated={handleContentGenerated} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ContentGallery refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              DIGITAL CREATORS
            </div>
            <p className="text-muted-foreground">
              Powered by advanced AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;