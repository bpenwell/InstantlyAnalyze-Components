import React from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Badge,
} from '@cloudscape-design/components';
import { 
  PAGE_PATH,
  RedirectAPI,
} from '@bpenwell/instantlyanalyze-module';

export interface QuickActionsCardProps {
  recentSearches?: string[];
  savedProperties?: number;
  onNewAnalysis?: () => void;
}

// Mock data for demonstration
const mockQuickActionsData = {
  recentSearches: [
    'Denver, CO - Multi-family',
    'Austin, TX - Single family',
    'Phoenix, AZ - Condos',
  ],
  savedProperties: 8,
  recentAnalyses: [
    { address: '123 Main St, Denver CO', date: '2024-09-08', type: 'Rental Analysis' },
    { address: '456 Oak Ave, Austin TX', date: '2024-09-07', type: 'Fix & Flip' },
    { address: '789 Pine Rd, Phoenix AZ', date: '2024-09-05', type: 'BRRRR Analysis' },
  ],
};

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  recentSearches = mockQuickActionsData.recentSearches,
  savedProperties = mockQuickActionsData.savedProperties,
  onNewAnalysis,
}) => {
  const redirectAPI = new RedirectAPI();

  const handleNewAnalysis = () => {
    // Navigate to main analysis page
    window.location.href = redirectAPI.createRedirectUrl(PAGE_PATH.HOME);
    onNewAnalysis?.();
  };

  const handleViewSavedSearches = () => {
    // TODO: Navigate to saved searches page when implemented
    console.log('View saved searches clicked');
  };

  const handleViewReports = () => {
    // TODO: Navigate to reports history when implemented  
    console.log('View all reports clicked');
  };

  return (
    <Container
      header={
        <Header variant="h2">
          Quick Actions
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* Primary Actions */}
        <Box>
          <SpaceBetween size="s">
            <Button
              variant="primary"
              iconName="add-plus"
              onClick={handleNewAnalysis}
              fullWidth
            >
              Start New Property Analysis
            </Button>
            
            <SpaceBetween direction="horizontal" size="s">
              <Button
                variant="normal"
                iconName="search"
                onClick={handleViewSavedSearches}
                fullWidth
              >
                Saved Searches
              </Button>
              
              <Button
                variant="normal"
                iconName="download"
                onClick={handleViewReports}
                fullWidth
              >
                My Reports
              </Button>
            </SpaceBetween>
          </SpaceBetween>
        </Box>

        {/* Recent Activity */}
        <Box>
          <SpaceBetween size="s">
            <div>
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <strong>Recent Searches</strong>
                <Badge>{recentSearches.length}</Badge>
              </SpaceBetween>
            </div>
            
            <SpaceBetween size="xs">
              {recentSearches.slice(0, 3).map((search, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, var(--color-background-layout-panel-content) 0%, rgba(26, 115, 232, 0.02) 100%)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-divider-default)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => console.log(`Clicked search: ${search}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'var(--color-border-button-primary-default)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--color-border-divider-default)';
                  }}
                >
                  {/* Subtle hover effect background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(26, 115, 232, 0.05) 50%, transparent 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }} />
                  
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      flex: 1
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-background-button-primary-default)',
                        opacity: 0.6
                      }} />
                      <span style={{ fontWeight: '500' }}>{search}</span>
                    </div>
                    <Button
                      variant="icon"
                      iconName="angle-right-double"
                      ariaLabel={`Resume search: ${search}`}
                    />
                  </SpaceBetween>
                </div>
              ))}
            </SpaceBetween>
            
            {recentSearches.length > 3 && (
              <Button
                variant="inline-link"
                onClick={handleViewSavedSearches}
              >
                View all searches ({recentSearches.length})
              </Button>
            )}
          </SpaceBetween>
        </Box>

        {/* Recent Analyses */}
        <Box>
          <SpaceBetween size="s">
            <div>
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <strong>Recent Analyses</strong>
                <Badge>{mockQuickActionsData.recentAnalyses.length}</Badge>
              </SpaceBetween>
            </div>
            
            <SpaceBetween size="xs">
              {mockQuickActionsData.recentAnalyses.map((analysis, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-background-layout-panel-content)',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-divider-default)',
                    cursor: 'pointer',
                  }}
                  onClick={() => console.log(`Clicked analysis: ${analysis.address}`)}
                >
                  <SpaceBetween size="xs">
                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                      {analysis.address}
                    </div>
                    <SpaceBetween direction="horizontal" size="xs">
                      <Badge color="blue">{analysis.type}</Badge>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-text-body-secondary)' 
                      }}>
                        {new Date(analysis.date).toLocaleDateString()}
                      </span>
                    </SpaceBetween>
                  </SpaceBetween>
                </div>
              ))}
            </SpaceBetween>
            
            <Button
              variant="inline-link"
              onClick={handleViewReports}
            >
              View all reports
            </Button>
          </SpaceBetween>
        </Box>

        {/* Saved Properties Summary */}
        <Box>
          <SpaceBetween direction="horizontal" size="s" alignItems="center">
            <div>
              <strong>Saved Properties:</strong>
            </div>
            <Badge color="green">{savedProperties}</Badge>
            <Button
              variant="inline-link"
              iconName="external"
            >
              Manage saved
            </Button>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Container>
  );
};
