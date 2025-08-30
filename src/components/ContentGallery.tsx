
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, FileText, Video, RefreshCw, Settings, Image, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  name: string;
  type: "image" | "video" | "text";
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
  const [folderId, setFolderId] = useState("1iSkWeB7FcJ1pNx4c6Rx_XBjft5UeIovP");
  const [apiKey, setApiKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();

  // Enhanced sample data with better variety
  useEffect(() => {
    const sampleContent: ContentItem[] = [
      {
        id: "1",
        name: "AI Generated Landscape",
        type: "image",
        url: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        createdAt: "2024-01-20"
      },
      {
        id: "2", 
        name: "Product Demo Animation",
        type: "video",
        url: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        createdAt: "2024-01-19"
      },
      {
        id: "3",
        name: "Abstract Art Creation",
        type: "image", 
        url: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        createdAt: "2024-01-18"
      },
      {
        id: "4",
        name: "Tutorial Video",
        type: "video",
        url: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
        createdAt: "2024-01-17"
      },
      {
        id: "5",
        name: "Brand Identity Design",
        type: "image",
        url: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
        createdAt: "2024-01-16"
      },
      {
        id: "6",
        name: "Motion Graphics Reel",
        type: "video",
        url: "#",
        thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
        createdAt: "2024-01-15"
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
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,createdTime,webViewLink,thumbnailLink)`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from Google Drive");
      }
      
      const data = await response.json();
      
      const driveContent: ContentItem[] = data.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        type: file.mimeType.includes("video") ? "video" : file.mimeType.includes("image") ? "image" : "text",
        url: file.webViewLink,
        thumbnailUrl: file.thumbnailLink,
        createdAt: file.createdTime.split('T')[0]
      }));
      
      setContent(driveContent);
      
      toast({
        title: "Gallery Updated",
        description: `Successfully loaded ${driveContent.length} items from your Drive.`,
      });
      
    } catch (error) {
      console.error("Error fetching from Google Drive:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to Google Drive. Please check your settings.",
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

  const getItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-600";
      case "image":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Configuration Panel - Collapsible */}
      <Card className="bg-gradient-card shadow-card border-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-xl">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gallery Settings</h3>
                <p className="text-sm text-muted-foreground">Configure your Google Drive connection</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowConfig(!showConfig)}
              className="text-sm"
            >
              {showConfig ? "Hide" : "Show"} Settings
            </Button>
          </div>
          
          {showConfig && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="folderId" className="text-sm font-medium">
                    Google Drive Folder ID
                  </Label>
                  <Input
                    id="folderId"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    placeholder="Folder ID from Drive URL"
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
                    placeholder="Your API key"
                    className="bg-input/50 border-border/50 focus:bg-background transition-smooth"
                  />
                </div>
              </div>
              
              <Button 
                onClick={fetchFromGoogleDrive}
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Folder className="w-4 h-4 mr-2" />
                    Sync Gallery
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Content Gallery
          </h2>
          <p className="text-muted-foreground">
            Your AI-generated content collection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
            {content.length} items
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      {content.length === 0 ? (
        <Card className="p-16 text-center bg-gradient-card shadow-card border-0">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted/20 rounded-2xl">
              <Folder className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Your Gallery Awaits</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Generate your first piece of content to see it appear here in your personal gallery.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-smooth border-0 cursor-pointer transform hover:scale-105"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted/10 overflow-hidden">
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40">
                    {getItemIcon(item.type)}
                  </div>
                )}
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getItemColor(item.type)}`}>
                    {getItemIcon(item.type)}
                    {item.type === "image" ? "Image" : item.type === "video" ? "Video" : "Text"}
                  </span>
                </div>

                {/* Play Button for Videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="p-6 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-smooth">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(item.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
