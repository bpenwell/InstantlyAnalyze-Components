import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AuthenticatedPage } from './AuthenticatedPage';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/AuthenticatedPage',
  component: AuthenticatedPage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AuthenticatedPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AuthenticatedPage> = (args) => <AuthenticatedPage {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
/*Primary.args = {
  primary: true,
  label: 'Button',
};*/