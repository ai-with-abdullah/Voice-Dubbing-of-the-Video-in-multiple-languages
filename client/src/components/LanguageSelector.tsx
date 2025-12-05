import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supportedLanguages, type SupportedLanguage } from "@shared/schema";

interface LanguageSelectorProps {
  value?: string;
  onChange: (languageCode: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  excludeLanguage?: string;
}

const popularLanguages = ["en", "es", "fr", "de", "zh-CN", "ar", "hi", "pt", "ja", "ko"];

export function LanguageSelector({
  value,
  onChange,
  label = "Select language",
  placeholder = "Search languages...",
  disabled = false,
  excludeLanguage,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    return supportedLanguages.filter((lang) => {
      if (excludeLanguage && lang.code === excludeLanguage) return false;
      if (!searchQuery) return true;
      return lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lang.code.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, excludeLanguage]);

  const popularFiltered = useMemo(() => {
    return filteredLanguages.filter((lang) => popularLanguages.includes(lang.code));
  }, [filteredLanguages]);

  const otherFiltered = useMemo(() => {
    return filteredLanguages.filter((lang) => !popularLanguages.includes(lang.code));
  }, [filteredLanguages]);

  const selectedLanguage = supportedLanguages.find((lang) => lang.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          data-testid="button-language-selector"
        >
          {selectedLanguage ? (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{selectedLanguage.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{label}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="input-language-search"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No language found.</CommandEmpty>
            
            {popularFiltered.length > 0 && (
              <CommandGroup heading="Popular">
                {popularFiltered.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.code}
                    onSelect={() => {
                      onChange(language.code);
                      setOpen(false);
                    }}
                    data-testid={`option-language-${language.code}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === language.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{language.name}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {language.code}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {otherFiltered.length > 0 && (
              <CommandGroup heading="All Languages">
                {otherFiltered.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.code}
                    onSelect={() => {
                      onChange(language.code);
                      setOpen(false);
                    }}
                    data-testid={`option-language-${language.code}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === language.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{language.name}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {language.code}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function LanguageDisplay({ code }: { code: string }) {
  const language = supportedLanguages.find((lang) => lang.code === code);
  if (!language) return null;

  return (
    <Badge variant="secondary" className="gap-1.5">
      <Globe className="w-3 h-3" />
      {language.name}
    </Badge>
  );
}
