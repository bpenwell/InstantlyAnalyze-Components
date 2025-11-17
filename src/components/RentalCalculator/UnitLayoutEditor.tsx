import React, { useState, useEffect } from 'react';
import {
  SpaceBetween,
  ExpandableSection,
  Button,
  Alert,
  Box,
  Input as CloudscapeInput,
  FormField,
  Modal,
  Container,
  Header,
} from '@cloudscape-design/components';
import { LoadingBar } from '../LoadingBar/LoadingBar';
import { Input } from '../Input/Input';
import {
  IUnitLayout,
  IMultiFamilyDetails,
  getTotalUnitsFromLayouts,
  convertLayoutsToUnits,
  parseCurrencyStringToNumber,
  BackendAPI,
  PropertyInformation,
  PropertyType,
  displayAsMoney,
  IRentcastEstimatedRent,
} from '@bpenwell/instantlyanalyze-module';
import { v4 as uuidv4 } from 'uuid';

export interface UnitLayoutEditorProps {
  /** Multi-family details containing layouts */
  multiFamilyDetails: IMultiFamilyDetails;
  /** Callback when layouts change */
  onLayoutsChange: (layouts: IUnitLayout[]) => void;
  /** Target number of units (from propertyInformation.numberOfUnits) */
  targetNumberOfUnits: number;
  /** Whether the property is being rehabbed */
  isRehabbingProperty: boolean;
  /** Property information for rent estimation */
  propertyInformation?: PropertyInformation;
}

