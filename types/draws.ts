export interface PrizePool {
  id: string;
  drawId: string;
  totalPool: number;
  fiveMatchPool: number;
  fourMatchPool: number;
  threeMatchPool: number;
  rolloverIntoNext: number;
  createdAt: string | Date;
}

export interface DrawWinnerCounts {
  five: number;
  four: number;
  three: number;
}

export interface DrawRecord {
  id: string;
  month: number;
  year: number;
  logicType: "random" | "algorithmic";
  status: "draft" | "simulated" | "published";
  winningNumbers?: number[] | null;
  rolloverAmount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date | null;
  // Extended fields retrieved natively via API Join maps:
  prizePool?: PrizePool | null;
  participantCount?: number;
  winnerCounts?: DrawWinnerCounts;
}

export interface DrawEntryResult {
  id: string;
  drawId: string;
  userId: string;
  entryNumbers: number[];
  matchCount: number;
  isWinner: boolean;
  createdAt: string | Date;
  // Extended fields attached uniquely via me/route maps:
  drawDate?: string;
  winningNumbers?: number[] | null;
}
