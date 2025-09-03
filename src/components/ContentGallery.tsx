import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ContentItem {
  id: string;
  name: string;
  url: string;
  type: "video" | "image";
}

interface ContentGalleryProps {
  refreshTrigger: number;
}

export const ContentGallery = ({ refreshTrigger }: ContentGalleryProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [previousCount, setPreviousCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const POLLING_INTERVAL = 10000; // Check every 10 seconds

  // Fetch data from Google Sheets CSV
  const fetchContentFromSheet = useCallback(async () => {
    try {
      const response = await fetch('https://docs.google.com/spreadsheets/d/1zkq7fkZqC0-vEUjojhCk_N9hWnqaNXcMKDMPUQ-F4_E/export?format=csv');
      const csvText = await response.text();
      
      // Parse CSV data
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const linksIndex = headers.indexOf('links');
      const nameIndex = headers.indexOf('name');
      const typeIndex = headers.indexOf('type');
      
      if (linksIndex === -1 || nameIndex === -1 || typeIndex === -1) {
        console.error('Required columns (links, name, type) not found in CSV');
        return;
      }
      
      const contentItems: ContentItem[] = lines.slice(1)
        .filter(line => line.trim()) // Remove empty lines
        .map((line, index) => {
          const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
          const type = columns[typeIndex]?.toLowerCase();
          return {
            id: `item-${index}`,
            name: columns[nameIndex] || `Item ${index + 1}`,
            url: columns[linksIndex] || '',
            type: (type === 'video' || type === 'image') ? type as "video" | "image" : 'image'
          };
        })
        .filter(item => item.url); // Only include items with valid URLs
      
      // Check if new items were added
      if (contentItems.length > previousCount && previousCount > 0) {
        console.log(`New items detected: ${contentItems.length - previousCount} new items added`);
      }
      
      setContent(contentItems.reverse());
      setPreviousCount(contentItems.length);
    } catch (error) {
      console.error('Error fetching content from Google Sheets:', error);
    }
  }, [previousCount]);

  // Initial fetch and manual refresh trigger
  useEffect(() => {
    fetchContentFromSheet();
  }, [refreshTrigger, fetchContentFromSheet]);

  // Auto-refresh polling
  useEffect(() => {
    // Start polling after initial load
    if (content.length > 0) {
      intervalRef.current = setInterval(() => {
        fetchContentFromSheet();
      }, POLLING_INTERVAL);
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [content.length, fetchContentFromSheet]);

  const isEmbeddableUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || 
           url.includes('vimeo.com') || url.includes('instagram.com') ||
           url.includes('twitter.com') || url.includes('x.com') ||
           url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  };

  const getEmbedContent = (url: string, type: "video" | "image") => {
    // YouTube embed - use embed URL for better integration
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            loading="lazy"
          />
        );
      }
    }
    
    // Vimeo embed
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=0&muted=1`}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Vimeo video"
            loading="lazy"
          />
        );
      }
    }
    
    // Direct image URLs
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return (
        <img 
          src={url} 
          alt="Content"
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-orange-500/20';
            fallback.innerHTML = '<div class="text-center space-y-2"><svg class="w-8 h-8 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg><p class="text-xs text-red-400 font-medium">Image Failed</p></div>';
            target.parentElement?.appendChild(fallback);
          }}
          loading="lazy"
        />
      );
    }
    
    // For all other URLs - embed the full website
    return (
      <iframe
        src={url}
        className="w-full h-full border-0"
        title={`Embedded content from ${new URL(url).hostname}`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40';
          fallback.innerHTML = '<div class="text-center space-y-2"><svg class="w-8 h-8 text-muted-foreground mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1m0 0l4-4a4 4 0 105.656-5.656l-1.1 1.102m-2.598-2.598l4 4"></path></svg><p class="text-xs text-muted-foreground font-medium">Website Preview</p></div>';
          target.parentElement?.appendChild(fallback);
        }}
      />
    );
  };

  // Separate content by type
  const images = content.filter(item => item.type === 'image');
  const videos = content.filter(item => item.type === 'video');

  const renderContentGrid = (items: ContentItem[], title: string) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-md border border-border">
          <span className="text-sm font-semibold text-primary">{items.length}</span>
          <span className="text-muted-foreground text-xs">items</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden bg-card shadow-card hover:shadow-card-hover border border-border hover:border-primary/20 transition-all duration-300 rounded-lg"
          >
            {/* Embedded Content */}
            <div className={`relative bg-muted/30 overflow-hidden ${
              item.type === 'video' ? 'aspect-[9/16]' : 'aspect-square'
            }`}>
              {getEmbedContent(item.url, item.type)}
              
              {/* Overlay - only show on non-iframe content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
              
              {/* External Link Icon */}
              
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Gallery Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Content Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore AI-generated content from URLs across the web
          </p>
        </div>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-muted rounded-lg border border-border">
          <span className="text-lg font-semibold text-primary">
            {content.length}
          </span>
          <span className="text-muted-foreground text-sm font-medium">Generated Items</span>
        </div>
      </div>

      {/* Partitioned Gallery - Images Left, Videos Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section - Left Side */}
        <div className="space-y-6">
          {renderContentGrid(images, "Images")}
        </div>
        
        {/* Videos Section - Right Side */}
        <div className="space-y-6">
          {renderContentGrid(videos, "Videos")}
        </div>
      </div>
    </div>
  );
};
