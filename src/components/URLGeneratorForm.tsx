import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Image, Video, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface URLGeneratorFormProps {
  onContentGenerated: () => void;
}

export const URLGeneratorForm = ({ onContentGenerated }: URLGeneratorFormProps) => {
  const [url, setUrl] = useState("");
  const [contentType, setContentType] = useState("image");
  const [isLoading, setIsLoading] = useState(false);
  const webhookUrl = "https://n8n.srv936319.hstgr.cloud/webhook-test/df9065fd-baab-43bb-9b05-5bcbf7fe1ec9";
  const { toast } = useToast();

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to generate content.",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          url: url,
          contentType: contentType,
          timestamp: new Date().toISOString(),
          source: "url-generator"
        }),
      });

      toast({
        title: "Content Generation Started!",
        description: `Your ${contentType} is being generated. Check your gallery in a few moments.`,
      });

      onContentGenerated();
      setUrl("");
      
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="p-6 bg-card shadow-premium border border-border rounded-lg">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                AI Content Generator
              </h2>
              <p className="text-sm text-muted-foreground">
                Transform URLs into visual content
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium text-foreground">
                Website URL
              </Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary transition-smooth rounded-md text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Content Type</Label>
              <RadioGroup 
                value={contentType} 
                onValueChange={setContentType}
                className="grid grid-cols-2 gap-2"
                disabled={isLoading}
              >
                <div className="group">
                  <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth cursor-pointer">
                    <RadioGroupItem value="image" id="image" className="w-4 h-4" />
                    <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-500/10 rounded-md">
                        <Image className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-foreground">Images</span>
                    </Label>
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth cursor-pointer">
                    <RadioGroupItem value="video" id="video" className="w-4 h-4" />
                    <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <div className="flex items-center justify-center w-6 h-6 bg-red-500/10 rounded-md">
                        <Video className="w-3 h-3 text-red-600" />
                      </div>
                      <span className="text-foreground">Videos</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};