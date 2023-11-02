import type { GenreForm, Term } from "@/types/work";

export type LocalWork = {
  id: string;
  title: string;
  creators: { name: string; lifeSpan: string }[];
  motivation?: string;
  date: { label: string; min: number; max: number };
  terms: Term[];
  genreform: GenreForm[];
  librisUrl?: string;
};

export type LocalWorkRaw = Readonly<{
  title: string;
  creators: { name: string; lifeSpan: string }[];
  motivation?: string;
  date: { label?: string; min: number; max: number } | number;
  terms: Record<string, string>;
  genreform?: Record<string, string>;
  librisUrl?: string;
}>;
