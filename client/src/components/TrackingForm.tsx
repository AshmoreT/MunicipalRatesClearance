import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface TrackingFormProps {
  onSearch?: (referenceNumber: string) => void;
}

export default function TrackingForm({ onSearch }: TrackingFormProps) {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;
    
    setIsSearching(true);
    console.log("Searching for:", referenceNumber);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSearch?.(referenceNumber);
    setIsSearching(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Track Your Application</CardTitle>
        <CardDescription>
          Enter your reference number to check the status of your Rate Clearance Certificate application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="e.g., RCC-2025-001234"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="flex-1"
              data-testid="input-reference-number"
            />
            <Button 
              type="submit" 
              disabled={isSearching || !referenceNumber.trim()}
              data-testid="button-search"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
