export const getHandingDisplayName = (handing: string) => {
  switch (handing) {
    case 'lh-in':
      return 'Left Hand In-Swing';
    case 'lh-out':
      return 'Left Hand Out-Swing';
    case 'rh-in':
      return 'Right Hand In-Swing';
    case 'rh-out':
      return 'Right Hand Out-Swing';
    default:
      return handing;
  }
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};