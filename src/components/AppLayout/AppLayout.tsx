'use client';
import React from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
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

export const AppLayoutPreview = () => {
  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        /*breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Service', href: '#' },
            ]}
          />
        }*/
        navigation={
          <SideNavigation
            header={{
              href: '',
              text: 'Products',
            }}
            items={[
              { type: 'link', text: `Rental Report`, href: `${PAGE_PATH.RENTAL_CALCULATOR_HOME}` },
              { type: 'link', text: `Zillow Scraper`, href: `${PAGE_PATH.ZILLOW_SCRAPER}` },
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
        toolsOpen={true}
        /*tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}*/
        content={
          <ContentLayout
            header={
              <Header variant="h1" info={<Link variant="info">Info</Link>}>
                Home Page
              </Header>
            }
          >
            <Container
              header={
                <Header variant="h2" description="Container description">
                  Container header
                </Header>
              }
            >
              <div className="contentPlaceholder" />
            </Container>
          </ContentLayout>
        }
        /*splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}*/
      />
    </I18nProvider>
  );
}