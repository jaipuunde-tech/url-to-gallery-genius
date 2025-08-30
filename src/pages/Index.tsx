
import { useState } from "react";
import { URLGeneratorForm } from "@/components/URLGeneratorForm";
import { ContentGallery } from "@/components/ContentGallery";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContentGenerated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                AI Content Studio
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform any URL into stunning visual content with the power of artificial intelligence
              </p>
            </div>
            
            {/* Generator Form */}
            <div className="pt-8">
              <URLGeneratorForm onContentGenerated={handleContentGenerated} />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <ContentGallery refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
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
