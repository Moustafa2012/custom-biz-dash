import { MapPin } from "lucide-react";
import { EmptyState } from "@/features/banking/components/EmptyState";

export default function WarehouseLocations() {
  return (
    <EmptyState
      icon={MapPin}
      titleAr="المواقع"
      titleEn="Locations"
      descriptionAr="لم يتم تعريف مواقع بعد."
      descriptionEn="No locations defined yet."
    />
  );
}
