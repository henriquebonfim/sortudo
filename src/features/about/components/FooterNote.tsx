import { Heart } from "lucide-react";

export function FooterNote() {
  return (
    <div className="educational-box text-center">
      <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
        Feito com <Heart className="h-4 w-4 text-hot" /> e matemática.
        <br />
        &quot;Dados oficiais da CEF. Matemática por nossa conta. Não somos um site de apostas. Somos a cura.&quot;
      </p>
    </div>
  );
}