export const UnitLayoutEditor: React.FC<UnitLayoutEditorProps> = ({
  multiFamilyDetails,
  onLayoutsChange,
  targetNumberOfUnits,
  isRehabbingProperty,
  propertyInformation,
}) => {
  const [layouts, setLayouts] = useState<IUnitLayout[]>(
    multiFamilyDetails.layouts || []
  );
  const [rentEstimateModal, setRentEstimateModal] = useState<{
    show: boolean;
    layoutId: string | null;
    loading: boolean;
    rentEstimate: IRentcastEstimatedRent | null;
    selectedRent: number | null;
  }>({
    show: false,
    layoutId: null,
    loading: false,
    rentEstimate: null,
    selectedRent: null,
  });

  const backendAPI = new BackendAPI();

  // Calculate total units from layouts
  const totalUnits = getTotalUnitsFromLayouts(layouts);
  const unitMismatch = totalUnits !== targetNumberOfUnits;

  // Update parent when layouts change
  useEffect(() => {
    onLayoutsChange(layouts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts]); // Only depend on layouts, not onLayoutsChange to avoid infinite loops

  const handleLayoutChange = (
    layoutId: string,
    field: keyof IUnitLayout,
    value: number
  ) => {
    setLayouts((prevLayouts) =>
      prevLayouts.map((layout) =>
        layout.id === layoutId ? { ...layout, [field]: value } : layout
      )
    );
  };

  const addLayout = () => {
    const newLayout: IUnitLayout = {
      id: uuidv4(),
      bedrooms: 2,
      bathrooms: 1,
      sqft: 800,
      monthlyRent: 1000,
      count: 1,
      rehabCostsPerUnit: isRehabbingProperty ? 0 : undefined,
    };
    setLayouts([...layouts, newLayout]);
  };

  const removeLayout = (layoutId: string) => {
    setLayouts(layouts.filter((layout) => layout.id !== layoutId));
  };

  const handleGetRentEstimate = async (layoutId: string) => {
    const layout = layouts.find((l) => l.id === layoutId);
    if (!layout || !propertyInformation) return;

    setRentEstimateModal({
      show: true,
      layoutId,
      loading: true,
      rentEstimate: null,
      selectedRent: null,
    });

    try {
      const propInfo: PropertyInformation = {
        ...propertyInformation,
        bedrooms: layout.bedrooms,
        bathrooms: layout.bathrooms,
        sqft: layout.sqft,
        propertyType: PropertyType.MULTI_FAMILY,
      };

      const estimate = await backendAPI.fetchPropertyRentEstimate(propInfo);

      if (!(estimate as any).error) {
        setRentEstimateModal({
          show: true,
          layoutId,
          loading: false,
          rentEstimate: estimate,
          selectedRent: null,
        });
      } else {
        setRentEstimateModal({
          show: false,
          layoutId: null,
          loading: false,
          rentEstimate: null,
          selectedRent: null,
        });
      }
    } catch (error) {
      console.error('Error fetching rent estimate:', error);
      setRentEstimateModal({
        show: false,
        layoutId: null,
        loading: false,
        rentEstimate: null,
        selectedRent: null,
      });
    }
  };

  const handleApplyRentEstimate = (rent: number) => {
    if (!rentEstimateModal.layoutId) return;

    setLayouts((prevLayouts) =>
      prevLayouts.map((layout) =>
        layout.id === rentEstimateModal.layoutId
          ? { ...layout, monthlyRent: rent }
          : layout
      )
    );

    setRentEstimateModal({
      show: false,
      layoutId: null,
      loading: false,
      rentEstimate: null,
      selectedRent: null,
    });
  };

  return (
    <SpaceBetween size="s">
      <Alert
        type={unitMismatch ? 'warning' : 'info'}
        dismissible={false}
      >
        {unitMismatch ? (
          <>
            <strong>Unit count mismatch:</strong> You have configured {totalUnits} total units, but the property has {targetNumberOfUnits} units. Please adjust the counts below.
          </>
        ) : (
          <>
            Define unit layouts by specifying the configuration (bedrooms, bathrooms, sqft, rent) and how many units share that layout. For example, a triplex with 2x 2bed/2bath units and 1x 1bed/1bath unit would have two layouts.
          </>
        )}
      </Alert>

      {layouts.map((layout, index) => (
        <ExpandableSection
          key={layout.id}
          headerText={`Layout ${index + 1}: ${layout.count}x ${layout.bedrooms}bed / ${layout.bathrooms}bath (${layout.sqft} sqft)`}
          variant="container"
          defaultExpanded={index === 0 || layouts.length === 1}
        >
          <SpaceBetween size="m">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              <Input
                id={`layout-${layout.id}-bedrooms`}
                label="Bedrooms"
                type="number"
                value={layout.bedrooms}
                onChange={(value: string) => {
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleLayoutChange(layout.id, 'bedrooms', numValue);
                  }
                }}
              />
              <Input
                id={`layout-${layout.id}-bathrooms`}
                label="Bathrooms"
                type="number"
                value={layout.bathrooms}
                onChange={(value: string) => {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleLayoutChange(layout.id, 'bathrooms', numValue);
                  }
                }}
              />
              <Input
                id={`layout-${layout.id}-sqft`}
                label="Square Feet"
                type="number"
                value={layout.sqft}
                onChange={(value: string) => {
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleLayoutChange(layout.id, 'sqft', numValue);
                  }
                }}
              />
              <Input
                id={`layout-${layout.id}-count`}
                label="Number of Units"
                type="number"
                value={layout.count}
                onChange={(value: string) => {
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue) && numValue >= 1) {
                    handleLayoutChange(layout.id, 'count', numValue);
                  }
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isRehabbingProperty ? '1fr 1fr' : '1fr',
                gap: '12px',
              }}
            >
              <Input
                id={`layout-${layout.id}-rent`}
                label="Monthly Rent (per unit)"
                type="currency"
                value={layout.monthlyRent}
                onChange={(value: string) => {
                  const numValue = parseCurrencyStringToNumber(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleLayoutChange(layout.id, 'monthlyRent', numValue);
                  }
                }}
              />
              {isRehabbingProperty && (
                <Input
                  id={`layout-${layout.id}-rehab`}
                  label="Rehab Costs (per unit, optional)"
                  type="currency"
                  value={layout.rehabCostsPerUnit || 0}
                  onChange={(value: string) => {
                    const numValue = parseCurrencyStringToNumber(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      handleLayoutChange(layout.id, 'rehabCostsPerUnit', numValue);
                    }
                  }}
                />
              )}
            </div>

            {propertyInformation && (
              <Box>
                <Button
                  formAction="none"
                  variant="primary"
                  iconName="gen-ai"
                  onClick={() => handleGetRentEstimate(layout.id)}
                >
                  Estimate Rent
                </Button>
              </Box>
            )}

            {layouts.length > 1 && (
              <Box>
                <Button
                  formAction="none"
                  variant="normal"
                  iconName="remove"
                  onClick={() => removeLayout(layout.id)}
                >
                  Remove this layout
                </Button>
              </Box>
            )}
          </SpaceBetween>
        </ExpandableSection>
      ))}

      <Box>
        <Button formAction="none" variant="normal" iconName="add-plus" onClick={addLayout}>
          Add another layout
        </Button>
      </Box>

      <div
        style={{
          padding: '12px',
          backgroundColor: unitMismatch ? '#fef6e7' : '#f2f8f2',
          borderRadius: '8px',
          border: `2px solid ${unitMismatch ? '#f89406' : '#4caf50'}`,
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
          Total Units: {totalUnits} / {targetNumberOfUnits}
        </div>
        <div style={{ fontSize: '13px', color: '#687078' }}>
          {unitMismatch
            ? `Please adjust counts to match ${targetNumberOfUnits} total units`
            : 'All units configured correctly'}
        </div>
      </div>

      {/* Rent Estimate Modal */}
      <Modal
        visible={rentEstimateModal.show}
        onDismiss={() =>
          setRentEstimateModal({
            show: false,
            layoutId: null,
            loading: false,
            rentEstimate: null,
            selectedRent: null,
          })
        }
        header="Rent Estimate"
        size="large"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() =>
                  setRentEstimateModal({
                    show: false,
                    layoutId: null,
                    loading: false,
                    rentEstimate: null,
                    selectedRent: null,
                  })
                }
              >
                Cancel
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        {rentEstimateModal.loading && <LoadingBar text="Fetching rent estimate..." />}

        {rentEstimateModal.rentEstimate && !rentEstimateModal.loading && (
          <Container header={<Header variant="h3">Select rent estimate</Header>}>
            <SpaceBetween size="m">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Conservative Option */}
                <div
                  onClick={() => handleApplyRentEstimate(rentEstimateModal.rentEstimate!.propertyData.rentRangeLow)}
                  style={{
                    padding: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0073bb';
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Conservative</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0073bb' }}>
                    {displayAsMoney(rentEstimateModal.rentEstimate.propertyData.rentRangeLow, 0, '$', false, true)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#687078', marginTop: '4px' }}>Lower end of market range</div>
                </div>

                {/* Recommended Option */}
                <div
                  onClick={() => handleApplyRentEstimate(rentEstimateModal.rentEstimate!.propertyData.rent)}
                  style={{
                    padding: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0073bb';
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Recommended</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0073bb' }}>
                    {displayAsMoney(rentEstimateModal.rentEstimate.propertyData.rent, 0, '$', false, true)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#687078', marginTop: '4px' }}>Market average estimate</div>
                </div>

                {/* Optimistic Option */}
                <div
                  onClick={() => handleApplyRentEstimate(rentEstimateModal.rentEstimate!.propertyData.rentRangeHigh)}
                  style={{
                    padding: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0073bb';
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Optimistic</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0073bb' }}>
                    {displayAsMoney(rentEstimateModal.rentEstimate.propertyData.rentRangeHigh, 0, '$', false, true)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#687078', marginTop: '4px' }}>Higher end of market range</div>
                </div>
              </div>
            </SpaceBetween>
          </Container>
        )}
      </Modal>
    </SpaceBetween>
  );
};
