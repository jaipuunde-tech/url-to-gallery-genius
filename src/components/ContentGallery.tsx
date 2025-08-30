import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, FileText, Video, ExternalLink, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentItem {
  id: string;
  name: string;
  type: "text" | "video";
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

interface ContentGalleryProps {
  refreshTrigger: number;
}

export const ContentGallery = ({ refreshTrigger }: ContentGalleryProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  // Sample data for demonstration
  useEffect(() => {
    const sampleContent: ContentItem[] = [
      {
        id: "1",
        name: "Article Summary - Tech Trends 2024",
        type: "text",
        url: "#",
        createdAt: "2024-01-15"
      },
      {
        id: "2", 
        name: "Product Demo Video",
        type: "video",
        url: "#",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        createdAt: "2024-01-14"
      },
      {
        id: "3",
        name: "News Article Analysis",
        type: "text", 
        url: "#",
        createdAt: "2024-01-13"
      }
    ];
    setContent(sampleContent);
  }, []);

  const fetchFromGoogleDrive = async () => {
    if (!folderId.trim() || !apiKey.trim()) {
      toast({
        title: "Configuration Required",
        description: "Please enter both Google Drive folder ID and API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Google Drive API call to fetch files from folder
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,createdTime,webViewLink)`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from Google Drive");
      }
      
      const data = await response.json();
      
      const driveContent: ContentItem[] = data.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        type: file.mimeType.includes("video") ? "video" : "text",
        url: file.webViewLink,
        createdAt: file.createdTime.split('T')[0]
      }));
      
      setContent(driveContent);
      
      toast({
        title: "Content Loaded",
        description: `Successfully loaded ${driveContent.length} items from Google Drive.`,
      });
      
    } catch (error) {
      console.error("Error fetching from Google Drive:", error);
      toast({
        title: "Error",
        description: "Failed to fetch content from Google Drive. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (refreshTrigger > 0 && folderId && apiKey) {
      fetchFromGoogleDrive();
    }
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-card border-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-lg">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Google Drive Configuration</h3>
              <p className="text-sm text-muted-foreground">Connect your Google Drive folder to display generated content</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folderId" className="text-sm font-medium">
                Google Drive Folder ID
              </Label>
              <Input
                id="folderId"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                placeholder="1ABC2def3GHI4jkl5MNO6pqr7STU8vwx9"
                className="bg-input/50 border-border/50 focus:bg-background transition-smooth"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                Google Drive API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="bg-input/50 border-border/50 focus:bg-background transition-smooth"
              />
            </div>
          </div>
          
          <Button 
            onClick={fetchFromGoogleDrive}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Folder className="w-4 h-4 mr-2" />
                Load from Google Drive
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Content Gallery
          </h2>
          <span className="text-sm text-muted-foreground">
            {content.length} items
          </span>
        </div>

        {content.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-card shadow-card border-0">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Content Yet</h3>
                <p className="text-muted-foreground">
                  Generate some content above or configure Google Drive to see your generated files here.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-smooth border-0 cursor-pointer"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        item.type === "video" 
                          ? "bg-red-100 text-red-600" 
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {item.type === "video" ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === "video"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {item.type === "video" ? "Video" : "Text"}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-smooth"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  {item.thumbnailUrl && (
                    <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-smooth">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};