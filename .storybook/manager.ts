import { PopoverProvider } from 'storybook/internal/components';

// Storybook 10 currently renders some internal popovers without an explicit ariaLabel.
// This patch provides a fallback label for manager-side popovers and suppresses the
// warning about Storybook 11 requiring ariaLabel on PopoverProvider.
if (PopoverProvider && !PopoverProvider.defaultProps?.ariaLabel) {
  PopoverProvider.defaultProps = {
    ...PopoverProvider.defaultProps,
    ariaLabel: 'Storybook popover',
  };
}
