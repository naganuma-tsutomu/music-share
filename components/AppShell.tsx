'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddMusicForm from './AddMusicForm';
import { Home, Search, Plus, Youtube, Music, Disc, X } from 'lucide-react'; // Import icons from lucide-react
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<'home' | 'search' | 'add' | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleView = (view: 'home' | 'search' | 'add') => {
      setActiveView(current => current === view ? null : view);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Activity Bar */}
      <div className="w-14 flex-shrink-0 bg-muted/40 border-r border-border flex flex-col items-center py-4 gap-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toggleView('home');
            router.push('/');
          }}
          className={cn(
            "rounded-md transition-all relative h-10 w-10",
            activeView === 'home' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          title="Explorer"
        >
          <Home className="w-5 h-5" />
           {activeView === 'home' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleView('search')}
          className={cn(
            "rounded-md transition-all relative h-10 w-10",
            activeView === 'search' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          title="Search"
        >
          <Search className="w-5 h-5" />
           {activeView === 'search' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleView('add')}
          className={cn(
            "rounded-md transition-all relative h-10 w-10",
            activeView === 'add' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          title="New Post"
        >
          <Plus className="w-5 h-5" />
           {activeView === 'add' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />}
        </Button>
      </div>

      {/* Side Panel (Only for Home and Search) */}
      {(activeView === 'home' || activeView === 'search') && (
        <div className="w-80 bg-muted/10 border-r border-border flex flex-col flex-shrink-0 transition-all h-full animate-in slide-in-from-left-5 duration-200">
            <div className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between items-center border-b border-border h-14">
                <span>{activeView === 'home' ? 'Explorer' : 'Search'}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {activeView === 'search' && (
                    <div className="p-4 space-y-4">
                         <div className="space-y-2">
                             <label className="text-xs font-medium text-muted-foreground">KEYWORD</label>
                             <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search..." 
                                    className="pl-8"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    defaultValue={searchParams.get('q')?.toString()}
                                />
                             </div>
                         </div>
                         
                         <div className="space-y-2">
                             <label className="text-xs font-medium text-muted-foreground">QUICK FILTERS</label>
                             <div className="flex flex-wrap gap-2">
                                 <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground gap-1 py-1" onClick={() => handleSearch('youtube')}>
                                     <Youtube className="w-3 h-3 text-red-500" /> YouTube
                                 </Badge>
                                 <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground gap-1 py-1" onClick={() => handleSearch('apple_music')}>
                                     <Music className="w-3 h-3 text-pink-500" /> Apple Music
                                 </Badge>
                                 <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground gap-1 py-1" onClick={() => handleSearch('spotify')}>
                                     <Disc className="w-3 h-3 text-green-500" /> Spotify
                                 </Badge>
                             </div>
                         </div>
                    </div>
                )}
                {activeView === 'home' && (
                    <div className="p-4 text-sm text-muted-foreground">
                        <h3 className="font-semibold text-foreground mb-3 px-2">OPEN EDITORS</h3>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1.5 bg-accent/50 text-accent-foreground rounded-md cursor-pointer">
                                <Music className="w-4 h-4" />
                                <span className="font-medium">Music Feed</span>
                            </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Add Post Modal Overlay */}
      {activeView === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveView(null)}>
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setActiveView(null)}
                    className="absolute top-4 right-4 h-6 w-6 rounded-full"
                >
                    <X className="h-4 w-4" />
                </Button>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Add New Music</h2>
                    <p className="text-muted-foreground text-sm">Share your favorite tracks with the community.</p>
                </div>
                <AddMusicForm />
            </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative bg-background">
        <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}