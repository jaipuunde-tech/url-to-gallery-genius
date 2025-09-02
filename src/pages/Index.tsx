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
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-foreground">
              URL to Social Media
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Build</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Sell</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Use Cases</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Resources</a>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Login
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium px-4">
                  Signup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    #1 URL-TO-SOCIAL PLATFORM
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                    Transform Any Website into
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Viral Social Media Content</span>
                  </h1>
                  
                  <div className="space-y-4 text-lg text-muted-foreground max-w-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span>Turn any website URL into engaging social media posts, stories, and videos</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span>Create scroll-stopping content that drives engagement and clicks</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span>Perfect for marketers, creators, and businesses looking to amplify their reach</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    size="lg" 
                    className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-lg transition-smooth"
                  >
                    Create Your First Post - Free
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                      Generate stunning social content in seconds • No design skills needed
                    </span>
                  </div>
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
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-foreground">
              URL Gallery Genius
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by advanced AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;