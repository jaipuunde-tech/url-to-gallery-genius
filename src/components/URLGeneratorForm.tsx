import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Link, FileText, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface URLGeneratorFormProps {
  onContentGenerated: () => void;
}

export const URLGeneratorForm = ({ onContentGenerated }: URLGeneratorFormProps) => {
  const [url, setUrl] = useState("");
  const [contentType, setContentType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://n8n.srv936319.hstgr.cloud/webhook-test/b7382a9f-9548-4e13-9318-58b0fc2d4451");
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

    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook URL Required", 
        description: "Please enter your n8n webhook URL to process the content.",
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
        title: "Request Sent Successfully!",
        description: `Your ${contentType} generation request has been sent to n8n. Check your workflow for processing status.`,
      });

      onContentGenerated();
      
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send request to n8n webhook. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-card hover:shadow-card-hover transition-smooth border-0">
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full animate-float">
            <Link className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            URL to Content Generator
          </h2>
          <p className="text-muted-foreground">
            Transform any URL into engaging text or video content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Website URL
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="h-12 bg-input/50 border-border/50 focus:bg-background transition-smooth"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook" className="text-sm font-medium">
              n8n Webhook URL
            </Label>
            <Input
              id="webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="h-12 bg-input/50 border-border/50 focus:bg-background transition-smooth"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Content Type</Label>
            <RadioGroup 
              value={contentType} 
              onValueChange={setContentType}
              className="grid grid-cols-2 gap-4"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-smooth cursor-pointer">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4 text-primary" />
                  Text Content
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-smooth cursor-pointer">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                  <Video className="w-4 h-4 text-primary" />
                  Video Content
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            variant="generate"
            size="lg"
            className="w-full h-14 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating {contentType}...
              </>
            ) : (
              <>
                Generate {contentType === "text" ? "Text" : "Video"}
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};