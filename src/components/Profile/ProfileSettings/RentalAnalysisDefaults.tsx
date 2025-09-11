import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Alert,
  Spinner,
  Box,
  ExpandableSection,
  Grid,
  StatusIndicator,
  Badge,
} from '@cloudscape-design/components';
import { useAppContext } from '../../../utils/AppContextProvider';
import { IDefaultRentalInputs, defaultRentalInputs } from '@bpenwell/instantlyanalyze-module';
import { PurchaseDefaults } from './DefaultsCategories/PurchaseDefaults';
import { LoanDefaults } from './DefaultsCategories/LoanDefaults';
import { IncomeDefaults } from './DefaultsCategories/IncomeDefaults';
import { ExpenseDefaults } from './DefaultsCategories/ExpenseDefaults';
import { StrategyDefaults } from './DefaultsCategories/StrategyDefaults';
import './RentalAnalysisDefaults.css';

export interface RentalAnalysisDefaultsProps {
  onClose?: () => void;
}

export const RentalAnalysisDefaults: React.FC<RentalAnalysisDefaultsProps> = ({ onClose }) => {
  const { getDefaultRentalInputs, setDefaultRentalInputs } = useAppContext();
  
  // TODO: Backend Integration Required
  // - Validate that setDefaultRentalInputs properly saves to backend
  // - Add error handling for failed API calls
  // - Implement proper loading states during save operations
  // - Add validation for input ranges and business rules
  // - Consider adding reset confirmation dialogs
  
  // State management
  const [currentDefaults, setCurrentDefaults] = useState<IDefaultRentalInputs>(getDefaultRentalInputs());
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['purchase']));

  // Initialize with current user defaults
  useEffect(() => {
    const userDefaults = getDefaultRentalInputs();
    setCurrentDefaults(userDefaults);
  }, [getDefaultRentalInputs]);

  // Check if current values differ from system defaults
  const hasChangesFromSystemDefaults = () => {
    return JSON.stringify(currentDefaults) !== JSON.stringify(defaultRentalInputs);
  };

  // Check if current values differ from saved user defaults
  useEffect(() => {
    const savedDefaults = getDefaultRentalInputs();
    setHasUnsavedChanges(JSON.stringify(currentDefaults) !== JSON.stringify(savedDefaults));
  }, [currentDefaults, getDefaultRentalInputs]);

  // Handle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Handle category updates
  const handleDefaultsChange = (category: keyof IDefaultRentalInputs, updates: any) => {
    setCurrentDefaults(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates,
      },
    }));
  };

  // Save changes
  const handleSave = async () => {
    setSaveStatus('saving');
    setIsLoading(true);
    
    try {
      await setDefaultRentalInputs(currentDefaults);
      setSaveStatus('success');
      setHasUnsavedChanges(false);
      
      // Reset success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save rental analysis defaults:', error);
      setSaveStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to system defaults
  const handleResetToSystemDefaults = () => {
    setCurrentDefaults(defaultRentalInputs);
  };

  // Reset to saved user defaults
  const handleResetToUserDefaults = () => {
    setCurrentDefaults(getDefaultRentalInputs());
  };

  // Expand all sections
  const handleExpandAll = () => {
    setExpandedSections(new Set(['purchase', 'loan', 'income', 'expenses', 'strategy']));
  };

  // Collapse all sections
  const handleCollapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Customize your default values for rental property analysis. These settings will be used as starting points for new property evaluations."
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                onClick={handleCollapseAll}
                disabled={expandedSections.size === 0}
              >
                Collapse All
              </Button>
              <Button
                variant="normal"
                onClick={handleExpandAll}
                disabled={expandedSections.size === 5}
              >
                Expand All
              </Button>
              {onClose && (
                <Button variant="normal" onClick={onClose}>
                  Close
                </Button>
              )}
            </SpaceBetween>
          }
        >
          Analysis Defaults
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* Status Alerts */}
        {saveStatus === 'success' && (
          <Alert type="success" dismissible onDismiss={() => setSaveStatus('idle')}>
            Your rental analysis defaults have been saved successfully!
          </Alert>
        )}
        
        {saveStatus === 'error' && (
          <Alert type="error" dismissible onDismiss={() => setSaveStatus('idle')}>
            Failed to save your defaults. Please try again.
          </Alert>
        )}

        {hasUnsavedChanges && (
          <Alert type="info">
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <StatusIndicator type="pending">You have unsaved changes</StatusIndicator>
              <span>Remember to save your changes before leaving this page.</span>
            </SpaceBetween>
          </Alert>
        )}

        {/* Action Bar */}
        <Box>
          <Grid gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } }
          ]}>
            <div className="defaults-status-section">
              <SpaceBetween direction="horizontal" size="s" alignItems="center">
                <Badge color={hasChangesFromSystemDefaults() ? 'blue' : 'grey'}>
                  {hasChangesFromSystemDefaults() ? 'Customized' : 'System Defaults'}
                </Badge>
                {hasUnsavedChanges && (
                  <Badge color="red">Unsaved Changes</Badge>
                )}
              </SpaceBetween>
            </div>
            
            <div className="defaults-actions">
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="normal"
                  onClick={handleResetToUserDefaults}
                  disabled={!hasUnsavedChanges}
                >
                  Reset Changes
                </Button>
                <Button
                  variant="normal"
                  onClick={handleResetToSystemDefaults}
                  disabled={!hasChangesFromSystemDefaults()}
                >
                  Reset to System Defaults
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isLoading}
                  loading={saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
              </SpaceBetween>
            </div>
          </Grid>
        </Box>

        {/* Configuration Sections */}
        <SpaceBetween size="m">
          {/* Purchase Details */}
          <ExpandableSection
            headerText="Purchase Details"
            expanded={expandedSections.has('purchase')}
            onChange={() => toggleSection('purchase')}
            headerActions={
              <Badge color="blue">
                2 settings
              </Badge>
            }
          >
            <PurchaseDefaults
              values={currentDefaults.purchaseDetails}
              onChange={(updates) => handleDefaultsChange('purchaseDetails', updates)}
            />
          </ExpandableSection>

          {/* Loan Details */}
          <ExpandableSection
            headerText="Financing Details"
            expanded={expandedSections.has('loan')}
            onChange={() => toggleSection('loan')}
            headerActions={
              <Badge color="blue">
                6 settings
              </Badge>
            }
          >
            <LoanDefaults
              values={currentDefaults.loanDetails}
              onChange={(updates) => handleDefaultsChange('loanDetails', updates)}
            />
          </ExpandableSection>

          {/* Rental Income */}
          <ExpandableSection
            headerText="Income Projections"
            expanded={expandedSections.has('income')}
            onChange={() => toggleSection('income')}
            headerActions={
              <Badge color="blue">
                2 settings
              </Badge>
            }
          >
            <IncomeDefaults
              values={currentDefaults.rentalIncome}
              onChange={(updates) => handleDefaultsChange('rentalIncome', updates)}
            />
          </ExpandableSection>

          {/* Expense Details */}
          <ExpandableSection
            headerText="Operating Expenses"
            expanded={expandedSections.has('expenses')}
            onChange={() => toggleSection('expenses')}
            headerActions={
              <Badge color="blue">
                13 settings
              </Badge>
            }
          >
            <ExpenseDefaults
              values={currentDefaults.expenseDetails}
              onChange={(updates) => handleDefaultsChange('expenseDetails', updates)}
            />
          </ExpandableSection>

          {/* Strategy Details */}
          <ExpandableSection
            headerText="Investment Strategy"
            expanded={expandedSections.has('strategy')}
            onChange={() => toggleSection('strategy')}
            headerActions={
              <Badge color="blue">
                4 settings
              </Badge>
            }
          >
            <StrategyDefaults
              values={currentDefaults.strategyDetails}
              onChange={(updates) => handleDefaultsChange('strategyDetails', updates)}
            />
          </ExpandableSection>
        </SpaceBetween>

        {/* Loading Overlay */}
        {isLoading && (
          <Box textAlign="center">
            <Spinner size="normal" />
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
};
