
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyPIN, clearPIN } from "@/utils/pinSecurity";
import { toast } from "@/hooks/use-toast";

interface PINEntryProps {
  onUnlock: () => void;
}

export const PINEntry: React.FC<PINEntryProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
        variant: "destructive"
      });
      return;
    }

    if (verifyPIN(pin)) {
      onUnlock();
      toast({
        title: "Access Granted",
        description: "Welcome back to ManhwaVault!"
      });
    } else {
      setAttempts(prev => prev + 1);
      setPin("");
      toast({
        title: "Incorrect PIN",
        description: `Attempt ${attempts + 1}/5`,
        variant: "destructive"
      });
      
      if (attempts >= 4) {
        setShowReset(true);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm("This will clear all your data and reset the PIN. Are you sure?")) {
      clearPIN();
      localStorage.clear();
      window.location.reload();
    }
  };

  const handlePinChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">🔒 ManhwaVault</h1>
          <p className="text-muted-foreground">Enter your 4-digit PIN to access your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="Enter PIN"
              className="text-center text-2xl tracking-widest"
              maxLength={4}
              autoFocus
            />
            <div className="flex justify-center space-x-2">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 ${
                    i < pin.length ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={pin.length !== 4}>
            Unlock
          </Button>

          {showReset && (
            <Button type="button" variant="destructive" className="w-full" onClick={handleReset}>
              Reset Vault (Clear All Data)
            </Button>
          )}
        </form>

        {attempts > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {5 - attempts} attempts remaining
          </p>
        )}
      </div>
    </div>
  );
};
