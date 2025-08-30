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
  const webhookUrl = "https://n8n.srv936319.hstgr.cloud/webhook-test/b7382a9f-9548-4e13-9318-58b0fc2d4451";
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
      <Card className="p-8 bg-card/80 backdrop-blur-xl shadow-premium border border-border/50 rounded-3xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl shadow-glow">
              <Zap className="w-8 h-8 text-accent-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                AI Generator
              </h2>
              <p className="text-muted-foreground">
                Create stunning content instantly
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="url" className="text-sm font-semibold text-foreground">
                Website URL
              </Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-12 bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input/80 transition-smooth rounded-xl text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">Content Type</Label>
              <RadioGroup 
                value={contentType} 
                onValueChange={setContentType}
                className="grid grid-cols-2 gap-3"
                disabled={isLoading}
              >
                <div className="group">
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-smooth cursor-pointer">
                    <RadioGroupItem value="image" id="image" className="w-4 h-4" />
                    <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
                        <Image className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-foreground">Images</span>
                    </Label>
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-smooth cursor-pointer">
                    <RadioGroupItem value="video" id="video" className="w-4 h-4" />
                    <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg">
                        <Video className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-foreground">Videos</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-accent text-accent-foreground font-bold text-base rounded-xl shadow-glow hover:shadow-button transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
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