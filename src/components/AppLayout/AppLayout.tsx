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
import { PAGE_PATH } from '@bpenwell/rei-module';

const LOCALE = 'en';

//Generate prop interface which passes children
export interface IAppLayoutPreview {
  children: React.ReactNode;
};

export const AppLayoutPreview = (props: IAppLayoutPreview) => {
  const { children } = props;
  const path = window.location.hash;
  const breadcrumbPath = path.split('/');
  let breadcrumbItems: {text: string, href:string}[] = [];
  breadcrumbPath.forEach((p) => {
    if(p.includes('#')) { return; }
    const redirectPath = path.split(p)[0]; //everything before the current path
    breadcrumbItems.push({ text: p.toUpperCase(), href: `${redirectPath}${p}` });
  });

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={breadcrumbItems}
          />
        }
        navigation={
          <SideNavigation
            header={{
              href: '',
              text: 'Products',
            }}
            items={[
              { type: 'link', text: `Rental Report`, href: `#${PAGE_PATH.RENTAL_CALCULATOR_HOME}` },
              { type: 'link', text: `Zillow Scraper`, href: `#${PAGE_PATH.ZILLOW_SCRAPER}` },
            ]}
          />
        }
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
        /*tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}*/
        content={children}
        /*splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}*/
      />
    </I18nProvider>
  );
}