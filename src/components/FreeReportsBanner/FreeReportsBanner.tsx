import React, { useEffect } from 'react';
import { Alert } from '@cloudscape-design/components';
import { useAppContext } from '../../utils/AppContextProvider';

export const FreeReportsBanner: React.FC = () => {
const { isUserLoading, isPaidMember, getRemainingFreeRentalReports } = useAppContext();
    useEffect(() => {
        //Re-render renderBanner
    }, [isUserLoading]);

    if (isPaidMember() || isUserLoading) {
    return null;
    }

    if (getRemainingFreeRentalReports === null) {
    return null;
    }

    const remainingFreeReports = getRemainingFreeRentalReports();
    const bannerText = (
    <>
        You have <strong>{remainingFreeReports}</strong> more free rental reports under the free tier. 
        Subscribe in order to have unlimited usage of this calculator.
    </>
    );

    if (remainingFreeReports === 0) {
    return (
        <Alert type="error" header="Subscription Required">
        {bannerText}
        </Alert>
    );
    }

    return (
    <Alert type="warning" header="Limited Free Reports">
        {bannerText}
    </Alert>
    );
};