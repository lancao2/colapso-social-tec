"use client";

import { useState, useEffect } from "react";
import { Building2, TreePine, Waves, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Option = "cidade" | "floresta" | "mar";

export default function PinPage() {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [pinStatus, setPinStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hashPin, setHashPin] = useState("");
  const hashPinCidade = "13476";
  const hashPinFloresta = "97521";
  const hashPinMar = "14386";

  const handlePinChange = (index: number, value: string) => {
    if (!selectedOption) {
      setShowWarning(true);
      return;
    }

    const newPin = [...pin];
    newPin[index] = value.replace(/\D/g, "").slice(0, 1);
    setPin(newPin);

    // Check if the entered digit is correct
    const isCorrect = newPin[index] === hashPin[index];
    const input = document.getElementById(`pin-${index}`) as HTMLInputElement;
    if (input) {
      input.style.borderColor = isCorrect ? "" : "rgb(239 68 68)"; // tailwind red-500
    }

    if (value && index < 4) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setShowWarning(false);
    setPin(["", "", "", "", ""]);
    switch (option) {
      case "cidade":
        setHashPin(hashPinCidade);
        break;
      case "floresta":
        setHashPin(hashPinFloresta);
        break;
      case "mar":
        setHashPin(hashPinMar);
        break;
    }
  };

  useEffect(() => {
    if (pin.every((digit) => digit !== "") && selectedOption) {
      if (pin.join("") === hashPin) {
        setPinStatus("success");
        setIsModalOpen(true);
      } else {
        setPinStatus("idle");
      }
    } else {
      setPinStatus("idle");
    }
  }, [pin, selectedOption, hashPin]);

  const closeModal = () => {
    setIsModalOpen(false);
    if (pinStatus === "error") {
      setPin(["", "", "", "", ""]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Enter PIN</h1>
          <div className="flex gap-2 mb-4">
            {pin.map((digit, index) => (
              <Input
                key={index}
                id={`pin-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="text-4xl text-center w-14 h-14 transition-all duration-200"
                autoComplete="off"
                disabled={!selectedOption}
              />
            ))}
          </div>
          {showWarning && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Por favor, selecione uma opção abaixo antes de inserir o PIN.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      <div className="w-full max-w-md">
        <p className="text-sm text-gray-600 mb-4 text-center">
         Selecione o Cenario para continuar.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            className={`flex flex-col items-center justify-center h-20 ${
              selectedOption === "cidade" ? "bg-black text-white" : ""
            } ${
              !selectedOption && showWarning ? "border-red-500 border-2" : ""
            }`}
            onClick={() => handleOptionSelect("cidade")}
          >
            <Building2 className="h-6 w-6 mb-2" />
            <span>Cidade</span>
          </Button>
          <Button
            variant="outline"
            className={`flex flex-col items-center justify-center h-20 ${
              selectedOption === "floresta" ? "bg-black text-white" : ""
            } ${
              !selectedOption && showWarning ? "border-red-500 border-2" : ""
            }`}
            onClick={() => handleOptionSelect("floresta")}
          >
            <TreePine className="h-6 w-6 mb-2" />
            <span>Floresta</span>
          </Button>
          <Button
            variant="outline"
            className={`flex flex-col items-center justify-center h-20 ${
              selectedOption === "mar" ? "bg-black text-white" : ""
            } ${
              !selectedOption && showWarning ? "border-red-500 border-2" : ""
            }`}
            onClick={() => handleOptionSelect("mar")}
          >
            <Waves className="h-6 w-6 mb-2" />
            <span>Mar</span>
          </Button>
        </div>
      </div>

      {isModalOpen && pinStatus === "success" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-green-500"
          onClick={closeModal}
        >
          <div className="text-white text-center">
            <CheckCircle className="h-24 w-24 mb-4 mx-auto" />
            <h2 className="text-4xl font-bold mb-2">Sucesso!</h2>
            <p className="text-xl">PIN correto.</p>
          </div>
        </div>
      )}
    </div>
  );
}
