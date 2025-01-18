'use client';
import React from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { getBreadcrumbsUUIDPageName, PAGE_PATH, toUpperCamelCase } from '@bpenwell/instantlyanalyze-module';

const LOCALE = 'en';

//Generate prop interface which passes children
export interface IAppLayoutPreview {
  children: React.ReactNode;
};

export const AppLayoutPreview = (props: IAppLayoutPreview) => {
  const { children } = props;
  const path = window.location.pathname;//.replace('#', '');
  const breadcrumbPath = path.split('/').filter(segment => segment !== '');
  let breadcrumbItems: { text: string; href: string }[] = [];
  let previousPath = '';
  
  function isUUID(segment: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(segment);
  }

  const shouldDisplayHomeBreadcrumb = (segment: string): boolean => {
    return segment === 'product';
  };
  
  const shouldDisplayNothing = (segment: string): boolean => {
    return segment.includes('#')
      || segment.includes('profile')
      || segment.includes('subscribe');
  };
  
  breadcrumbPath.forEach((segment) => {
    if (shouldDisplayNothing(segment)) {
      return;
    }
  
    let displayText = '';
    let redirectUrl = `${previousPath}/${segment}`;
    // Check if the segment is a UUID
    if (isUUID(segment)) {
      // Use the previousPath to determine the mapping
      const mappedPath = getBreadcrumbsUUIDPageName(segment);
      displayText = mappedPath;
      //Update url
      redirectUrl = `${previousPath}/${segment}`;
    }
    //We want the initial breadcrumb to be the homepage
    else if (shouldDisplayHomeBreadcrumb(segment)) {
      displayText = 'Home';
      //Update url
      redirectUrl = '#';
    }
    else {
      displayText = toUpperCamelCase(segment).replace('-', ' ');
      //Update url
      redirectUrl = `${previousPath}/${segment}`;
    }
  
    breadcrumbItems.push({
      text: displayText,
      href: redirectUrl,
    });
  
    previousPath += `/${segment}`;
  });

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={breadcrumbItems}
          />
        }
        toolsHide={true}
        navigationHide={true}
        /*tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}*/
        content={children}
        /*splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}*/
      />
    </I18nProvider>
  );
}