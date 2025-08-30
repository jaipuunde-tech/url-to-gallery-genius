
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Image, Video } from "lucide-react";
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
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 bg-gradient-card shadow-card hover:shadow-card-hover transition-smooth border-0">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-button">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Content Generator
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Transform any URL into stunning visual content with AI
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="url" className="text-base font-semibold">
                Website URL
              </Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-content"
                className="h-14 text-base bg-input/50 border-border/50 focus:bg-background transition-smooth rounded-xl"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Content Type</Label>
              <RadioGroup 
                value={contentType} 
                onValueChange={setContentType}
                className="grid grid-cols-2 gap-4"
                disabled={isLoading}
              >
                <div className="group">
                  <div className="flex items-center space-x-3 p-6 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-smooth cursor-pointer group-hover:bg-accent/10">
                    <RadioGroupItem value="image" id="image" className="w-5 h-5" />
                    <Label htmlFor="image" className="flex items-center gap-3 cursor-pointer text-base">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <Image className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Image Content</span>
                    </Label>
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-center space-x-3 p-6 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-smooth cursor-pointer group-hover:bg-accent/10">
                    <RadioGroupItem value="video" id="video" className="w-5 h-5" />
                    <Label htmlFor="video" className="flex items-center gap-3 cursor-pointer text-base">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                        <Video className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium">Video Content</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-16 text-lg font-semibold rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating {contentType}...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate {contentType === "image" ? "Image" : "Video"}
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
