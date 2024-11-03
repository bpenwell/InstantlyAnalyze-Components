'use client';
import React from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  BreadcrumbGroupProps,
  Container,
  ContentLayout,
  Flashbar,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
  SplitPanel,
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { getBreadcrumbsUUIDPageName, PAGE_PATH, toUpperCamelCase } from '@bpenwell/rei-module';

const LOCALE = 'en';

//Generate prop interface which passes children
export interface IAppLayoutPreview {
  children: React.ReactNode;
};

export const AppLayoutPreview = (props: IAppLayoutPreview) => {
  const { children } = props;
  const path = window.location.hash.replace('#', '');
  const breadcrumbPath = path.split('/').filter(segment => segment !== '');
  let breadcrumbItems: { text: string; href: string }[] = [];
  let previousPath = '';
  
  function isUUID(segment: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(segment);
  }
  
  breadcrumbPath.forEach((segment) => {
    if (segment.includes('#')) {
      return;
    }
  
    let displayText = '';
  
    // Check if the segment is a UUID
    if (isUUID(segment)) {
      // Use the previousPath to determine the mapping
      const mappedPath = getBreadcrumbsUUIDPageName(segment);
      displayText = mappedPath;
    }
    else {
      displayText = toUpperCamelCase(segment).replace('-', ' ');
    }
  
    breadcrumbItems.push({
      text: displayText,
      href: `#${previousPath}/${segment}`,
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
        /*navigation={
          <SideNavigation
            header={{
              href: '',
              text: 'Products',
            }}
            items={[
              { defaultExpanded: window.location.hash.includes(PAGE_PATH.RENTAL_CALCULATOR_HOME), type: 'expandable-link-group', text: `Rental Property Calculator`, href: `#${PAGE_PATH.RENTAL_CALCULATOR_HOME}`, items: [
                { type: 'link', text: `Dashboard`, href: `#${PAGE_PATH.RENTAL_CALCULATOR_VIEW}` },
              ]},
              { defaultExpanded: window.location.hash.includes(PAGE_PATH.MARKET_REPORTS), type: 'expandable-link-group', text: `Zillow Scraper`, href: `#${PAGE_PATH.MARKET_REPORTS}`, items: [
                { type: 'link', text: `[BROKEN] Dashboard`, href: `#${PAGE_PATH.MARKET_REPORTS}` },
              ]},
            ]}
          />
        }*/
        /*notifications={
          <Flashbar
            items={[
              {
                type: 'info',
                dismissible: true,
                content: 'This is an info flash message.',
                id: 'message_1',
              },
            ]}
          />
        }*/
        toolsHide={true}
        navigationHide={true}
        /*tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}*/
        content={children}
        /*splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}*/
      />
    </I18nProvider>
  );
}