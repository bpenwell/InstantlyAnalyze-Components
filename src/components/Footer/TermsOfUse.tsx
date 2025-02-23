import React from 'react';
import { Box, TextContent } from '@cloudscape-design/components';

export const TermsOfUse: React.FC = () => {
  return (
    <Box
      padding="l"
      margin={{ top: 'l' }}
      textAlign="center"
    >
      <TextContent>
        <small>The calculators provided by this tool are intended for informational and educational purposes only, and should not be construed as investment advice. We strongly recommend consulting with a real estate professional before making any investment decisions. The results produced by this tool may not accurately reflect the actual returns of your investments. We are not liable for any decisions made based on the information provided by this calculator. Furthermore, we are not responsible for any errors or omissions, whether human or mechanical, in the calculations. This tool may use property details from third-party sources, and we do not guarantee the accuracy, completeness, or suitability of this information. It is your responsibility to verify that the property details used are accurate and appropriate for your specific use case.</small>
      </TextContent>
    </Box>
  );
};