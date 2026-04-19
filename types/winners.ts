import { DrawRecord, DrawEntryResult } from "./draws";

export type WinnerTier = "5-match" | "4-match" | "3-match";
export type ReviewStatus = "not_submitted" | "submitted" | "approved" | "rejected";
export type PayoutStatus = "pending" | "approved_for_payment" | "paid";

export interface WinnerProof {
  id: string;
  winnerId: string;
  fileUrl: string;
  fileName?: string | null;
  mimeType?: string | null;
  submittedAt: string | Date;
  createdAt: string | Date;
}

export interface WinnerRecord {
  id: string;
  drawId: string;
  drawEntryId: string;
  userId: string;
  tier: WinnerTier;
  prizeAmount: number;
  reviewStatus: ReviewStatus;
  payoutStatus: PayoutStatus;
  rejectionReason?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Extended nested API interfaces mapped during queries securely natively
  draw?: DrawRecord;
  entry?: DrawEntryResult;
  proof?: WinnerProof | null;
  user?: {
      id: string;
      email: string;
      fullName?: string;
  }
}
