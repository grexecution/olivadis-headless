'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RECIPE_STORIES } from './recipe-stories-config';
import RecipeStoriesViewer from './recipe-stories-viewer';

/**
 * Recipe Stories Preview Component
 *
 * Displays horizontal scrollable row of recipe story circles.
 * Appears at top of /rezepte page.
 * Click to open story viewer with "Rezept öffnen" button.
 */
export default function RecipeStoriesPreview() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  if (RECIPE_STORIES.length === 0) {
    return null;
  }

  return (
    <>
      {/* Stories Preview Row */}
      <div className="w-full overflow-x-auto scrollbar-hide bg-cream py-4">
        <div className="container">
          <div className="flex gap-4 md:gap-6">
            {RECIPE_STORIES.map((recipeStory, index) => (
              <button
                key={recipeStory.id}
                onClick={() => setSelectedStoryIndex(index)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
              >
                {/* Story Circle with Gradient Border */}
                <div className="relative">
                  {/* Gradient Border */}
                  <div className="p-[3px] rounded-full bg-gradient-to-tr from-primary via-primary-light to-primary animate-pulse">
                    {/* White Ring */}
                    <div className="p-[3px] bg-cream rounded-full">
                      {/* Preview Image */}
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                        <Image
                          src={recipeStory.previewImage}
                          alt={recipeStory.recipeName}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Name */}
                <span className="text-xs md:text-sm font-medium text-primary text-center max-w-[80px] line-clamp-2">
                  {recipeStory.recipeName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Viewer Modal */}
      {selectedStoryIndex !== null && (
        <RecipeStoriesViewer
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </>
  );
}
