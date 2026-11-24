"use client";

import { useMemo, useState } from "react";
import { APP_NAME, EMAILS } from "@/lib/config/config";
import { resolveNclexDashboardSlug } from "@/lib/config/nclexRouteBoundary";
import {
    useDistinctDominionSubscriptionItems,
    type DominionItem,
} from "@/lib/hooks/nexus/subscription/items/distinct/useDistinctDominionSubscriptionItems";
import { dominionService } from "@/lib/services/nexus/dominion/dominionService";

interface SubscriptionItemProps {
    parentTableName: string;
    parentName: string;
    dashboardName: string;
    heading?: string;
    subheading?: string;
    perPage?: number;
    showSearch?: boolean;
    onSubscribe?: (item: { guidId?: string; id: number; name: string }) => void;
}

export default function SubscriptionItem({
    parentTableName,
    parentName,
    dashboardName,
    heading = "Exam Prep Plans",
    subheading,
    perPage = 50,
    showSearch = true,
    onSubscribe,
}: SubscriptionItemProps) {
    const {
        filteredSubscriptionItems,
        subscriptionItemSearch,
        setSubscriptionItemSearch,
        skewTotal,
    } = useDistinctDominionSubscriptionItems({
        parentTableName,
        parentName,
        page: 1,
        perPage,
        sortDirection: "asc",
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reviewItem, setReviewItem] = useState<DominionItem | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const safeDashboardSlug = resolveNclexDashboardSlug(dashboardName || parentName);
    const pathwayLabel = safeDashboardSlug === "nclex-pn" ? "NCLEX-PN" : "NCLEX-RN";

    const sortedItems = useMemo(() =>
        [...filteredSubscriptionItems].sort(
            (a, b) => (a.cardNumber ?? 0) - (b.cardNumber ?? 0)
        ),
        [filteredSubscriptionItems]
    );

    const openTransparentCheckoutReview = (item: (typeof sortedItems)[number]) => {
        if (onSubscribe) {
            onSubscribe(item);
            return;
        }
        setErrorMessage(null);
        setTermsAccepted(false);
        setReviewItem(item);
    };

    const closeTransparentCheckoutReview = () => {
        if (isSubmitting) return;
        setReviewItem(null);
        setTermsAccepted(false);
    };

    const handleConfirmSubscribe = async () => {
        if (!reviewItem || !termsAccepted || isSubmitting) return;

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const returnUrl = `${window.location.origin}/pages/subscription/package?dashboard=${encodeURIComponent(safeDashboardSlug)}`;

            const result = await dominionService("SubscriptionPackage", "Store", {
                subscriptionItemId: reviewItem.id,
                subscriptionItemGuidId: reviewItem.guidId,
                returnUrl,
            });

            if (result?.error) {
                console.error("🔔 Subscription Failed :", result.error);
                setErrorMessage(typeof result.error === "string" ? result.error : "Subscription checkout initiation failed ⚓");
                setReviewItem(null);
                return;
            }

            const redirectUrl = (result as { redirectUrl?: string } | undefined)?.redirectUrl;
            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }

            setErrorMessage(
                "Checkout session did not return an authoritative payment provider redirect URL. No payment or subscription activation has occurred."
            );
            setReviewItem(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDuration = (minutes?: number | null) => {
        if (minutes === undefined || minutes === null) return null;

        const totalDays = minutes / (60 * 24);

        if (totalDays >= 28) {
            const months = Math.round(totalDays / 30);
            return `/ ${months} month${months !== 1 ? "s" : ""}`;
        }

        const days = Math.max(1, Math.round(totalDays));
        return `/ ${days} day${days !== 1 ? "s" : ""}`;
    };

    const formatAmount = (amount?: number, currency?: string | null) => {
        if (amount === undefined || amount === null) return null;
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency || "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch {
            return `${currency ?? "USD"} ${amount}`;
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-2 py-2 sm:px-2">
            <div className="mb-4 text-center">
                <h2 className="text-3xl font-bold text-slate-900">{heading}</h2>
                <p className="mt-2 text-slate-500">
                    {subheading ?? `Choose the Package that Fits your Prime Timeline. ${skewTotal} Plan${skewTotal !== 1 ? "s" : ""} Available.`}
                </p>
            </div>

            {errorMessage && (
                <div className="mb-8 flex justify-center">
                    <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-center shadow-sm">
                        <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="rounded p-1 text-black font-bold hover:text-red-800"
                            aria-label="Dismiss"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {showSearch && (<div className="mb-8 flex justify-center">
                <input
                    type="text"
                    value={subscriptionItemSearch}
                    onChange={(e) => setSubscriptionItemSearch(e.target.value)}
                    placeholder="Search plans…"
                    className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>
            )}

            {sortedItems.length === 0 && (
                <p className="text-center text-slate-400">No Plans Found ⚓</p>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedItems.map((item) => {
                    const style = item.style;

                    const titleBg = style?.titleBackground ?? "#4F46E5";
                    const titleColor = style?.titleColor ?? "#FFFFFF";
                    const bodyGradient =
                        style?.bodyGradientStart && style?.bodyGradientEnd
                            ? `linear-gradient(${style.bodyGradientDirection ?? "to bottom"}, ${style.bodyGradientStart}, ${style.bodyGradientEnd})`
                            : undefined;
                    const descriptionColor = style?.descriptionColor ?? "#475569";
                    const footerBg = style?.footerButtonBackground ?? "#4F46E5";
                    const footerColor = style?.footerButtonColor ?? "#FFFFFF";
                    const footerText = style?.footerButtonText || "Subscribe Now";

                    const priceLabel = formatAmount(item.amount, item.currency);
                    const durationLabel = formatDuration(item.priceDuration as unknown as number);

                    return (
                        <div
                            key={item.guidId ?? item.id}
                            className="relative flex flex-col transition-transform duration-200 hover:-translate-y-1"
                        >
                            {item.isFeatured && (
                                <div className="absolute left-2 -top-3 z-20 flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-100 shadow-md">
                                    ⭐ Featured
                                </div>
                            )}

                            {style?.badgeName && (
                                <div
                                    className="absolute right-2 -top-3 z-20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md"
                                    style={{
                                        background: style.badgeBackground ?? "#FBBF24",
                                        color: style.badgeColor ?? "#111827",
                                        fontSize: style.badgeFontSize,
                                    }}
                                >
                                    {style.badgeName}
                                </div>
                            )}

                            <div
                                className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl"
                                style={{ background: bodyGradient ?? "#FFFFFF" }}
                            >
                                <div
                                    className="flex items-center px-5 py-4"
                                    style={{ background: titleBg, color: titleColor }}
                                >
                                    <h3
                                        className="pr-16 text-lg font-bold leading-snug"
                                        style={{ fontSize: style?.titleFontSize }}
                                    >
                                        {item.name}
                                    </h3>
                                </div>

                                <div className="flex flex-1 flex-col gap-3 px-5 py-1">
                                    {priceLabel && (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-extrabold text-slate-900">
                                                {priceLabel}
                                            </span>
                                            {durationLabel && (
                                                <span className="text-sm text-slate-500"> {durationLabel}</span>
                                            )}
                                        </div>
                                    )}

                                    {item.description && (
                                        <p
                                            className="text-sm leading-relaxed"
                                            style={{ color: descriptionColor, fontSize: style?.descriptionFontSize }}
                                        >
                                            {item.description}
                                        </p>
                                    )}

                                    {item.duration && (
                                        <p className="text-sm text-slate-500">Access length: {item.duration}</p>
                                    )}

                                    {item.plan && (
                                        <p className="text-sm text-slate-500">Plan: {item.plan}</p>
                                    )}

                                    {item.features && (
                                        <div
                                            className="mt-1 max-h-88 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/60 p-3 pr-2 text-sm text-slate-700 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
                                            style={{ fontSize: style?.bodyFontSize }}
                                            dangerouslySetInnerHTML={{ __html: item.features }}
                                        />
                                    )}
                                </div>

                                <div className="px-5 pb-5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => openTransparentCheckoutReview(item)}
                                        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold shadow transition-opacity hover:opacity-90"
                                        style={{
                                            background: footerBg,
                                            color: footerColor,
                                            fontSize: style?.footerButtonFontSize,
                                        }}
                                    >
                                        {footerText}
                                    </button>
                                    <p className="mt-2 text-center text-[11px] text-slate-500">
                                        Review full commercial, renewal, and cancellation terms before payment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {reviewItem && (
                <div
                    className="fixed inset-0 z-[10020] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="transparent-checkout-title"
                >
                    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                                    {APP_NAME} Transparent Checkout Disclosure
                                </p>
                                <h3 id="transparent-checkout-title" className="text-lg font-bold">
                                    Review Commercial Terms Before Checkout
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeTransparentCheckoutReview}
                                disabled={isSubmitting}
                                aria-label="Close checkout review"
                                className="rounded-lg border border-white/20 px-2.5 py-1 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-40"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm">
                            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <span className="text-xs font-semibold uppercase text-slate-500">1. Subscription Plan Name</span>
                                        <p className="font-bold text-slate-900">{reviewItem.name} ({pathwayLabel})</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold uppercase text-slate-500">3. Price &amp; Currency</span>
                                        <p className="font-bold text-slate-900">
                                            {formatAmount(reviewItem.amount, reviewItem.currency) ?? "Displayed at Provider Checkout"}{" "}
                                            <span className="text-xs font-normal text-slate-600">
                                                ({reviewItem.currency || "USD"})
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold uppercase text-slate-500">4. Billing Frequency / Access Term</span>
                                        <p className="font-semibold text-slate-800">
                                            {reviewItem.duration ||
                                                formatDuration(reviewItem.priceDuration as unknown as number)?.replace(/^\/\s*/, "") ||
                                                reviewItem.plan ||
                                                "Standard Plan Term"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold uppercase text-slate-500">5. Payment Type (Recurring vs. One-Time)</span>
                                        <p className="font-semibold text-slate-800">
                                            {reviewItem.type || "Provider-Managed Subscription Term (Auto-Renew Configurable)"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
                                <div>
                                    <p className="font-bold text-slate-900">2. Included Features &amp; Entitlements</p>
                                    <p>
                                        Grants active learner entitlement to the <strong>{pathwayLabel}</strong> study pathway ({reviewItem.name}
                                        {reviewItem.description ? ` — ${reviewItem.description}` : ""}), including the {pathwayLabel} practice question bank, detailed clinical rationales, and performance analytics for the duration of the active term.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">6. Trial Duration &amp; Conversion Terms</p>
                                    <p>
                                        No hidden free trial or automatic trial-to-paid conversion is applied by {APP_NAME}. Your paid access term starts only after payment is authorized on the payment provider checkout screen.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">7. Renewal Conditions</p>
                                    <p>
                                        Whether a plan auto-renews is governed by the payment provider session and recorded on your subscription record (<code>Auto Renew: Yes / No</code> in <em>My Subscriptions</em>). When auto-renewal is active, the plan renews at the standard plan price at the end of the current validity period unless cancelled before the renewal date.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">8. Cancellation Procedure</p>
                                    <p>
                                        You may review your active plan, validity dates, and renewal status at any time under <strong>Dashboard → Subscriptions → My Subscriptions</strong> (<code>/dashboards/{safeDashboardSlug}/vista/subscriptions/packages</code>), or request cancellation by contacting <strong>{EMAILS.SUPPORT}</strong> with your Subscription ID.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">9. Refund Policy &amp; Applicable Conditions</p>
                                    <p>
                                        No charge is made if you cancel or close checkout before completing payment. Post-purchase billing inquiries or refund requests are reviewed by {APP_NAME} Support at <strong>{EMAILS.SUPPORT}</strong>; please include your Subscription ID and payment provider receipt.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">10. Additional Charges or Limitations</p>
                                    <p>
                                        {APP_NAME} does not add hidden platform fees, deceptive defaults, or preselected paid upgrades. Any applicable local taxes or currency conversion fees are disclosed by the payment provider before you authorize payment. Entitlements are scoped to the selected pathway ({pathwayLabel}).
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">11. Expiration &amp; Failed Payment Behavior</p>
                                    <p>
                                        When a subscription reaches its <code>Valid Until</code> date without renewal or if a renewal payment fails, the backend transitions your subscription from <code>Active</code>, full exam access reverts to limited preview access, and your saved exam history and analytics remain preserved in your account.
                                    </p>
                                </div>
                            </div>

                            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-300 bg-white p-3.5 text-xs font-medium text-slate-800 hover:border-indigo-500">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
                                />
                                <span>
                                    I have reviewed and understand the plan name, included {pathwayLabel} features, price ({formatAmount(reviewItem.amount, reviewItem.currency) ?? reviewItem.currency ?? "USD"}), billing duration, renewal conditions, cancellation procedure, refund policy, and expiration terms.
                                </span>
                            </label>
                        </div>

                        <div className="flex flex-col-reverse items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={closeTransparentCheckoutReview}
                                disabled={isSubmitting}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 sm:w-auto"
                            >
                                Cancel — Do Not Proceed
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubscribe}
                                disabled={!termsAccepted || isSubmitting}
                                className="w-full rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                            >
                                {isSubmitting ? "Initiating Authoritative Checkout…" : "Proceed to Authoritative Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// The End By : B.L.S.M.C ;  Skewblanc - The Winds Chase Us ⚓
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────