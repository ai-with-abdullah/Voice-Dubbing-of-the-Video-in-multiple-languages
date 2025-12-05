import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supportedLanguages } from "@shared/schema";

const popularLanguageCodes = ["en", "es", "fr", "de", "zh-CN", "ar", "hi", "pt", "ja", "ko", "ru", "it"];

export function LanguageGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return supportedLanguages;
    return supportedLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const popularLanguages = useMemo(() => {
    return supportedLanguages.filter((lang) => popularLanguageCodes.includes(lang.code));
  }, []);

  return (
    <div className="space-y-8">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-languages"
        />
      </div>

      {!searchQuery && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Popular Languages
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularLanguages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center hover-elevate cursor-pointer">
                  <p className="font-medium">{lang.name}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {lang.code}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {searchQuery ? `Search Results (${filteredLanguages.length})` : "All Languages"}
        </h3>
        
        {filteredLanguages.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No languages found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {filteredLanguages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(index * 0.01, 0.5) }}
                className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
                data-testid={`language-card-${lang.code}`}
              >
                <p className="text-sm font-medium truncate">{lang.name}</p>
                <p className="text-xs text-muted-foreground">{lang.code}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center py-8 border-t border-border">
        <p className="text-2xl font-bold text-primary mb-2">
          {supportedLanguages.length}+
        </p>
        <p className="text-muted-foreground">Languages Supported</p>
      </div>
    </div>
  );
}
