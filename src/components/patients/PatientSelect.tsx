import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
import { usePatients } from "@/hooks/usePatients";
import { format } from "date-fns";

interface PatientSelectProps {
  value?: string;
  onChange: (patientId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function PatientSelect({
  value,
  onChange,
  placeholder = "Select patient...",
  disabled = false,
}: PatientSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = usePatients({ search, status: "active" }, 1);
  const patients = data?.data ?? [];

  const selectedPatient = useMemo(() => {
    if (!value) return null;
    return patients.find((p) => p.id === value) ?? null;
  }, [value, patients]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {selectedPatient ? (
            <span className="flex items-center gap-2">
              <span>
                {selectedPatient.first_name} {selectedPatient.last_name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({format(new Date(selectedPatient.date_of_birth), "yyyy")})
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 z-50 bg-popover" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search patients..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : patients.length === 0 ? (
              <CommandEmpty>No patients found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    onSelect={() => {
                      onChange(patient.id === value ? undefined : patient.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        DOB: {format(new Date(patient.date_of_birth), "MMM d, yyyy")}
                        {patient.phone && ` • ${patient.phone}`}
                      </span>
                    </div>
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
