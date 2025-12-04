import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, X, Filter, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { useFlags } from "../hooks/useFlags";
import { FilterButton, ColorFilterButton } from "./FilterButton";
import taxonomy from "../data/taxonomy.json";
import type { Taxonomy, ActiveFilter } from "../types";

const taxonomyData = taxonomy as Taxonomy;

// Color mappings for color filters
const colorHexMap: Record<string, string> = {
  red: "#DC2626",
  blue: "#2563EB",
  yellow: "#FCD34D",
  green: "#16A34A",
  white: "#FFFFFF",
  black: "#1F2937",
  orange: "#F97316",
  gold: "#D97706",
  maroon: "#7F1D1D",
  brown: "#78350F",
  purple: "#7C3AED",
  light_blue: "#38BDF8",
  aquamarine: "#2DD4BF",
  copper: "#B87333",
  pink: "#EC4899",
};

export function FiltersSidebar() {
  const { language, activeFilters, addFilter, removeFilter, clearFilters } =
    useAppStore();
  const { getAvailableFilters } = useFlags(activeFilters, "");
  // All categories expanded by default
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    taxonomyData.categories.map((c) => c.id)
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(
    []
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const isFilterActive = (categoryId: string, elementId: string) => {
    return activeFilters.some(
      (f) => f.categoryId === categoryId && f.elementId === elementId
    );
  };

  const handleFilterClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  // Handle category-level filter (select all in category)
  const handleCategoryFilter = (categoryId: string) => {
    const filter: ActiveFilter = {
      categoryId: "main_category",
      elementId: categoryId,
    };
    if (isFilterActive("main_category", categoryId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  // Handle subcategory-level filter (e.g., all birds)
  const handleSubcategoryFilter = (subcategoryId: string) => {
    const filter: ActiveFilter = {
      categoryId: "subcategory",
      elementId: subcategoryId,
    };
    if (isFilterActive("subcategory", subcategoryId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  const lang = language === "fr" ? "label_fr" : "label_en";

  // Filter categories to only show those with matching flags
  const visibleCategories = useMemo(() => {
    return taxonomyData.categories.filter((category) => {
      // Check if any element in any subcategory has matches
      return category.subcategories.some((subcategory) =>
        subcategory.elements.some((element) =>
          getAvailableFilters(subcategory.id, element.id)
        )
      );
    });
  }, [getAvailableFilters]);

  // Get active filter count per category
  const getCategoryFilterCount = (categoryId: string): number => {
    const category = taxonomyData.categories.find((c) => c.id === categoryId);
    if (!category) return 0;

    return activeFilters.filter(
      (f) =>
        f.categoryId === categoryId ||
        category.subcategories.some((s) => s.id === f.categoryId)
    ).length;
  };

  return (
    <aside
      className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden 
                      border-l border-[var(--color-border)] bg-[var(--color-bg)]"
    >
      {/* Header */}
      <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold text-[var(--color-text)]">
            {language === "fr" ? "Filtres" : "Filters"}
          </h2>
          {activeFilters.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full">
              {activeFilters.length}
            </span>
          )}
        </div>
        {activeFilters.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]
                       hover:text-red-500 transition-colors"
            aria-label="Clear all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Active Filters Preview */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-primary-500/5 border-b border-[var(--color-border)]">
              <div className="flex flex-wrap gap-1.5">
                {activeFilters.map((filter) => (
                  <motion.button
                    key={`${filter.categoryId}-${filter.elementId}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => removeFilter(filter)}
                    className="px-2 py-1 text-xs bg-primary-500 text-white rounded-full 
                               flex items-center gap-1 hover:bg-primary-600 transition-colors"
                  >
                    {filter.elementId.replace(/_/g, " ")}
                    <X className="w-3 h-3" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-[calc(100%-4rem)] custom-scrollbar pb-6">
        {/* Visible Taxonomy Categories */}
        {visibleCategories.map((category) => {
          const categoryIcon = (category as any).icon || "📋";
          const filterCount = getCategoryFilterCount(category.id);

          // Filter subcategories to only show those with matching elements
          const visibleSubcategories = category.subcategories.filter(
            (subcategory) =>
              subcategory.elements.some((element) =>
                getAvailableFilters(subcategory.id, element.id)
              )
          );

          if (visibleSubcategories.length === 0) return null;

          return (
            <CategorySection
              key={category.id}
              id={category.id}
              label={category[lang]}
              icon={categoryIcon}
              isExpanded={expandedCategories.includes(category.id)}
              onToggle={() => toggleCategory(category.id)}
              filterCount={filterCount}
              onCategoryFilter={() => handleCategoryFilter(category.id)}
              isCategoryActive={isFilterActive("main_category", category.id)}
            >
              {visibleSubcategories.map((subcategory) => {
                // Filter elements to only show those with matches
                const visibleElements = subcategory.elements.filter((element) =>
                  getAvailableFilters(subcategory.id, element.id)
                );

                if (visibleElements.length === 0) return null;

                const hasMultipleElements = visibleElements.length > 6;
                const isSubExpanded = expandedSubcategories.includes(
                  subcategory.id
                );
                const isSubActive = isFilterActive(
                  "subcategory",
                  subcategory.id
                );

                return (
                  <div key={subcategory.id} className="mb-2 last:mb-0">
                    {/* Subcategory Header - clickable to filter by whole subcategory */}
                    <div className="flex items-center gap-1 mb-1">
                      {hasMultipleElements && (
                        <button
                          onClick={() => toggleSubcategory(subcategory.id)}
                          className="p-0.5 hover:bg-[var(--color-surface)] rounded transition-colors"
                        >
                          {isSubExpanded ? (
                            <ChevronDown className="w-3 h-3 text-[var(--color-text-secondary)]" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-[var(--color-text-secondary)]" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleSubcategoryFilter(subcategory.id)}
                        className={`text-[10px] font-medium uppercase tracking-wider transition-colors
                          ${
                            isSubActive
                              ? "text-primary-500"
                              : "text-[var(--color-text-secondary)] hover:text-primary-500"
                          }`}
                      >
                        {subcategory[lang]}
                        {isSubActive && " ✓"}
                      </button>
                    </div>

                    {/* Elements */}
                    <AnimatePresence>
                      {(!hasMultipleElements || isSubExpanded) && (
                        <motion.div
                          initial={
                            hasMultipleElements
                              ? { height: 0, opacity: 0 }
                              : false
                          }
                          animate={{ height: "auto", opacity: 1 }}
                          exit={
                            hasMultipleElements
                              ? { height: 0, opacity: 0 }
                              : undefined
                          }
                          transition={{ duration: 0.2 }}
                          className="flex flex-wrap gap-1.5"
                        >
                          {visibleElements.map((element) => {
                            const isActive = isFilterActive(
                              subcategory.id,
                              element.id
                            );

                            // Use color button for color elements
                            if (category.id === "colors") {
                              return (
                                <ColorFilterButton
                                  key={element.id}
                                  label={element[lang]}
                                  colorValue={
                                    (element as any).hex ||
                                    colorHexMap[element.id] ||
                                    "#888888"
                                  }
                                  isActive={isActive}
                                  isDisabled={false}
                                  onClick={() =>
                                    handleFilterClick(
                                      subcategory.id,
                                      element.id
                                    )
                                  }
                                />
                              );
                            }

                            return (
                              <FilterButton
                                key={element.id}
                                label={element[lang]}
                                icon={(element as any).icon}
                                isActive={isActive}
                                isDisabled={false}
                                onClick={() =>
                                  handleFilterClick(subcategory.id, element.id)
                                }
                              />
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Show preview when collapsed */}
                    {hasMultipleElements && !isSubExpanded && (
                      <div className="flex flex-wrap gap-1.5">
                        {visibleElements.slice(0, 6).map((element) => {
                          const isActive = isFilterActive(
                            subcategory.id,
                            element.id
                          );

                          if (category.id === "colors") {
                            return (
                              <ColorFilterButton
                                key={element.id}
                                label={element[lang]}
                                colorValue={
                                  (element as any).hex ||
                                  colorHexMap[element.id] ||
                                  "#888888"
                                }
                                isActive={isActive}
                                isDisabled={false}
                                onClick={() =>
                                  handleFilterClick(subcategory.id, element.id)
                                }
                              />
                            );
                          }

                          return (
                            <FilterButton
                              key={element.id}
                              label={element[lang]}
                              icon={(element as any).icon}
                              isActive={isActive}
                              isDisabled={false}
                              onClick={() =>
                                handleFilterClick(subcategory.id, element.id)
                              }
                            />
                          );
                        })}
                        {visibleElements.length > 6 && (
                          <button
                            onClick={() => toggleSubcategory(subcategory.id)}
                            className="px-2 py-1 text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)]
                                       rounded-full hover:bg-[var(--color-border)] transition-colors"
                          >
                            +{visibleElements.length - 6}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CategorySection>
          );
        })}
      </div>
    </aside>
  );
}

interface CategorySectionProps {
  id: string;
  label: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  filterCount?: number;
  onCategoryFilter?: () => void;
  isCategoryActive?: boolean;
}

function CategorySection({
  id: _id,
  label,
  icon,
  isExpanded,
  onToggle,
  children,
  filterCount,
  onCategoryFilter,
  isCategoryActive,
}: CategorySectionProps) {
  void _id; // Suppress unused variable warning
  return (
    <div className="border-b border-[var(--color-border)]">
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="flex-1 px-3 py-2 flex items-center justify-between hover:bg-[var(--color-surface)] 
                     transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{icon}</span>
            <span className="font-medium text-sm text-[var(--color-text)]">
              {label}
            </span>
            {filterCount && filterCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-medium bg-primary-500 text-white rounded-full">
                {filterCount}
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </motion.div>
        </button>
        {/* Category-level filter button */}
        {onCategoryFilter && (
          <button
            onClick={onCategoryFilter}
            className={`px-2 py-2 text-[10px] font-medium transition-colors border-l border-[var(--color-border)]
              ${
                isCategoryActive
                  ? "bg-primary-500 text-white"
                  : "hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
              }`}
            title={`Filter all ${label}`}
          >
            ALL
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
