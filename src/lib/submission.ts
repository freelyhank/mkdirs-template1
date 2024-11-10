import type { ItemInfo } from "@/types";

export enum PricePlans {
  FREE = "free",
  PRO = "pro",
}

export enum FreePlanStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  SUBMITTING = "submitting",
}

export enum ProPlanStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
  SUBMITTING = "submitting",
}

export const getPublishable = (item: ItemInfo): boolean => {
  if (item.pricePlan === PricePlans.FREE) {
    return item.freePlanStatus === FreePlanStatus.APPROVED;
  }
  if (item.pricePlan === PricePlans.PRO) {
    return item.proPlanStatus === ProPlanStatus.SUCCESS;
  }
  return false;
};

export const BadgeStyles = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
  NORMAL: "normal",
} as const;

export type BadgeStyle = (typeof BadgeStyles)[keyof typeof BadgeStyles];

export const getBadgeStyle = (item: ItemInfo): BadgeStyle => {
  if (item.pricePlan === PricePlans.FREE) {
    switch (item.freePlanStatus) {
      case FreePlanStatus.APPROVED:
        return BadgeStyles.SUCCESS;
      case FreePlanStatus.REJECTED:
        return BadgeStyles.DANGER;
      case FreePlanStatus.PENDING:
        return BadgeStyles.WARNING;
      default:
        return BadgeStyles.NORMAL;
    }
  }
  if (item.pricePlan === PricePlans.PRO) {
    switch (item.proPlanStatus) {
      case ProPlanStatus.SUCCESS:
        return BadgeStyles.SUCCESS;
      case ProPlanStatus.FAILED:
        return BadgeStyles.DANGER;
      case ProPlanStatus.PENDING:
        return BadgeStyles.WARNING;
      default:
        return BadgeStyles.NORMAL;
    }
  }
  return BadgeStyles.NORMAL;
};
