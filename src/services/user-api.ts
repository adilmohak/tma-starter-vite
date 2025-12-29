import api from "./api";

// Authentication
export const getAccessToken = async (queryParams: any) =>
  api.request(`get-token-hulugame`, "GET", null, queryParams);

export const getUser = async () => api.request("users/me", "GET");

// User Profile
export const updateUserPhone = async (body: any) =>
  api.request(`users/phone`, "PUT", body);

export const saveAvatarConfig = async (body: any) =>
  api.request("users/avatar/preference", "PUT", body);

export const getAvatarConfig = async () =>
  api.request("users/avatar/config", "GET");

// Coupons
export const claimCoupon = async (body: any) =>
  api.request(`users/coupons/claim`, "POST", body);

export const claimSpinCoupon = async (body: any) =>
  api.request(`spin/promotion/claim`, "POST", body);

export const claimCrashTicket = async (body: any) =>
  api.request(`crash-bonus/claim-tickets`, "POST", body);

export const claimIphoneCoupon = async (slug: string, body: any) =>
  api.request(`giftbox/${slug}/claim`, "POST", body);

// Referral/Sharing
export const prepareShareMessage = async () =>
  api.request("users/hulugames/referral-share", "GET");

export const shareIphoneGiveaway = async (slug: string) =>
  api.request(`giftbox/${slug}/share`, "GET");
