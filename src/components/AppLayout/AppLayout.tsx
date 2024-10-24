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
import { PAGE_PATH, toUpperCamelCase } from '@bpenwell/rei-module';

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
  let previousPath = '';
  breadcrumbPath.forEach((path) => {
    if(path.includes('#')) { return; }
    breadcrumbItems.push({ text: toUpperCamelCase(path).replace('-', ' '), href: `#/${previousPath}${path}` });
    previousPath += `${path}/`;
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
              { defaultExpanded: window.location.hash.includes(PAGE_PATH.RENTAL_CALCULATOR_HOME), type: 'expandable-link-group', text: `Rental Property Calculator`, href: `#${PAGE_PATH.RENTAL_CALCULATOR_HOME}`, items: [
                { type: 'link', text: `Dashboard`, href: `#${PAGE_PATH.RENTAL_CALCULATOR_VIEW}` },
              ]},
              { defaultExpanded: window.location.hash.includes(PAGE_PATH.ZILLOW_SCRAPER), type: 'expandable-link-group', text: `Zillow Scraper`, href: `#${PAGE_PATH.ZILLOW_SCRAPER}`, items: [
                { type: 'link', text: `[BROKEN] Dashboard`, href: `#${PAGE_PATH.ZILLOW_SCRAPER}` },
              ]},
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