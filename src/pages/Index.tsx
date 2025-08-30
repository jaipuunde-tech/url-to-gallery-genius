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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              URL to Gallery Genius
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any URL into engaging content and automatically organize it in your personal gallery
            </p>
          </div>

          {/* Generator Form */}
          <div className="max-w-2xl mx-auto">
            <URLGeneratorForm onContentGenerated={handleContentGenerated} />
          </div>

          {/* Content Gallery */}
          <ContentGallery refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Index;
