'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import AddMusicForm from './AddMusicForm';
import { Home, Search, Plus, Youtube, Music, Disc, X, LogOut, User as UserIcon, Link as LinkIcon } from 'lucide-react'; 
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from '@/types';
import { logout } from '@/app/auth/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppShell({ children, user }: { children: React.ReactNode, user?: User | null }) {
  const [activeView, setActiveView] = useState<'home' | 'search' | 'add' | 'links' | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup') {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  const toggleView = (view: 'home' | 'search' | 'add' | 'links') => {
      if (activeView === view) {
          if (view === 'add') {
              handleCloseModal();
          } else {
              setActiveView(null);
          }
      } else {
          setActiveView(view);
      }
  };

  const handleCloseModal = () => {
      setIsClosingModal(true);
      setTimeout(() => {
          setActiveView(null);
          setIsClosingModal(false);
      }, 200); // Match animation duration
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
            setActiveView('home'); // Directly switch, no closing animation for sidebar yet
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
          onClick={() => setActiveView(activeView === 'search' ? null : 'search')}
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
          onClick={() => setActiveView(activeView === 'links' ? null : 'links')}
          className={cn(
            "rounded-md transition-all relative h-10 w-10",
            activeView === 'links' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          title="Links"
        >
          <LinkIcon className="w-5 h-5" />
           {activeView === 'links' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
              if (activeView === 'add') handleCloseModal();
              else setActiveView('add');
          }}
          className={cn(
            "rounded-md transition-all relative h-10 w-10",
            activeView === 'add' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          title="New Post"
        >
          <Plus className="w-5 h-5" />
           {activeView === 'add' && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />}
        </Button>

        <div className="mt-auto flex flex-col items-center gap-4">
            {user ? (
                <DropdownMenu key={pathname} modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border">
                            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary overflow-hidden" title={user.username}>
                                {user.username.slice(0, 2).toUpperCase()}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" className="w-56 ml-2">
                        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link 
                                href="/profile" 
                                className="flex items-center w-full"
                            >
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>マイページ</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()} className="text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>ログアウト</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button variant="ghost" size="icon" onClick={() => router.push('/login')} title="Login">
                    <UserIcon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </Button>
            )}
        </div>
      </div>

      {/* Side Panel (Only for Home, Search, and Links) */}
      {(activeView === 'home' || activeView === 'search' || activeView === 'links') && (
        <div 
            className="w-80 bg-muted/10 border-r border-border flex flex-col flex-shrink-0 transition-all h-full animate-in slide-in-from-left-5 duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between items-center border-b border-border h-14">
                <span>{activeView === 'home' ? 'Explorer' : activeView === 'search' ? 'Search' : 'Links'}</span>
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
                {activeView === 'links' && (
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">MUSIC SERVICES</label>
                            <div className="flex flex-col gap-1">
                                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
                                    <Youtube className="w-4 h-4 text-red-500" /> YouTube
                                </a>
                                <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
                                    <Music className="w-4 h-4 text-pink-500" /> Apple Music
                                </a>
                                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground">
                                    <Disc className="w-4 h-4 text-green-500" /> Spotify
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Add Post Modal Overlay */}
      {(activeView === 'add' || isClosingModal) && (
        <div 
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
                isClosingModal ? "animate-out fade-out duration-200" : "animate-in fade-in duration-200"
            )}
            onClick={handleCloseModal}
        >
            <div 
                className={cn(
                    "bg-card border border-border rounded-lg shadow-lg w-full max-w-lg p-6 relative",
                    isClosingModal ? "animate-out zoom-out-95 duration-200" : "animate-in zoom-in-95 duration-200"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 h-6 w-6 rounded-full"
                >
                    <X className="h-4 w-4" />
                </Button>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Add New Music</h2>
                    <p className="text-muted-foreground text-sm">Share your favorite tracks with the community.</p>
                </div>
                <AddMusicForm onSuccess={handleCloseModal} user={user} />
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
