import { MapPin } from "lucide-react";
import { LotteryStats } from '@/domain/lottery/lottery.types';
import { GeoWinnersChart } from '@/features/analytics-dashboard/charts';
import { Chapter } from "../types";

export const getGeographyChapter = (stats?: LotteryStats | null): Chapter => ({
  id: "geography",
  icon: <MapPin className="w-4 h-4" />,
  title: "Geografia",
  description: "Distribuição geográfica dos ganhadores",
  lineClass: "bg-emerald-500/60",
  iconColorClass: "text-emerald-400",
  sections: [
    {
      id: "geo-map",
      title: "Mapa dos Ganhadores",
      subtitle: "Estados e regiões premiados",
      type: "Geographic",
      insight: `A região Sudeste domina. ${stats?.geoWinners?.[0]?.state || 'SP'} lidera com ${stats?.geoWinners?.[0]?.total || '--'} ganhadores. O 'Canal Eletrônico' já representa ~4.5%.`,
      note: "A cidade não-capital mais premiada historicamente é Santos/SP.",
      className: "md:col-span-2 lg:col-span-2",
      component: <GeoWinnersChart />,
    },
  ],
});
