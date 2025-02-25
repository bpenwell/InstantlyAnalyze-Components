import React, { useEffect } from 'react';
import { Alert } from '@cloudscape-design/components';
import { useAppContext } from '../../utils/AppContextProvider';

export enum BannerType {
    RENTAL_REPORTS='InstantlyReport™ uses', 
    ZILLOW_SCRAPER='InstantlyScan™ uses', 
};

export interface IRemainingFreeBannerProps {
    bannerType: BannerType;
}

export const FreeTrialBanner: React.FC<IRemainingFreeBannerProps> = (props: IRemainingFreeBannerProps) => {
const bannerType = props.bannerType;
const { isUserLoading, isPaidMember, getRemainingFreeRentalReports, getRemainingFreeZillowScrapes } = useAppContext();
    useEffect(() => {
        //Re-render renderBanner
    }, [isUserLoading]);

    if (isPaidMember() || isUserLoading) {
    return null;
    }

    let remainingTrialProductUsages;
    switch (bannerType) {
        case BannerType.RENTAL_REPORTS:
            remainingTrialProductUsages = getRemainingFreeRentalReports;
            break;
        case BannerType.RENTAL_REPORTS:
            remainingTrialProductUsages = getRemainingFreeZillowScrapes;
            break;
        default:
            throw Error(`Invalid BannerType: ${bannerType}`);
    }
    if (remainingTrialProductUsages === null) {
    return null;
    }

    const remainingFreeTrialUses = remainingTrialProductUsages();
    const bannerText = (
    <>
        You have <strong>{remainingFreeTrialUses}</strong> more free {bannerType} under the free tier. 
        Subscribe in order to have unlimited usage of this calculator.
    </>
    );

    if (remainingFreeTrialUses === 0) {
    return (
        <Alert type="error" header="Subscription Required">
        {bannerText}
        </Alert>
    );
    }

    return (
    <Alert type="warning" header="Limited Free Uses">
        {bannerText}
    </Alert>
    );
};