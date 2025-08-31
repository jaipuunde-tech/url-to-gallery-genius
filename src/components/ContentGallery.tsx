
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Video, Image, Play, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch media from Supabase storage bucket
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data: files, error } = await supabase.storage
          .from('media')
          .list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) {
          console.error('Error fetching media:', error);
          return;
        }

        const mediaItems: ContentItem[] = files
          .filter(file => file.name !== '.emptyFolderPlaceholder') // Filter out placeholder files
          .map(file => {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            const isVideo = ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(fileExtension || '');
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '');
            
            const { data: { publicUrl } } = supabase.storage
              .from('media')
              .getPublicUrl(file.name);

            return {
              id: file.id || file.name,
              name: file.name.split('.')[0], // Remove file extension for display
              type: isVideo ? 'video' as const : isImage ? 'image' as const : 'text' as const,
              url: publicUrl,
              thumbnailUrl: publicUrl, // For images, use the same URL. For videos, you might want to generate thumbnails
              createdAt: file.created_at || new Date().toISOString()
            };
          });

        setContent(mediaItems);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [refreshTrigger]);

  const getItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "image":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  return (
    <div className="space-y-16">
      {/* Gallery Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="block text-foreground">CREATIVE</span>
            <span className="block bg-gradient-accent bg-clip-text text-transparent">GALLERY</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore AI-generated masterpieces from creators worldwide
          </p>
        </div>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/30">
          <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            {content.length}
          </span>
          <span className="text-muted-foreground font-medium">Creative Works</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {content.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden bg-card/50 backdrop-blur-sm shadow-card hover:shadow-premium border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-pointer transform hover:scale-105 rounded-2xl"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] bg-muted/10 overflow-hidden">
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40">
                  {getItemIcon(item.type)}
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${getItemColor(item.type)}`}>
                  {getItemIcon(item.type)}
                  {item.type === "image" ? "IMAGE" : item.type === "video" ? "VIDEO" : "TEXT"}
                </span>
              </div>

              {/* Play Button for Videos */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-glow border-2 border-primary/30">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}

              {/* External Link Icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-6 space-y-3">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-smooth text-foreground">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
