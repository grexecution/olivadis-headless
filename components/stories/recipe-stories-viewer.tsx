'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RECIPE_STORIES, RecipeStory } from './recipe-stories-config';

interface RecipeStoriesViewerProps {
  initialIndex: number;
  onClose: () => void;
}

export default function RecipeStoriesViewer({ initialIndex, onClose }: RecipeStoriesViewerProps) {
  const router = useRouter();
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(initialIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentRecipe = RECIPE_STORIES[currentRecipeIndex];
  const currentStory = currentRecipe.stories[currentStoryIndex];
  const totalStories = currentRecipe.stories.length;

  // Preload next story media
  useEffect(() => {
    if (currentStoryIndex < totalStories - 1) {
      const nextStory = currentRecipe.stories[currentStoryIndex + 1];
      if (nextStory.type === 'image') {
        const img = new window.Image();
        img.src = nextStory.media;
      } else if (nextStory.type === 'video') {
        const video = document.createElement('video');
        video.src = nextStory.media;
        video.preload = 'auto';
      }
    }
  }, [currentStoryIndex, currentRecipe.stories, totalStories]);

  // Progress tracking
  useEffect(() => {
    setProgress(0);

    if (currentStory.type === 'image') {
      // Image: interval-based progress with config duration
      const duration = currentStory.duration || 5000;
      const intervalTime = 50;
      const increment = (intervalTime / duration) * 100;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + increment;
          if (newProgress >= 100) {
            handleNext();
            return 100;
          }
          return newProgress;
        });
      }, intervalTime);

      return () => clearInterval(interval);
    } else if (currentStory.type === 'video' && videoRef.current) {
      // Video: event-driven progress synced to playback
      const video = videoRef.current;
      video.currentTime = 0;

      const updateProgress = () => {
        if (video.duration) {
          const percentage = (video.currentTime / video.duration) * 100;
          setProgress(percentage);
        }
      };

      const handleVideoEnd = () => {
        handleNext();
      };

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('ended', handleVideoEnd);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentStoryIndex, currentStory]);

  const handleNext = () => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentRecipeIndex < RECIPE_STORIES.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
      setCurrentStoryIndex(RECIPE_STORIES[currentRecipeIndex - 1].stories.length - 1);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;

    if (clickX < screenWidth / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleOpenRecipe = () => {
    router.push(`/rezepte/${currentRecipe.recipeSlug}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentRecipeIndex, currentStoryIndex]);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Desktop: Centered container with backdrop */}
      <div
        className="w-full h-full md:flex md:items-center md:justify-center md:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && window.innerWidth >= 768) {
            onClose();
          }
        }}
      >
        {/* Story Container */}
        <div className="relative w-full h-full md:h-[90vh] md:w-auto md:aspect-[9/16] md:max-h-[90vh] md:rounded-xl md:shadow-2xl overflow-hidden bg-black">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
            {currentRecipe.stories.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all ease-linear"
                  style={{
                    width:
                      index < currentStoryIndex
                        ? '100%'
                        : index === currentStoryIndex
                        ? `${progress}%`
                        : '0%',
                    transitionDuration: currentStory.type === 'image' ? '50ms' : '0ms',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-4 left-0 right-0 z-50 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={currentRecipe.previewImage}
                  alt={currentRecipe.recipeName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-white text-sm font-semibold drop-shadow-lg">
                {currentRecipe.recipeName}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Schließen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Story Content */}
          <div className="w-full h-full" onClick={handleTap}>
            {currentStory.type === 'image' ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentStory.media}
                  alt={currentRecipe.recipeName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                src={currentStory.media}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            )}
          </div>

          {/* Caption Overlay */}
          {currentStory.caption && (
            <div className="absolute bottom-32 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-base md:text-lg font-medium leading-relaxed whitespace-pre-line">
                {currentStory.caption}
              </p>
            </div>
          )}

          {/* "Rezept öffnen" Button */}
          <div className="absolute bottom-6 left-0 right-0 px-6 z-50">
            <button
              onClick={handleOpenRecipe}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg shadow-xl transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2"
            >
              <span className="text-lg">🫒</span>
              <span>Rezept öffnen</span>
            </button>
          </div>

          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 pointer-events-none z-40">
            {currentRecipeIndex > 0 || currentStoryIndex > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="pointer-events-auto text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            ) : (
              <div />
            )}

            {currentRecipeIndex < RECIPE_STORIES.length - 1 || currentStoryIndex < totalStories - 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
